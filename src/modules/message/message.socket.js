import { sendMessage } from "./message.service.js";
import Chat from "../chat/chat.model.js";
import { getUserSockets } from "../../config/socket.js";
import Message from "./message.model.js";

export async function handleSocketMessage(ws, raw) {
  let payload;
  try {
    payload = JSON.parse(raw.toString());
  } catch {
    return;
  }

  if (payload.type === "message") {
    return handleMessage(ws, payload);
  }

  if (payload.type === "seen") {
    return handleSeen(ws, payload);
  }


  if (payload.type === "typing") {
    return handleTyping(ws, payload);
  }

  if (payload.type === "reaction") {
  return handleReaction(ws, payload);
}

if (payload.type === "edit") {
  return handleEdit(ws, payload);
}

if (payload.type === "delete") {
  return handleDelete(ws, payload);
}


}

// ---------------- MESSAGE ----------------

async function handleMessage(ws, payload) {
  const { chatId, content, type } = payload;

  const message = await sendMessage({
    chatId,
    senderId: ws.userId,
    content,
    type
  });

  const chat = await Chat.findById(chatId);
  if (!chat) return;

  // 🔹 BROADCAST MESSAGE
  for (const memberId of chat.members) {
    const sockets = getUserSockets(memberId.toString());
    for (const socket of sockets) {
      socket.send(JSON.stringify({
        type: "message",
        data: message
      }));
    }
  }

  // 🔹 MARK AS DELIVERED
  await Message.findByIdAndUpdate(message._id, {
    $addToSet: {
      deliveredTo: chat.members.filter(
        m => m.toString() !== ws.userId
      )
    }
  });
}

// ---------------- SEEN ----------------

async function handleSeen(ws, payload) {
  const { messageId, chatId } = payload;

  const chat = await Chat.findById(chatId);
  if (!chat) return;

  const isMember = chat.members.some(
    m => m.toString() === ws.userId
  );
  if (!isMember) return;

  await Message.findByIdAndUpdate(messageId, {
    $addToSet: { seenBy: ws.userId }
  });

  // 🔹 NOTIFY OTHER MEMBERS
  for (const memberId of chat.members) {
    if (memberId.toString() === ws.userId) continue;

    const sockets = getUserSockets(memberId.toString());
    for (const socket of sockets) {
      socket.send(JSON.stringify({
        type: "seen",
        chatId,
        messageId,
        userId: ws.userId
      }));
    }
  }
}



async function handleTyping(ws, payload) {
  const { chatId, isTyping } = payload;

  const chat = await Chat.findById(chatId);
  if (!chat) return;

  const isMember = chat.members.some(
    m => m.toString() === ws.userId
  );
  if (!isMember) return;

  // broadcast typing to other members
  for (const memberId of chat.members) {
    if (memberId.toString() === ws.userId) continue;

    const sockets = getUserSockets(memberId.toString());
    for (const socket of sockets) {
      socket.send(JSON.stringify({
        type: "typing",
        chatId,
        userId: ws.userId,
        isTyping
      }));
    }
  }
}


async function handleReaction(ws, payload) {
  const { chatId, messageId, emoji } = payload;

  if (!emoji) return;

  const chat = await Chat.findById(chatId);
  if (!chat) return;

  const isMember = chat.members.some(
    m => m.toString() === ws.userId
  );
  if (!isMember) return;

  const message = await Message.findById(messageId);
  if (!message) return;

  const userObjectId = new mongoose.Types.ObjectId(ws.userId);

  const users = message.reactions.get(emoji) || [];

  const hasReacted = users.some(
    u => u.toString() === ws.userId
  );

  if (hasReacted) {
    // 🔴 REMOVE reaction
    message.reactions.set(
      emoji,
      users.filter(u => u.toString() !== ws.userId)
    );

    if (message.reactions.get(emoji).length === 0) {
      message.reactions.delete(emoji);
    }
  } else {
    // 🟢 ADD reaction
    message.reactions.set(emoji, [...users, userObjectId]);
  }

  await message.save();

  // 🔊 BROADCAST UPDATE
  for (const memberId of chat.members) {
    const sockets = getUserSockets(memberId.toString());
    for (const socket of sockets) {
      socket.send(JSON.stringify({
        type: "reaction",
        chatId,
        messageId,
        emoji,
        userId: ws.userId,
        action: hasReacted ? "removed" : "added"
      }));
    }
  }
}

async function handleEdit(ws, payload) {
  const { chatId, messageId, content } = payload;

  const message = await Message.findById(messageId);
  if (!message) return;

  if (message.sender.toString() !== ws.userId) return;
  if (message.deleted) return;

  message.content = content;
  message.edited = true;
  await message.save();

  const chat = await Chat.findById(chatId);
  if (!chat) return;

  for (const memberId of chat.members) {
    const sockets = getUserSockets(memberId.toString());
    for (const socket of sockets) {
      socket.send(JSON.stringify({
        type: "edit",
        chatId,
        messageId,
        content,
        edited: true
      }));
    }
  }
}

// ---------- DELETE ----------
async function handleDelete(ws, payload) {
  const { chatId, messageId } = payload;

  const message = await Message.findById(messageId);
  if (!message) return;

  if (message.sender.toString() !== ws.userId) return;

  message.deleted = true;
  message.content = null;
  message.reactions = {};
  await message.save();

  const chat = await Chat.findById(chatId);
  if (!chat) return;

  for (const memberId of chat.members) {
    const sockets = getUserSockets(memberId.toString());
    for (const socket of sockets) {
      socket.send(JSON.stringify({
        type: "delete",
        chatId,
        messageId
      }));
    }
  }
}