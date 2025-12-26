import User from "./user.model.js";

export async function getMe(userId) {
  return User.findById(userId).select(
    "_id name email avatar bio emailVerified"
  );
}

export async function updateProfile(userId, data, file) {
  const update = {};

  if (data.name) update.name = data.name;
  if (data.bio) update.bio = data.bio;
  if (file) update.avatar = `/uploads/avatars/${file.filename}`;

  return User.findByIdAndUpdate(userId, update, {
    new: true,
    runValidators: true,
  }).select("_id name email avatar bio");
}

export async function getUserById(id) {
  return User.findById(id).select("_id name avatar");
}
