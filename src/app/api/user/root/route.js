import { getData } from "@/lib/getData";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/config/config";

connect();

export async function GET(request = NextRequest) {
    try {
        const userId = await getData(request);

        // Use `.select()` to exclude specific fields
        const user = await User.findOne({ _id: userId })
            .select("-isVerified -otp -otpExpires -updatedAt -verifyToken -verifyTokenExpiry");

        if (!user) {
            throw new Error("User not found");
        }
        return NextResponse.json({
            message: "User Found",
            data: user,
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
