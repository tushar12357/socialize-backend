import Chat from "./chat.model.js";
import mongoose from "mongoose";

export async function createDirectChat(userId, otherUserId) {
  if (userId === otherUserId) {
    throw new Error("Cannot chat with yourself");
  }

  // sort ids to ensure uniqueness
  const members = [userId, otherUserId].sort();

  let chat = await Chat.findOne({
    type: "direct",
    members
  });

  if (chat) return chat;

  chat = await Chat.create({
    type: "direct",
    members,
    createdBy: userId
  });

  return chat;
}

export async function getMyChats(userId) {
  return Chat.find({
    members: userId
  })
    .populate("members", "_id name avatar")
    .sort({ updatedAt: -1 });
}

export async function getChatById(chatId, userId) {
  const chat = await Chat.findById(chatId)
    .populate("members", "_id name avatar");

  if (!chat) throw new Error("Chat not found");

  const isMember = chat.members.some(
    m => m._id.toString() === userId
  );

  if (!isMember) {
    throw new Error("Access denied");
  }

  return chat;
}


export async function createGroupChat(userId, { name, members }) {
  if (!name || !members || members.length < 2) {
    throw new Error("Group must have name and at least 3 members");
  }

  const uniqueMembers = Array.from(
    new Set([...members, userId])
  );

  const chat = await Chat.create({
    type: "group",
    name,
    members: uniqueMembers,
    admins: [userId],
    createdBy: userId
  });

  return chat;
}

export async function addMember(chatId, adminId, userId) {
  const chat = await Chat.findById(chatId);
  if (!chat || chat.type !== "group") {
    throw new Error("Group not found");
  }

  if (!chat.admins.includes(adminId)) {
    throw new Error("Only admins can add members");
  }

  if (!chat.members.includes(userId)) {
    chat.members.push(userId);
    await chat.save();
  }

  return chat;
}

export async function removeMember(chatId, adminId, userId) {
  const chat = await Chat.findById(chatId);
  if (!chat || chat.type !== "group") {
    throw new Error("Group not found");
  }

  if (!chat.admins.includes(adminId)) {
    throw new Error("Only admins can remove members");
  }

  chat.members = chat.members.filter(
    m => m.toString() !== userId
  );
  chat.admins = chat.admins.filter(
    a => a.toString() !== userId
  );

  await chat.save();
  return chat;
}

export async function renameGroup(chatId, adminId, name) {
  const chat = await Chat.findById(chatId);
  if (!chat || chat.type !== "group") {
    throw new Error("Group not found");
  }

  if (!chat.admins.includes(adminId)) {
    throw new Error("Only admins can rename group");
  }

  chat.name = name;
  await chat.save();

  return chat;
}
