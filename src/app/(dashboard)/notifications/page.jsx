'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Days from "@/components/Days";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/notifications");
        const { notifications } = response.data;
        setNotifications(notifications);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        toast.error("Unable to load notifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <main className="w-full">
      <section className="ml-[49px] mr-[79px] flex-col justify-between my-7">
        <div className="top flex justify-between">
          <div className="greeting flex items-center gap-3">
            <h1 className="font-outfit font-bold text-[70px]">
              View <span className="text-[#A0FFBA]">Notifications</span>
            </h1>
          </div>
          <Days />
        </div>
        <br />
        <div className="bottom">
          <p className="text-[#F0F0F0] font-poppins text-base">
            Stay updated with your habit progress and reminders.
          </p>
        </div>
      </section>
      <br />
      <section className="ml-[49px] mr-[79px] flex-col justify-between my-7">
        {loading ? (
          <p className="text-[#F0F0F0] font-poppins">Loading notifications...</p>
        ) : notifications.length > 0 ? (
          <div className="grid gap-4">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="flex items-center justify-between w-full h-[107px] bg-[#263238] px-5 rounded-[20px] shadow-md transition-all duration-300 hover:bg-[#2F3E47]"
              >
                <div className="flex gap-4 items-center">
                  <div>
                    <h2 className="font-poppins font-semibold text-lg text-[#F0F0F0]">
                      {notification.type}
                    </h2>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#A0A0A0]">
                    Sent on: {new Date(notification.sentAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[#F0F0F0] font-poppins text-base">
            No notifications to display.
          </p>
        )}
      </section>
    </main>
  );
}
