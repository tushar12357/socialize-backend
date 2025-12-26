import crypto from "crypto";

export const generateEmailToken = () =>
  crypto.randomBytes(32).toString("hex");

export const hashEmailToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
