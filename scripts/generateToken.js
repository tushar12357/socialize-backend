import jwt from "jsonwebtoken";

const token = jwt.sign(
  {
    id: "user123",
    email: "test@example.com"
  },
  "supersecret",     // MUST match JWT_SECRET
  { expiresIn: "1h" }
);

console.log(token);
