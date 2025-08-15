import { connect } from "@/config/config";
import User from "@/models/userModel";
import { sendMail } from "@/lib/sendMail";

connect();

export async function POST(request) {
  try {
    const { email } = await request.json();
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found." }),
        { status: 404 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const subject = "Your OTP for Habit Tracker Login";
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #000000;">
        <h2>Habit Tracker OTP Verification</h2>
        <p>Hi there,</p>
        <p>Your OTP for logging into the Habit Tracker is:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="
            display: inline-block;
            padding: 10px 20px;
            font-size: 20px;
            font-weight: bold;
            color: #000000;
            background-color: #A0FFBA;
            border-radius: 5px;">
            ${otp}
          </span>
        </div>
        <p>This OTP is valid for <strong>5 minutes</strong>. Please use it to complete your login process.</p>
        <p>If you did not request this email, please ignore it.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">
          This email was sent by Habit Tracker. Please do not reply to this email.
        </p>
      </div>
    `;

    // Send OTP email
    await sendMail(email, subject, html);

    return new Response(
      JSON.stringify({ message: "OTP sent successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Send OTP Error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to send OTP." }),
      { status: 500 }
    );
  }
}
