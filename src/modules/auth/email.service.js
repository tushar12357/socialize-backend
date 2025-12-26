import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  secure: false
});

export async function sendVerificationEmail(email, token) {
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: "no-reply@chat.local",
    to: email,
    subject: "Verify your email",
    html: `<a href="${link}">${link}</a>`
  });
}
