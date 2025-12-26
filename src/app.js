import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import chatRoutes from "./modules/chat/chat.routes.js";
import messageRoutes from "./modules/message/message.routes.js";


const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);


app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
