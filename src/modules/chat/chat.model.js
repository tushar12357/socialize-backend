import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["direct", "group"],
      default: "direct"
    },

    name: {
      type: String // only for group
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    ],

    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);


// prevent duplicate 1–1 chats
chatSchema.index(
  { members: 1, type: 1 },
  { unique: true, partialFilterExpression: { type: "direct" } }
);

export default mongoose.model("Chat", chatSchema);
