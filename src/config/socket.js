import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import url from "url";
import { handleSocketMessage } from "../modules/message/message.socket.js";

const clients = new Map(); // userId => Set<WebSocket>

export function initSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    try {
      const { token } = url.parse(req.url, true).query;
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      ws.userId = payload.id;

      const isFirstConnection = !clients.has(ws.userId);

      if (!clients.has(ws.userId)) {
        clients.set(ws.userId, new Set());
      }
      clients.get(ws.userId).add(ws);

      console.log("🟢 WS connected:", ws.userId);

      // 🔔 USER JUST CAME ONLINE
      if (isFirstConnection) {
        broadcastPresence(ws.userId, true);
      }

      ws.on("message", (data) => {
        handleSocketMessage(ws, data);
      });

      ws.on("close", () => {
        const set = clients.get(ws.userId);
        if (!set) return;

        set.delete(ws);
        if (set.size === 0) {
          clients.delete(ws.userId);
          console.log("🔴 WS offline:", ws.userId);

          // 🔕 USER JUST WENT OFFLINE
          broadcastPresence(ws.userId, false);
        }
      });
    } catch {
      ws.close();
    }
  });
}



export function getUserSockets(userId) {
  return clients.get(userId) || new Set();
}

export function isUserOnline(userId) {
  return clients.has(userId);
}

export function broadcastToUser(userId, payload) {
  const sockets = clients.get(userId) || [];
  for (const ws of sockets) {
    ws.send(JSON.stringify(payload));
  }
}

function broadcastPresence(userId, online) {
  const payload = {
    type: "presence",
    userId,
    online,
  };

  for (const [, sockets] of clients) {
    for (const ws of sockets) {
      ws.send(JSON.stringify(payload));
    }
  }
}
