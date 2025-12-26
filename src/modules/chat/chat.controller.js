import {
  createDirectChat,
  getMyChats,
  getChatById,
  createGroupChat,
  addMember,
  removeMember,
  renameGroup
} from "./chat.service.js";

export const createDirect = async (req, res) => {
  const chat = await createDirectChat(
    req.user.id,
    req.body.userId
  );
  res.status(201).json(chat);
};

export const myChats = async (req, res) => {
  res.json(await getMyChats(req.user.id));
};

export const getChat = async (req, res) => {
  res.json(await getChatById(req.params.id, req.user.id));
};


export const createGroup = async (req, res) => {
  res.status(201).json(
    await createGroupChat(req.user.id, req.body)
  );
};

export const addToGroup = async (req, res) => {
  res.json(
    await addMember(
      req.params.id,
      req.user.id,
      req.body.userId
    )
  );
};

export const removeFromGroup = async (req, res) => {
  res.json(
    await removeMember(
      req.params.id,
      req.user.id,
      req.body.userId
    )
  );
};

export const rename = async (req, res) => {
  res.json(
    await renameGroup(
      req.params.id,
      req.user.id,
      req.body.name
    )
  );
};
