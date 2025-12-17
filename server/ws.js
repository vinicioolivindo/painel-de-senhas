const { WebSocketServer } = require("ws");
const sqlite3 = require("sqlite3").verbose();

const wss = new WebSocketServer({ port: PORT });


// banco SQLite
const db = new sqlite3.Database("./database.db");

// cria tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS senha (
    id INTEGER PRIMARY KEY,
    valor INTEGER
  )
`);

// inicializa senha caso esteja vazia
db.get("SELECT valor FROM senha WHERE id = 1", (err, row) => {
  if (!row) {
    db.run("INSERT INTO senha (id, valor) VALUES (1, 1)");
  }
});

wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  // envia senha atual ao conectar
  db.get("SELECT valor FROM senha WHERE id = 1", (err, row) => {
    ws.send(JSON.stringify({ type: "update", senha: row.valor }));
  });

  ws.on("message", (data) => {
    const msg = JSON.parse(data);

    if (msg.type === "next") {
      // operação atômica no banco
      db.run(
        "UPDATE senha SET valor = valor + 1 WHERE id = 1",
        function () {
          db.get("SELECT valor FROM senha WHERE id = 1", (err, row) => {
            // broadcast
            wss.clients.forEach((client) => {
              if (client.readyState === 1) {
                client.send(
                  JSON.stringify({ type: "update", senha: row.valor })
                );
              }
            });
          });
        }
      );
    }
  });
});

console.log("Servidor WebSocket com SQLite rodando na porta 8080");
