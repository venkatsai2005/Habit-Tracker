import { getData } from "@/lib/getData";
import { connect } from "@/config/config";
import { NextRequest, NextResponse } from "next/server";
import  Habit from "@/models/habitModel";

connect();

function calculateTimes(recurrence) {
    const now = new Date();
    const updateTime = new Date();
    const resetTime = new Date();

    switch (recurrence) {
        case "Daily":
            updateTime.setDate(now.getDate() + 1);
            resetTime.setDate(now.getDate() + 1);
            resetTime.setHours(23, 59, 59, 999);
            break;
        case "Weekly":
            updateTime.setDate(now.getDate() + 7);
            resetTime.setDate(now.getDate() + 7);
            resetTime.setHours(23, 59, 59, 999);
            break;
        case "Monthly":
            updateTime.setMonth(now.getMonth() + 1);
            resetTime.setMonth(now.getMonth() + 1);
            resetTime.setDate(new Date(now.getFullYear(), now.getMonth() + 2, 0).getDate());
            resetTime.setHours(23, 59, 59, 999);
            break;
        default:
            throw new Error("Invalid recurrence type");
    }

    return { updateTime, resetTime };
}


export async function GET(request = NextRequest) {
    try {
        const userId = await getData(request);
        const habits = await Habit.find({ userId });

        const categorizedHabits = {
            daily: [],
            weekly: [],
            monthly: [],
            completed: [],
        };

        const now = new Date();

        for (const habit of habits) {
            if (habit.resetTime && now >= habit.resetTime) {
                habit.streakCount = 0;
                habit.streakMaintained = false;

                const times = habit.recurrence ? calculateTimes(habit.recurrence) : {};
                habit.updateTime = times.updateTime || null;
                habit.resetTime = times.resetTime || null;

                await habit.save();
            }

            if (habit.isCompleted) {
                categorizedHabits.completed.push(habit);
            } else {
                categorizedHabits[habit.recurrence.toLowerCase()].push(habit);
            }
        }

        return NextResponse.json({
            message: "Habits fetched successfully, streaks checked.",
            data: categorizedHabits,
        });
    } catch (error) {
        console.log("Error fetching habits:", error.message);
        return NextResponse.json(
            { message: "Internal server error.", error: error.message },
            { status: 500 }
        );
    }
}
