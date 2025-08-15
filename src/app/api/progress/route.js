import { getData } from "@/lib/getData";
import { connect } from "@/config/config";
import { NextRequest, NextResponse } from "next/server";
import Habit from "@/models/habitModel";

connect();

export async function GET(request = NextRequest) {
    try {
        const userId = await getData(request);
        const habits = await Habit.find({ userId });

        if (!habits.length) {
            return NextResponse.json({
                message: "No habits found.",
                data: {
                    totalHabitsCreated: 0,
                    totalHabitsCompleted: 0,
                    dailyProgress: 0,
                    weeklyProgress: 0,
                    // monthlyProgress: 0,
                    bestStreak: { count: 0, habits: [] },
                    currentActiveStreaks: 0,
                },
            });
        }

        const totalHabitsCreated = habits.length;
        const completedHabits = habits.filter(habit => habit.isCompleted);
        const totalHabitsCompleted = completedHabits.length;
        const activeHabits = habits.filter(habit => !habit.isCompleted);

        const dailyHabits = activeHabits.filter(habit => habit.recurrence === "Daily");
        const dailyProgress = Math.round(
            (dailyHabits.filter(habit => habit.progressUpdatedDate?.toISOString().split("T")[0] === new Date().toISOString().split("T")[0]).length / dailyHabits.length) * 100
        );
        const weeklyHabits = activeHabits.filter(habit => habit.recurrence === "Weekly");
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        const weeklyProgress = Math.round(
            (weeklyHabits.filter(habit => habit.progressUpdatedDate && new Date(habit.progressUpdatedDate) >= weekStart).length / weeklyHabits.length) * 100
        );

        // const monthlyHabits = activeHabits.filter(habit => habit.recurrence === "Monthly");
        // const monthStart = new Date();
        // monthStart.setDate(1);
        // const monthlyProgress = Math.round(
        //     (monthlyHabits.filter(habit => habit.progressUpdatedDate && new Date(habit.progressUpdatedDate) >= monthStart).length / monthlyHabits.length) * 100
        // );

        const bestStreaks = activeHabits.reduce((best, habit) => {
            if (habit.streakCount > (best[0]?.streakCount || 0)) {
                return [habit];
            } else if (habit.streakCount === (best[0]?.streakCount || 0)) {
                best.push(habit);
            }
            return best;
        }, []);

        const bestStreak = {
            count: bestStreaks[0]?.streakCount || 0,
            habits:
                bestStreaks.length > 1
                    ? `${bestStreaks.length} Habits`
                    : bestStreaks[0]?.name || "No habits",
            habitNames: bestStreaks.map(habit => habit.name), // For hover display
        };

        const currentActiveStreaks = activeHabits.filter(habit => habit.streakCount > 0).length;

        return NextResponse.json({
            message: "Progress data fetched successfully.",
            data: {
                totalHabitsCreated,
                totalHabitsCompleted,
                dailyProgress: isNaN(dailyProgress) ? 0 : dailyProgress,
                weeklyProgress: isNaN(weeklyProgress) ? 0 : weeklyProgress,
                // monthlyProgress: isNaN(monthlyProgress) ? 0 : monthlyProgress,
                bestStreak,
                currentActiveStreaks,
            },
        });
    } catch (error) {
        console.error("Error fetching progress data:", error);
        return NextResponse.json(
            { message: "Internal server error.", error: error.message },
            { status: 500 }
        );
    }
}
