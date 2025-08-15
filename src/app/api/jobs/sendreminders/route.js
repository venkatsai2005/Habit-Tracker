import { connect } from "@/config/config";
import User from "@/models/userModel";
import Habit from "@/models/habitModel";
import Notification from "@/models/notificationModel";
import { sendMail } from "@/lib/sendMail";
import { NextResponse } from "next/server";

connect();

async function fetchHabitsForUser(userId) {
  try {
    const habits = await Habit.find({ userId });

    const categorizedHabits = {
      daily: [],
      weekly: [],
      monthly: [],
    };

    habits.forEach((habit) => {
      const recurrence = habit.recurrence.toLowerCase();
      if (recurrence === "daily" || recurrence === "weekly" || recurrence === "monthly") {
        categorizedHabits[recurrence].push(habit);
      }
    });

    return categorizedHabits;
  } catch (error) {
    console.error(`Error fetching habits for user ${userId}:`, error.message);
    return null;
  }
}

async function sendEmailsToAllUsers() {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      console.log("No users found in the database.");
      return;
    }

    for (const user of users) {
      const habits = await fetchHabitsForUser(user._id);
      if (!habits) continue;

      const { daily, weekly, monthly } = habits;

      let habitListHTML = "";

      if (daily.length) {
        habitListHTML += `
          <h2>Daily Habits</h2>
          <ul>
            ${daily.map((habit) => `<li>${habit.name}</li>`).join("")}
          </ul>
        `;
      }

      if (weekly.length) {
        habitListHTML += `
          <h2>Weekly Habits</h2>
          <ul>
            ${weekly.map((habit) => `<li>${habit.name}</li>`).join("")}
          </ul>
        `;
      }

      if (monthly.length) {
        habitListHTML += `
          <h2>Monthly Habits</h2>
          <ul>
            ${monthly.map((habit) => `<li>${habit.name}</li>`).join("")}
          </ul>
        `;
      }

      if (!daily.length && !weekly.length && !monthly.length) {
        habitListHTML = `
          <p>You currently have no habits. Create new ones to stay productive!</p>
        `;
      }

      const subject = "Reminder Mail";
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; background-color: #A0FFBA; padding: 20px; text-align: center;">
          <div style="background: white; margin: auto; padding: 20px; border-radius: 10px; max-width: 500px;">
            <h1 style="color: black; margin-bottom: 20px;">Habit Tracker</h1>
            <div style="text-align: left; color: black;">
              <h2>Hi ${user.name || "there"},</h2>
              <p>This is a Reminder Mail from Habit Tracker which shows your pending habits for the day/week/month that you must complete to maintain your streak.</p>
              ${habitListHTML}
              <p style="margin-top: 20px;">
                Stay consistent and achieve your goals!<br>
                <strong>The Habit Tracker Team</strong>
              </p>
            </div>
          </div>
        </div>
      `;

      await sendMail(user.email, subject, htmlContent);
      console.log(`Email sent to ${user.email}`);

      // Create a notification in the database
      await Notification.create({
        userId: user._id,
        type: "Reminder",
      });

      console.log(`Notification created for user ${user._id}`);
    }

    console.log("Emails sent and notifications created successfully.");
  } catch (error) {
    console.error("Error sending emails:", error.message);
  }
}

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await sendEmailsToAllUsers();
    return NextResponse.json({
      message: "Emails sent successfully to all users.",
    });
  } catch (error) {
    console.error("Error in GET handler:", error.message);
    return NextResponse.json(
      { message: "Failed to send emails.", error: error.message },
      { status: 500 }
    );
  }
}
