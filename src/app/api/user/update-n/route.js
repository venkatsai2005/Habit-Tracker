import { getData } from "@/lib/getData";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/config/config";

connect();

export async function GET(request = NextRequest) {
    try {
        const userId = await getData(request);
        const user = await User.findById(userId, "preferences");

        if (!user) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Notification settings retrieved.",
            data: user.preferences,
        });
    } catch (error) {
        console.error("Error retrieving settings:", error.message);
        return NextResponse.json(
            { message: "Internal server error.", error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request = NextRequest) {
    try {
        const userId = await getData(request);
        const reqBody = await request.json();
        const { morningReminderTime, nightAlertTime } = reqBody;

        if (!morningReminderTime || !nightAlertTime) {
            return NextResponse.json(
                { message: "Both morning and night times are required." },
                { status: 400 }
            );
        }

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json(
                { message: "User not found." },
                { status: 404 }
            );
        }

        user.preferences.morningReminderTime = morningReminderTime;
        user.preferences.nightAlertTime = nightAlertTime;

        await user.save();

        return NextResponse.json({
            message: "Notification settings updated.",
        });
    } catch (error) {
        console.error("Error updating settings:", error.message);
        return NextResponse.json(
            { message: "Internal server error.", error: error.message },
            { status: 500 }
        );
    }
}
