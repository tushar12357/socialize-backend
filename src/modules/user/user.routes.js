import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { avatarUpload } from "../../common/utils/upload.js";
import { me, update, getById } from "./user.controller.js";

const router = Router();

router.get("/me", authMiddleware, me);
router.patch(
  "/me",
  authMiddleware,
  avatarUpload.single("avatar"),
  update
);
router.get("/:id", authMiddleware, getById);

export default router;
