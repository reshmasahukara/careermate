import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Assuming Gmail based on common usage, or standard SMTP configuration
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true" || false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(email: string, token: string, name?: string | null) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetLink = `${appUrl}/auth/reset-password?token=${token}`;
  const userName = name || "CareerMate User";

  const mailOptions = {
    from: `"CareerMate Security" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your CareerMate Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
        <h2 style="color: #0f172a; text-align: center; margin-bottom: 24px;">Reset Your Password</h2>
        <p style="color: #334155; font-size: 16px;">Hello ${userName},</p>
        <p style="color: #334155; font-size: 16px;">We received a request to reset your password for your CareerMate account. You can reset it by clicking the button below:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="background-color: #0f172a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #64748b; font-size: 14px; text-align: center;">This link will expire in 15 minutes.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #64748b; font-size: 12px; text-align: center;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
