import nodemailer from "nodemailer";

export const getTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_APP_PASSWORD;

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export const verifyTransporter = async () => {
  const transporter = getTransporter();
  try {
    await transporter.verify();
    return { success: true };
  } catch (error: any) {
    console.error("[SMTP Verification Error]: Failed to connect to email provider.", error);
    return { success: false, error: "Email service is temporarily unavailable. Please try again later." };
  }
};

export const sendOtpEmail = async (email: string, otp: string) => {
  const transporter = getTransporter();
  
  const mailOptions = {
    from: `"CareerMate" <${process.env.EMAIL_USER}>`,
    replyTo: process.env.EMAIL_USER,
    to: email.toLowerCase(),
    subject: "Verify your CareerMate account",
    text: `Your CareerMate verification code is:\n\n${otp}\n\nThis code expires in 10 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #10b981; font-weight: 800;">Welcome to CareerMate!</h2>
        <p style="color: #4b5563; font-size: 14px;">Your CareerMate verification code is:</p>
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 12px; text-align: center; font-size: 32px; font-weight: 900; letter-spacing: 4px; color: #111827; margin: 24px 0;">
          ${otp}
        </div>
        <p style="color: #9ca3af; font-size: 12px;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] OTP successfully sent to ${email.toLowerCase()}`);
    return { success: true };
  } catch (error: any) {
    console.error("[Email Dispatch Error]: Failed to send OTP email:", error);
    return { success: false, error: "Failed to dispatch email. Please check if your address is correct, or try again later." };
  }
};

