import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: String,
    type: {
      type: String,
      enum: ["text", "image", "audio", "video"],
      default: "text",
    },

    deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      reactions: {
      type: Map,
      of: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: {}
    },
      edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

messageSchema.index({ chat: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);
