import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import {
  createDirect,
  myChats,
  getChat,
  createGroup,
  rename,
  addToGroup,
  removeFromGroup
} from "./chat.controller.js";

const router = Router();

router.post("/direct", authMiddleware, createDirect);
router.get("/", authMiddleware, myChats);
router.get("/:id", authMiddleware, getChat);
router.post("/group", authMiddleware, createGroup);
router.patch("/group/:id/name", authMiddleware, rename);
router.post("/group/:id/add", authMiddleware, addToGroup);
router.post("/group/:id/remove", authMiddleware, removeFromGroup);


export default router;
