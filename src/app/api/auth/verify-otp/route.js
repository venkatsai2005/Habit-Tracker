import { connect } from "@/config/config";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

connect();

export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not found." }),
        { status: 404 }
      );
    }

    if (!user.otp || user.otpExpires < Date.now()) {
      return new Response(
        JSON.stringify({ message: "OTP expired or invalid." }),
        { status: 400 }
      );
    }

    if (user.otp !== otp) {
      return new Response(
        JSON.stringify({ message: "Incorrect OTP." }),
        { status: 400 }
      );
    }

    //token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    user.isVerified = true;
    user.otp = null; 
    user.otpExpires = null;
    user.verifyToken = token;
    user.verifyTokenExpiry = new Date(Date.now() + 3 * 60 * 60 * 1000); // 3 hrs
    await user.save();


    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      maxAge: 3 * 60 * 60, // 3 hours
      sameSite: "strict",
    });

    return new Response(
      JSON.stringify({ message: "Login successful!" }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Failed to verify OTP." }),
      { status: 500 }
    );
  }
}
