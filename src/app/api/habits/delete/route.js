import { getData } from "@/lib/getData";
import { connect } from "@/config/config";
import { NextRequest, NextResponse } from "next/server";
import Habit from "@/models/habitModel";

connect();

export async function DELETE(request = NextRequest) {
    try {
        const userId = await getData(request);
        const { habitId } = await request.json();

        if (!habitId) {
            return NextResponse.json(
                { message: "Habit ID is required." },
                { status: 400 }
            );
        }

        const habit = await Habit.findOneAndDelete({ _id: habitId, userId });

        if (!habit) {
            return NextResponse.json(
                { message: "Habit not found or unauthorized." },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Habit deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting habit:", error);
        return NextResponse.json(
            { message: "Internal server error.", error: error.message },
            { status: 500 }
        );
    }
}
