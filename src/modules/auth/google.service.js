import { OAuth2Client } from "google-auth-library";
import User from "../user/user.model.js";
import {
  createAccessToken,
  createRefreshToken,
  hashToken
} from "../../common/utils/token.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function googleLogin(idToken) {
  if (!idToken) {
    throw new Error("Google ID token required");
  }

  // 1️⃣ Verify token with Google
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const { email, name, email_verified } = ticket.getPayload();

  if (!email_verified) {
    throw new Error("Google email not verified");
  }

  // 2️⃣ Find or create user
  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      emailVerified: true // ✅ trust Google
    });
  }

  // 3️⃣ Issue tokens
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  user.refreshTokens.push({
    tokenHash: hashToken(refreshToken)
  });

  await user.save();

  // 4️⃣ Return same response shape as normal login
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    accessToken,
    refreshToken
  };
}
