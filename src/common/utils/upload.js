import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/avatars";
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});

export const avatarUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images allowed"));
    }
    cb(null, true);
  }
});


const messageImageDir = "uploads/messages";
fs.mkdirSync(messageImageDir, { recursive: true });

const messageStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, messageImageDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});

export const messageImageUpload = multer({
  storage: messageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"));
    }
    cb(null, true);
  }
});


const voiceDir = "uploads/voices";
fs.mkdirSync(voiceDir, { recursive: true });

const voiceStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, voiceDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});

export const voiceUpload = multer({
  storage: voiceStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("audio/")) {
      return cb(new Error("Only audio files allowed"));
    }
    cb(null, true);
  }
});

const videoDir = "uploads/videos";
fs.mkdirSync(videoDir, { recursive: true });

const videoStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, videoDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});

export const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_, file, cb) => {
    const allowed = [
      "video/mp4",
      "video/webm",
      "video/quicktime", // mov
      "image/gif"        // GIFs treated as video
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only video or gif files allowed"));
    }
    cb(null, true);
  }
});
