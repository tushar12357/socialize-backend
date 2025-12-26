import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { send, list } from "./message.controller.js";
import { messageImageUpload,voiceUpload,videoUpload } from "../../common/utils/upload.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  (req, res, next) => {
    messageImageUpload.single("image")(req, res, err => {
      if (!err) return next();

      voiceUpload.single("audio")(req, res, err2 => {
        if (!err2) return next();

        videoUpload.single("video")(req, res, next);
      });
    });
  },
  send
);

router.get("/:chatId", authMiddleware, list);

export default router;
