import {
  startSignup,
  verifyEmail,
  setPassword,
  loginUser,
  refreshTokens
} from "./auth.service.js";
import { googleLogin } from "./google.service.js";

export const signup = async (req, res) =>
  res.json(await startSignup(req.body));

export const verify = async (req, res) =>
  res.json(await verifyEmail(req.query.token));

export const password = async (req, res) =>
  res.json(await setPassword(req.body));

export const login = async (req, res) =>
  res.json(await loginUser(req.body));

export const refresh = async (req, res) =>
  res.json(await refreshTokens(req.body.refreshToken));

export const google = async (req, res) => {
  res.json(await googleLogin(req.body.idToken));
};