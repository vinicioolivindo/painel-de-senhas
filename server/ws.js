const { WebSocketServer } = require("ws");
const Database = require("better-sqlite3");
const path = require("path");

const PORT = process.env.PORT || 8080;

// banco
const dbPath = path.join(process.cwd(), "database.db");
const db = new Database(dbPath);

// cria tabela
db.prepare(`
  CREATE TABLE IF NOT EXISTS senha (
    id INTEGER PRIMARY KEY,
    valor INTEGER
  )
`).run();

// inicializa senha
const row = db.prepare("SELECT valor FROM senha WHERE id = 1").get();
if (!row) {
  db.prepare("INSERT INTO senha (id, valor) VALUES (1, 1)").run();
}

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
  const current = db.prepare("SELECT valor FROM senha WHERE id = 1").get();
  ws.send(JSON.stringify({ type: "update", senha: current.valor }));

  ws.on("message", (data) => {
    const msg = JSON.parse(data);

    if (msg.type === "next") {
      db.prepare("UPDATE senha SET valor = valor + 1 WHERE id = 1").run();

      const updated = db
        .prepare("SELECT valor FROM senha WHERE id = 1")
        .get();

      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(
            JSON.stringify({ type: "update", senha: updated.valor })
          );
        }
      });
    }
  });
});

console.log(`Servidor WebSocket rodando na porta ${PORT}`);
