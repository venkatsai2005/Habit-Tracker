import { getData } from "@/lib/getData";
import { connect } from "@/config/config";
import { NextRequest, NextResponse } from "next/server";
import Habit from "@/models/habitModel";

connect();

export async function PATCH(request = NextRequest) {
  try {
    const userId = await getData(request);
    const { habitId } = await request.json();

    if (!habitId) {
      return NextResponse.json(
        { message: "Habit ID is required." },
        { status: 400 }
      );
    }

    const habit = await Habit.findOne({ _id: habitId, userId });

    if (!habit) {
      return NextResponse.json(
        { message: "Habit not found or unauthorized." },
        { status: 404 }
      );
    }

    try {
      habit.updateProgress();
      await habit.save();
    } catch (error) {
      return NextResponse.json(
        { message: error.message || "Failed to update progress." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Habit progress updated successfully.",
      data: habit,
    });
  } catch (error) {
    console.error("Error updating habit progress:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request = NextRequest) {
  try {
    const userId = await getData(request);
    const { habitId } = await request.json();

    if (!habitId) {
      return NextResponse.json(
        { message: "Habit ID is required." },
        { status: 400 }
      );
    }

    const habit = await Habit.findOne({ _id: habitId, userId });

    if (!habit) {
      return NextResponse.json(
        { message: "Habit not found or unauthorized." },
        { status: 404 }
      );
    }

    habit.completeHabit();
    await habit.save();

    return NextResponse.json({
      message: "Habit marked as complete successfully.",
      data: habit,
    });
  } catch (error) {
    console.error("Error completing habit:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}
