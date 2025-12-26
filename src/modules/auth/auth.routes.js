import { Router } from "express";
import {
  signup,
  verify,
  password,
  login,
  refresh,
  google
} from "./auth.controller.js";

const router = Router();

router.post("/start-signup", signup);
router.get("/verify-email", verify);
router.post("/set-password", password);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/google-login", google);


export default router;
