import Message from "./message.model.js";
import Chat from "../chat/chat.model.js";

export async function sendMessage({
  chatId,
  senderId,
  content,
  type = "text",
}) {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new Error("Chat not found");

  const isMember = chat.members.some((m) => m.toString() === senderId);
  if (!isMember) throw new Error("Access denied");

  const message = await Message.create({
    chat: chatId,
    sender: senderId,
    content,
    type,
  });

  chat.lastMessage = message._id;
  await chat.save();

  return message;
}

export async function getMessages(chatId, userId, { limit = 20, cursor }) {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new Error("Chat not found");

  const isMember = chat.members.some((m) => m.toString() === userId);
  if (!isMember) throw new Error("Access denied");

  const query = { chat: chatId };
  if (cursor) {
    query._id = { $lt: cursor }; // cursor pagination
  }

  return Message.find(query)
    .sort({ _id: -1 })
    .limit(Number(limit))
    .populate("sender", "_id name avatar");
}
