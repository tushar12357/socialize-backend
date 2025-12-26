import { sendMessage, getMessages } from "./message.service.js";

export const send = async (req, res) => {
  let content = req.body.content;
  let type = req.body.type || "text";

  if (req.file) {
    const mime = req.file.mimetype;

    if (mime.startsWith("image/")) {
      content = `/uploads/messages/${req.file.filename}`;
      type = "image";
    }

    if (mime.startsWith("audio/")) {
      content = `/uploads/voices/${req.file.filename}`;
      type = "audio";
    }

    if (mime.startsWith("video/") || mime === "image/gif") {
      content = `/uploads/videos/${req.file.filename}`;
      type = "video";
    }
  }

  const message = await sendMessage({
    chatId: req.body.chatId,
    senderId: req.user.id,
    content,
    type,
  });

  res.status(201).json(message);
};

export const list = async (req, res) => {
  const messages = await getMessages(req.params.chatId, req.user.id, req.query);
  res.json(messages);
};
