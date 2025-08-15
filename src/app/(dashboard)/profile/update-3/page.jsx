"use client";
import React, { useState, useEffect } from "react";
import Days from "@/components/Days";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";

export default function NotificationSettingsPage() {
    const [settings, setSettings] = useState({
        morningReminderTime: "09:00",
        nightAlertTime: "21:00",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch current notification settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get("/api/user/update-n");
                const { data } = response.data;

                setSettings({
                    morningReminderTime: data.morningReminderTime || "09:00",
                    nightAlertTime: data.nightAlertTime || "21:00",
                });
            } catch (error) {
                console.error("Failed to fetch notification settings:", error);
                toast.error("Unable to load notification settings.");
            }
        };

        fetchSettings();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setSettings((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const response = await axios.post("/api/user/update-n", {
                morningReminderTime: settings.morningReminderTime,
                nightAlertTime: settings.nightAlertTime,
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Settings updated successfully!");
            } else {
                toast.error(response.data.message || "Failed to update settings.");
            }
        } catch (error) {
            console.error("Error updating notification settings:", error);
            toast.error(error.response?.data?.message || "An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="w-full">
            <section className="ml-[49px] mr-[79px] flex-col justify-between my-7">
                <div className="top flex justify-between">
                    <div className="greeting flex items-center gap-3">
                        <h1 className="font-outfit font-bold text-[70px]">
                            Notification <span className="text-[#A0FFBA]">Settings</span>
                        </h1>
                    </div>
                    <Days />
                </div>
                <br />
                <div className="bottom w-[549px]">
                    <p className="text-[#F0F0F0] font-poppins text-base">
                        Customize your notification preferences.
                    </p>
                </div>
            </section>
            <br />
            <section className="ml-[49px] mr-[79px] flex-col justify-between my-10 rounded-lg">
                <div className="flex flex-col gap-7">
                    <div className="flex flex-col gap-2 h-[72px] w-2/3 rounded-xl p-3 font-poppins text-sm bg-[#333F4E] text-white">
                        <label htmlFor="morningReminderTime" className="text-sm">
                            Morning Reminder Time
                        </label>
                        <input
                            className="bg-inherit outline-none"
                            type="time"
                            id="morningReminderTime"
                            value={settings.morningReminderTime}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2 h-[72px] w-2/3 rounded-xl p-3 font-poppins text-sm bg-[#333F4E] text-white">
                        <label htmlFor="nightAlertTime" className="text-sm">
                            Night Alert Time
                        </label>
                        <input
                            className="bg-inherit outline-none"
                            type="time"
                            id="nightAlertTime"
                            value={settings.nightAlertTime}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex gap-5">
                        <button
                            className={`bg-[#A0FFBA] rounded-md text-black font-outfit text-lg font-semibold h-[50px] w-[90px] ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Submit"}
                        </button>
                        <Link href={"/profile"}>
                            <button
                                className="bg-[#333F4E] rounded-md font-outfit text-lg font-semibold h-[50px] w-[90px]"
                            >
                                Back
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
            <section className="ml-[49px] mr-[79px] my-7">
                <div className="bg-yellow-500 font-outfit text-black p-4 rounded-md mb-4">
                    <p>
                        Even if you update the time according to your need, the mails will be sent
                        by default at <b>9:00 AM</b> (reminder) and <b>9:00 PM</b> (alert).
                    </p>
                    <p>
                        <strong>Reason:</strong> Free Vercel Cron Job has a limit of only 2 Jobs and executes only 1 time.
                    </p>
                </div>
                <div className="bg-red-500 font-outfit text-black p-4 rounded-md">
                    <p>
                        This application uses a free Vercel cron job to deliver the emails. As a result,
                        the reminder or alert mail may sometimes be delayed.
                    </p>
                </div>
            </section>
        </main>
    );
}
