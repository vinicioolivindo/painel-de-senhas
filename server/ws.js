import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let senhaAtual = 1;

wss.on("connection", (ws) => {
  console.log("Cliente conectado.");

  // envia a senha atual quando alguém entra
  ws.send(JSON.stringify({ type: "update", senha: senhaAtual }));

  ws.on("message", (data) => {
    const msg = JSON.parse(data);

    if (msg.type === "next") {
      senhaAtual++;

      // envia para todos os clientes (broadcast)
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(JSON.stringify({ type: "update", senha: senhaAtual }));
        }
      });
    }
  });
});

console.log("Servidor WebSocket rodando na porta 8080...");
