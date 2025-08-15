import { connect } from "@/config/config";
import User from "@/models/userModel";
import Habit from "@/models/habitModel";
import Notification from "@/models/notificationModel";
import { sendMail } from "@/lib/sendMail";
import { NextResponse } from "next/server";

connect();

async function fetchIncompleteHabitsForUser(userId) {
  try {
    const habits = await Habit.find({ userId });

    if (habits.length === 0) return "no-habits";

    const categorizedHabits = {
      daily: [],
      weekly: [],
      monthly: [],
    };

    habits.forEach((habit) => {
      if (!habit.isCompleted) {
        const recurrence = habit.recurrence.toLowerCase();
        if (recurrence === "daily" || recurrence === "weekly" || recurrence === "monthly") {
          categorizedHabits[recurrence].push(habit);
        }
      }
    });

    return categorizedHabits;
  } catch (error) {
    console.error(`Error fetching incomplete habits for user ${userId}:`, error.message);
    return null;
  }
}

async function sendAlertsToAllUsers() {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      console.log("No users found in the database.");
      return;
    }

    for (const user of users) {
      const habits = await fetchIncompleteHabitsForUser(user._id);
      if (!habits) continue;

      let alertListHTML = "";
      let bgColor = "#FB5456";
      let subject = "Alert: Incomplete Habits";

      if (habits === "no-habits") {
        alertListHTML = `
          <p style="text-align: center; font-size: 18px;">
            Hi ${user.name || "there"},<br>
            You don't have any habits set up. Add some to start tracking your progress!
          </p>
        `;
        bgColor = "#FFDD59";
        subject = "No Habits Set Up";
      } else if (
        habits.daily.length === 0 &&
        habits.weekly.length === 0 &&
        habits.monthly.length === 0
      ) {
        alertListHTML = `
          <p style="text-align: center; font-size: 18px;">
            Congratulations! 🎉 You've completed all your habits for today/week/month. Keep it up!
          </p>
        `;
        bgColor = "#A0FFBA";
        subject = "Great Job: All Habits Completed!";
      } else {
        if (habits.daily.length) {
          alertListHTML += `
            <h2>Daily Habits</h2>
            <ul>
              ${habits.daily.map((habit) => `<li>${habit.name}</li>`).join("")}
            </ul>
          `;
        }

        if (habits.weekly.length) {
          alertListHTML += `
            <h2>Weekly Habits</h2>
            <ul>
              ${habits.weekly.map((habit) => `<li>${habit.name}</li>`).join("")}
            </ul>
          `;
        }

        if (habits.monthly.length) {
          alertListHTML += `
            <h2>Monthly Habits</h2>
            <ul>
              ${habits.monthly.map((habit) => `<li>${habit.name}</li>`).join("")}
            </ul>
          `;
        }
      }

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: ${bgColor}; padding: 20px; text-align: center;">
          <div style="background: white; margin: auto; padding: 20px; border-radius: 10px; max-width: 500px;">
            <h1 style="color: black; margin-bottom: 20px;">Habit Tracker</h1>
            <div style="text-align: left; color: black;">
              ${alertListHTML}
              <p style="margin-top: 20px;">
                Stay consistent and achieve your goals!<br>
                <strong>The Habit Tracker Team</strong>
              </p>
            </div>
          </div>
        </div>
      `;

      await sendMail(user.email, subject, htmlContent);
      console.log(`Alert email sent to ${user.email}`);

      const notification = new Notification({
        userId: user._id,
        type: "Alert",
        sentAt: new Date(),
      });

      await notification.save();
      console.log(`Notification created for user ${user.email}`);
    }

    console.log("Alert emails and notifications sent successfully.");
  } catch (error) {
    console.log("Error sending alert emails:", error.message);
  }
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await sendAlertsToAllUsers();
    return NextResponse.json({
      message: "Alert emails sent successfully to all users.",
    });
  } catch (error) {
    console.log("Error in GET handler:", error.message);
    return NextResponse.json(
      { message: "Failed to send alert emails.", error: error.message },
      { status: 500 }
    );
  }
}
