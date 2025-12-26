import { getMe, updateProfile, getUserById } from "./user.service.js";

export const me = async (req, res) => {
  res.json(await getMe(req.user.id));
};

export const update = async (req, res) => {
  res.json(
    await updateProfile(req.user.id, req.body, req.file)
  );
};

export const getById = async (req, res) => {
  res.json(await getUserById(req.params.id));
};
