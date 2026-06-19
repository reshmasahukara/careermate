import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");

export async function sendVerificationEmail(email: string, otp: string) {
  try {
    // For local testing without an API key, we will just print the OTP
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "dummy_key") {
      console.log("\n=========================================");
      console.log(`✉️ MOCK EMAIL SENT TO: ${email}`);
      console.log(`🔑 VERIFICATION OTP CODE: ${otp}`);
      console.log("=========================================\n");
      return { success: true, data: { mock: true } };
    }

    const data = await resend.emails.send({
      from: "CareerMate <onboarding@resend.dev>", // Or your verified domain
      to: email,
      subject: "Verify Your CareerMate Account",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Verify Your Account</h2>
          <p>Thank you for signing up for CareerMate! Please use the following 6-digit code to verify your email address:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; margin: 0; color: #4F46E5;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
        </div>
      `,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error };
  }
}
