import jwt from "jsonwebtoken";
import crypto from "crypto";

export const createAccessToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

export const createRefreshToken = (user) =>
  jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");


export function issueTokens(user) {
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  user.refreshTokens.push({ tokenHash: hashToken(refreshToken) });
  user.save();

  return { accessToken, refreshToken };
}