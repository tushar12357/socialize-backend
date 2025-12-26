import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch(e) {
    console.log(e)
    res.sendStatus(403);
  }
};

export const verifyWSAuth = (req) => {
  const token = new URL(req.url, "http://localhost")
    .searchParams.get("token");

  return jwt.verify(token, process.env.JWT_SECRET);
};
