import { getData } from "@/lib/getData";
import { connect } from "@/config/config";
import { NextRequest, NextResponse } from "next/server";
import Notification from "@/models/notificationModel";

connect();

export async function GET(request = NextRequest) {
  try {
    const userId = await getData(request);
    const notifications = await Notification.find({ userId })
      .sort({ sentAt: -1 })
      .lean();

    return NextResponse.json({
      message: "Notifications fetched successfully.",
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request = NextRequest) {
  try {
    const userId = await getData(request);
    const { type } = await request.json();

    if (!["Reminder", "Alert"].includes(type)) {
      return NextResponse.json(
        { message: "Invalid notification type." },
        { status: 400 }
      );
    }

    const newNotification = await Notification.create({
      userId,
      type,
    });

    return NextResponse.json({
      message: "Notification created successfully.",
      notification: newNotification,
    });
  } catch (error) {
    console.error("Error creating notification:", error.message);
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request = NextRequest) {
  try {
    const userId = await getData(request);
    const { id } = await request.json();

    const deletedNotification = await Notification.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedNotification) {
      return NextResponse.json(
        { message: "Notification not found or not authorized to delete." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting notification:", error.message);
    return NextResponse.json(
      { message: "Internal server error.", error: error.message },
      { status: 500 }
    );
  }
}
