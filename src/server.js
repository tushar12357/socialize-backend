import "./config/env.js";
import http from "http";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./config/socket.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

await connectDB();
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
