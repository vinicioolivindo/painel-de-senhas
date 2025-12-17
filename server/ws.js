const { WebSocketServer } = require("ws");
const sqlite3 = require("sqlite3").verbose();

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

const db = new sqlite3.Database("/tmp/senhas.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS senha (
      id INTEGER PRIMARY KEY,
      valor INTEGER
    )
  `);

  db.run(`
    INSERT OR IGNORE INTO senha (id, valor)
    VALUES (1, 1)
  `);
});

function getSenha(callback) {
  db.get("SELECT valor FROM senha WHERE id = 1", (err, row) => {
    callback(row.valor);
  });
}

function incrementSenha(callback) {
  db.run("UPDATE senha SET valor = valor + 1 WHERE id = 1", callback);
}

wss.on("connection", (ws) => {
  console.log("Cliente conectado");

  getSenha((valor) => {
    ws.send(JSON.stringify({ type: "update", senha: valor }));
  });

  ws.on("message", (data) => {
    const msg = JSON.parse(data.toString());

    if (msg.type === "next") {
      incrementSenha(() => {
        getSenha((valor) => {
          wss.clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(JSON.stringify({ type: "update", senha: valor }));
            }
          });
        });
      });
    }
  });
});

console.log("Servidor WebSocket rodando na porta", PORT);
