import User from "../user/user.model.js";
import bcrypt from "bcrypt";
import {
  generateEmailToken,
  hashEmailToken,
} from "../../common/utils/emailToken.js";
import { sendVerificationEmail } from "./email.service.js";
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
  issueTokens
} from "../../common/utils/token.js";
import jwt from "jsonwebtoken";

export async function startSignup({ name, email }) {
  if (!email) {
    throw new Error("Email is required");
  }

  let user = await User.findOne({ email });

  if (user && user.emailVerified) {
    throw new Error("Email already registered");
  }

  const token = generateEmailToken();
  console.log(token)
  if (!user) {
    user = await User.create({
      name, // ✅ save name
      email,
      emailVerified: false,
      emailVerification: {
        tokenHash: hashEmailToken(token),
        expiresAt: Date.now() + 1000 * 60 * 30,
      },
    });
  } else {
    // update name in case user re-enters
    user.name = name;
    user.emailVerification = {
      tokenHash: hashEmailToken(token),
      expiresAt: Date.now() + 1000 * 60 * 30,
    };
    await user.save();
  }

  // await sendVerificationEmail(email, token);

  return { message: "Verification email sent" };
}

export async function verifyEmail(token) {
  const tokenHash = hashEmailToken(token);

  const user = await User.findOne({
    "emailVerification.tokenHash": tokenHash,
    "emailVerification.expiresAt": { $gt: Date.now() },
  });

  if (!user) throw new Error("Invalid or expired token");

  user.emailVerified = true;
  user.emailVerification = undefined;

  await user.save();

  return { message: "Email verified. Please set password." };
}

export async function setPassword({ email, password }) {
  const user = await User.findOne({ email, emailVerified: true });

  if (!user) throw new Error("Email not verified");

  user.password = await bcrypt.hash(password, 12);
  await user.save();

  return { message: "Password set successfully" };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }

  if (!user.emailVerified) {
    throw new Error("Email not verified");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new Error("Invalid credentials");
  }

  const tokens = issueTokens(user);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    ...tokens,
  };
}



export async function refreshTokens(refreshToken) {
  if (!refreshToken) {
    throw new Error("Refresh token required");
  }

  // 1️⃣ Verify refresh token signature
  const payload = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  const user = await User.findById(payload.id);
  if (!user) {
    throw new Error("Unauthorized");
  }

  const incomingTokenHash = hashToken(refreshToken);

  // 2️⃣ Check if token exists (reuse detection)
  const tokenExists = user.refreshTokens.find(
    t => t.tokenHash === incomingTokenHash
  );

  if (!tokenExists) {
    // 🚨 TOKEN REUSE DETECTED → revoke all
    user.refreshTokens = [];
    await user.save();
    throw new Error("Refresh token reuse detected");
  }

  // 3️⃣ Rotate refresh token (remove old)
  user.refreshTokens = user.refreshTokens.filter(
    t => t.tokenHash !== incomingTokenHash
  );

  const newAccessToken = createAccessToken(user);
  const newRefreshToken = createRefreshToken(user);

  user.refreshTokens.push({
    tokenHash: hashToken(newRefreshToken)
  });

  await user.save();

  // 4️⃣ Return new tokens + user
  return {
   
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}
