'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import Days from "@/components/Days";
import ProgressBar from "@/components/Progress";

export default function DashboardPage() {
  const [userData, setUserData] = useState({ username: "" });
  const [habits, setHabits] = useState({
    daily: [],
    completed: [],
  });
  const [progress, setProgress] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/user/root");
        const { data } = response.data;
        setUserData({ username: data.username });
      } catch (error) {
        console.log("Failed to fetch user data:", error);
        toast.error("Unable to load user data.");
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const habitsResponse = await axios.get("/api/habits");
        const { daily, completed } = habitsResponse.data.data;
        setHabits({ daily, completed });

        const progressResponse = await axios.get("/api/progress");
        setProgress(progressResponse.data.data.dailyProgress);

        const notificationsResponse = await axios.get("/api/notifications");
        setNotifications(notificationsResponse.data.notifications);
      } catch (error) {
        console.log("Error fetching dashboard data:", error.message);
        toast.error("Unable to load dashboard data.");
      }
    };
    fetchDashboardData();
  }, []);

  const renderItems = (items, type) => {
    const displayedItems = items.slice(0, 3);
    return (
      <>
        {displayedItems.map((item, index) => (
          <p key={index} className="font-outfit text-lg">{type === "notifications" ? item.message : item.name}</p>
        ))}
        {items.length > 3 && (
          <Link href={`/${type}`}>
            <p className="text-[#A0FFBA] font-outfit text-sm cursor-pointer">View More</p>
          </Link>
        )}
      </>
    );
  };

  return (
    <main className="w-full">
      <section className="ml-[49px] mr-[79px] flex-col justify-between my-7">
        <div className="top flex justify-between">
          <div className="greeting flex items-center gap-3">
            <h1 className="font-outfit font-bold text-[70px]">
              Hello, <span className="text-[#A0FFBA]">{userData.username}</span>
            </h1>
            <Image src={"/icons/hello-2.png"} width={60} height={60} draggable={false} alt="wave" />
          </div>
          <Days />
        </div>
        <br />
        <div className="bottom w-[549px]">
          <p className="text-[#F0F0F0] font-poppins text-base">
            Once you understand that habits can change, you have the freedom and the responsibility to remake them.
          </p>
        </div>
      </section>
      <br />

      <section className="flex ml-[49px] mr-[79px] gap-[30px] justify-between my-7">
        <div className="w-1/2 h-[613px] bg-[#263238] rounded-[18px] flex flex-col justify-evenly items-center">
          <div className="h-1/2 bg-[#263238] rounded-2xl drop-shadow-4xl w-5/6 my-8">
            <div className="mx-5 my-5 flex flex-col gap-5">
              <div className="flex gap-2">
                <h1 className="font-poppins font-medium text-[22px] text-[#A0FFBA]">PENDING GOALS</h1>
                <Image src={"clock.svg"} width={22} height={22} draggable={false} alt="wave" />
              </div>
              <div className="flex flex-col gap-5">
                {habits.daily.length ? (
                  renderItems(habits.daily, "pending")
                ) : (
                  <p className="font-outfit text-lg text-gray-400">No pending goals for today</p>
                )}
              </div>
            </div>
          </div>

          <div className="h-1/2 bg-[#263238] rounded-2xl drop-shadow-4xl w-5/6 my-8">
            <div className="mx-5 my-5 flex flex-col gap-5">
              <div className="flex gap-2">
                <h1 className="font-poppins font-medium text-[22px] text-[#A0FFBA]">COMPLETED GOALS</h1>
                <Image src={"badge.svg"} width={22} height={22} draggable={false} alt="badge" />
              </div>
              <div className="flex flex-col gap-5">
                {habits.completed.length ? (
                  renderItems(habits.completed, "completed")
                ) : (
                  <p className="font-outfit text-lg text-gray-400">No completed goals yet</p>
                )}
                {habits.daily.length === 0 && (
                  <p className="font-outfit text-lg text-[#A0FFBA]">All tasks for the day are completed!</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2 h-[613px] flex flex-col gap-[30px]">
          <div className="bg-[#263238] rounded-[18px] w-full h-1/2 flex justify-center">
            <div className="w-11/12 h-full flex flex-col gap-5 justify-center">
              <h1 className="font-outfit text-[30px] text-[#A0FFBA] font-semibold">TODAY'S PROGRESS</h1>
              <div>
                <p className="font-outfit text-[37px] font-semibold">{progress}%</p>
                <ProgressBar value={progress} />
              </div>
            </div>
          </div>

          <div className="bg-[#263238] rounded-[18px] w-full h-1/2 flex flex-col gap-3">
            <div className="mx-5 my-7 flex gap-2">
              <h1 className="font-outfit font-semibold text-[25px] text-[#A0FFBA]">NOTIFICATIONS</h1>
              <Image src={"notif.svg"} width={24} height={24} draggable={false} alt="notifications" />
            </div>
            <div className="flex flex-col gap-3 mx-5">
              {notifications.length ? (
                renderItems(notifications, "notifications")
              ) : (
                <p className="font-outfit text-lg text-gray-400">No new notifications</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
