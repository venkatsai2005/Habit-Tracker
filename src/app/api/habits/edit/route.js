import { getData } from "@/lib/getData";
import { connect } from "@/config/config";
import { NextRequest, NextResponse } from "next/server";
import Habit from "@/models/habitModel";

connect();

export async function PUT(request = NextRequest) {
    try {
        const userId = await getData(request);
        const { habitId, name, category, recurrence } = await request.json();
        if (!habitId || !name || !category || !recurrence) {
            return NextResponse.json(
                { message: "All fields (habitId, name, category, recurrence) are required." },
                { status: 400 }
            );
        }

        const updatedHabit = await Habit.findOneAndUpdate(
            { _id: habitId, userId },
            { name, category, recurrence },
            { new: true }
        );

        if (!updatedHabit) {
            return NextResponse.json(
                { message: "Habit not found or unauthorized." },
                { status: 404 }
            );
        }
        return NextResponse.json({
            message: "Habit updated successfully.",
            data: updatedHabit,
        });
    } catch (error) {
        console.error("Error updating habit:", error);
        return NextResponse.json(
            { message: "Internal server error.", error: error.message },
            { status: 500 }
        );
    }
}
