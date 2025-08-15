import { getData } from "@/lib/getData";
import { connect } from "@/config/config";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import Habit from "@/models/habitModel";

connect();

export async function POST(request = NextRequest) {
    try {
        const userId = await getData(request);
        const reqBody = await request.json();
        const { name, category, recurrence } = reqBody;

        if (!name || !category || !recurrence)
            return NextResponse.json(
                { message: "All Fields are required" },
                { status: 400 }
            )
        const user = await User.findById(userId).select("-isVerified -otp -otpExpires -updatedAt -verifyToken -verifyTokenExpiry");

        if (!user)
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            )

        const habit = new Habit({
            userId,
            name,
            category,
            recurrence
        });

        const newHabit = await habit.save();
        return NextResponse.json({
            message: "Habit created successfully",
            status: 200,
            data: newHabit,
        });

    } catch (error) {
        console.log("Error Fetching Habits:", error.message)
        return NextResponse.json({
            message: "Internal Server Error", error: error.message,
            status: 400,
        })
    }
}