'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import Days from "@/components/Days";
import ProgressBar from "@/components/Progress";

export default function ProgressPage() {
  const [progressData, setProgressData] = useState({
    totalHabitsCreated: 0,
    totalHabitsCompleted: 0,
    dailyProgress: 0,
    weeklyProgress: 0,
    bestStreak: { count: 0, habits: "", habitNames: [] },
    currentActiveStreaks: 0,
  });

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        const response = await axios.get("/api/progress");
        const data = response.data.data;

        setProgressData({
          totalHabitsCreated: data.totalHabitsCreated || 0,
          totalHabitsCompleted: data.totalHabitsCompleted || 0,
          dailyProgress: data.dailyProgress || 0,
          weeklyProgress: data.weeklyProgress || 0,
          bestStreak: data.bestStreak || { count: 0, habits: "", habitNames: [] },
          currentActiveStreaks: data.currentActiveStreaks || 0,
        });
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
        toast.error("Unable to load progress data.");
  
        setProgressData({
          totalHabitsCreated: 0,
          totalHabitsCompleted: 0,
          dailyProgress: 0,
          weeklyProgress: 0,
          bestStreak: { count: 0, habits: "", habitNames: [] },
          currentActiveStreaks: 0,
        });
      }
    };

    fetchProgressData();
  }, []);

  return (
    <main className="w-full flex flex-col gap-2">
      <section className="ml-[49px] mr-[79px] flex-col justify-between my-7">
        <div className="top flex justify-between">
          <div className="greeting flex items-center gap-3">
            <h1 className="font-outfit font-bold text-[70px]">
              Analyze your <span className="text-[#A0FFBA]">Progress</span>
            </h1>
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
      <section className="flex ml-[49px] mr-[79px] flex-col my-7 gap-5">
        <div className="flex items-center justify-between">
          <div className="w-[228px] h-[228px] bg-[#263238] rounded-[30px] flex flex-col items-center justify-center">
            <p className="font-outfit font-semibold text-[21px] w-[142px] text-center">
              Total Habits Created
            </p>
            <p className="font-outfit font-semibold text-[#A0FFBA] text-[50px] w-[142px] text-center ">
              {progressData.totalHabitsCreated}
            </p>
          </div>
          <div className="w-[228px] h-[228px] bg-[#263238] rounded-[30px] flex flex-col items-center justify-center">
            <p className="font-outfit font-semibold text-[21px] w-[142px] text-center">
              Total Habits Completed
            </p>
            <p className="font-outfit font-semibold text-[#A0FFBA] text-[50px] w-[142px] text-center ">
              {progressData.totalHabitsCompleted}
            </p>
          </div>
          <div className="w-[497.5px] h-[228px] bg-[#263238] rounded-[30px] justify-center items-center flex">
            <div className="w-[414px] flex flex-col gap-4 justify-between">
              <h1 className="font-outfit text-[30px] text-[#A0FFBA] font-semibold">
                TODAY'S PROGRESS
              </h1>
              <div>
                <p className="font-outfit text-[37px] font-semibold">
                  {progressData.dailyProgress}%
                </p>
                <ProgressBar value={progressData.dailyProgress} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="w-[497.5px] h-[228px] bg-[#263238] rounded-[30px] justify-center items-center flex">
            <div className="w-[414px] flex flex-col gap-4 justify-between">
              <h1 className="font-outfit text-[30px] text-[#A0FFBA] font-semibold">
                WEEKLY PROGRESS
              </h1>
              <div>
                <p className="font-outfit text-[37px] font-semibold">
                  {progressData.weeklyProgress}%
                </p>
                <ProgressBar value={progressData.weeklyProgress} />
              </div>
            </div>
          </div>
          <div
            className="w-[228px] h-[228px] bg-[#263238] rounded-[30px] flex flex-col items-center justify-center gap-2 relative"
            title={progressData.bestStreak.habitNames.join(", ") || "No streaks"}
          >
            <p className="font-outfit font-semibold text-[21px] w-[142px] text-center ">
              Best Streak
            </p>
            <div className="flex w-[117px] h-[69.49] gap-1">
              <p className="font-outfit font-semibold text-[#FF7300] text-[50px] w-[142px] text-center ">
                {progressData.bestStreak.count}
              </p>
              <Image src={"/flame.svg"} width={60} height={65} alt="Streak" />
            </div>
            <p className="font-outfit text-[#FF7300] text-xl w-[142px] text-center ">
              {progressData.bestStreak.habits}
            </p>
          </div>
          <div className="w-[228px] h-[228px] bg-[#263238] rounded-[30px] flex flex-col items-center justify-center">
            <p className="font-outfit font-semibold text-[21px] w-[142px] text-center ">
              Current Active Streaks
            </p>
            <p className="font-outfit font-semibold text-[#A0FFBA] text-[50px] w-[142px] text-center ">
              {progressData.currentActiveStreaks}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
