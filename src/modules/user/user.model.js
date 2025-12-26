import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, lowercase: true },

    password: { type: String, select: false },

    emailVerified: { type: Boolean, default: false },

    avatar: { type: String },          // profile pic URL
    bio: { type: String, maxLength: 160 },

    lastSeen: { type: Date },

    refreshTokens: [
      {
        tokenHash: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],

    emailVerification: {
      tokenHash: String,
      expiresAt: Date
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
