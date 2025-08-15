import { getData } from "@/lib/getData";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/config/config";

connect();

export async function POST(request = NextRequest) {
    try {
        const userId = await getData(request);
        const reqBody = await request.json();
        const { name, username, email } = reqBody;

        if (!username || !email) {
            return NextResponse.json(
                { message: "Username and email are required." },
                { status: 400 }
            );
        }
        const user = await User.findById(userId)
            .select("-isVerified -otp -otpExpires -updatedAt -verifyToken -verifyTokenExpiry");

        if (!user) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }

        const isUsernameUnchanged = username === user.username;
        const isEmailUnchanged = email === user.email;

        if (isUsernameUnchanged && isEmailUnchanged) {
            user.name = name || user.name;
            await user.save();

            return NextResponse.json({
                message: "Profile updated successfully (name only).",
                data: user,
            });
        }

        if (!name || name.trim() === "") {
            return NextResponse.json(
                { message: "Name is required and cannot be empty." },
                { status: 400 }
            );
        }

        if (!isUsernameUnchanged) {
            const usernameExists = await User.findOne({ username, _id: { $ne: userId } });
            if (usernameExists) {
                return NextResponse.json(
                    { message: "Username is already in use." },
                    { status: 409 }
                );
            }
        }
        if (!isEmailUnchanged) {
            const emailExists = await User.findOne({ email, _id: { $ne: userId } });
            if (emailExists) {
                return NextResponse.json(
                    { message: "Email is already in use." },
                    { status: 409 }
                );
            }
        }

        user.name = name || user.name;
        user.username = username;
        user.email = email;

        await user.save();

        return NextResponse.json({
            message: "Profile updated successfully.",
            data: user,
        });
    } catch (error) {
        console.log("Error updating user profile:", error.message);
        return NextResponse.json(
            { message: "Internal server error.", error: error.message },
            { status: 500 }
        );
    }
}
