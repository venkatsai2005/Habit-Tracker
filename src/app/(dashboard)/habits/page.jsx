'use client';
import Days from "@/components/Days";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";

export default function HabitsPage() {
  const [habits, setHabits] = useState({ daily: [], weekly: [], monthly: [], completed: [] });

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const response = await axios.get("/api/habits");
        setHabits(response.data.data);
      } catch (error) {
        console.error("Failed to fetch habits:", error);
        toast.error("Unable to load habits.");
      }
    };

    fetchHabits();
  }, []);

  const renderHabitBox = (habits, type) => (
    <div className="flex flex-col w-[340px] h-[470px] bg-[#263238] rounded-[29px] p-5 overflow-y-auto">
      <h2 className="font-poppins font-semibold text-xl text-center">{type.toUpperCase()}</h2>
      <div className="mt-4 space-y-3">
        {habits.length > 0 ? (
          habits.map((habit) => (
            <div
              key={habit._id}
              className="p-3 bg-[#37474F] rounded-md flex justify-between items-center"
            >
              <div>
                <h3 className="font-poppins font-medium">{habit.name}</h3>
                <p className="text-sm text-gray-400">{habit.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[#FF7300] font-outfit font-bold text-xl">{habit.streakCount}</p>
                <Image src="/flame.svg" alt="Streak" width={20} height={20} />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No {type.toLowerCase()} tasks available.</p>
        )}
      </div>
    </div>
  );


  const renderCompletedHabits = (habits) => (
    <div className="flex flex-col h-[250px] w-full bg-[#263238] rounded-[29px] p-5 overflow-y-auto">
      {habits.length > 0 ? (
        <div className="flex flex-col gap-2">
          {habits.map((habit) => (
            <div key={habit._id} className="p-3 flex bg-[#37474F] rounded-md">
              <h3 className="text-lg font-poppins font-medium">
                <span className="text-[#A0FFBA]">{habit.name}</span> - You have completed this habit in{" "}
                {habit.streakCount} days.
              </h3>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">No completed habits yet.</p>
      )}
    </div>
  );


  return (
    <main className="w-full">
      <section className="ml-[49px] mr-[79px] flex-col justify-between my-7">
        <div className="top flex justify-between">
          <div className="greeting flex items-center gap-3">
            <h1 className="font-outfit font-bold text-[70px]">
              Manage Your <span className="text-[#A0FFBA]">Habits</span>
            </h1>
          </div>
          <Days />
        </div>
        <br />
        <div className="bottom w-[549px]">
          <p className="text-[#F0F0F0] font-poppins text-base">
            Add, View, Edit, Delete, and Categorize habits.
          </p>
        </div>
      </section>
      <section className="ml-[49px] mr-[79px] flex flex-col justify-between my-7 gap-9">
        <div className="flex flex-col gap-3">
          <h1 className="font-outfit font-semibold text-[35px] text-[#A0FFBA]">VIEW HABITS</h1>
          <div className="flex justify-between">
            {renderHabitBox(habits.daily, "Daily")}
            {renderHabitBox(habits.weekly, "Weekly")}
            {renderHabitBox(habits.monthly, "Monthly")}
          </div>
          <div className="flex justify-between mt-5">
            <Link
              href={"/habits/create"}
              className="flex justify-center items-center bg-[#A0FFBA] w-[226px] h-[58px] rounded-[30px]"
            >
              <p className="font-poppins text-base font-semibold text-black">CREATE HABIT</p>
            </Link>
            <Link
              href={"/habits/update"}
              className="flex justify-center items-center bg-[#fff] w-[226px] h-[58px] rounded-[30px]"
            >
              <p className="font-poppins text-base font-semibold text-black">UPDATE PROGRESS</p>
            </Link>
            <Link
              href={"/habits/edit"}
              className="flex justify-center items-center bg-[#263238] w-[226px] h-[58px] rounded-[30px]"
            >
              <p className="font-poppins text-base font-semibold">EDIT HABIT</p>
            </Link>
            <Link
              href={"/habits/delete"}
              className="flex justify-center items-center bg-[#FB5456] w-[226px] h-[58px] rounded-[30px]"
            >
              <p className="font-poppins text-base font-semibold text-black">DELETE HABIT</p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="font-outfit font-semibold text-[35px] text-[#A0FFBA]">COMPLETED HABITS</h1>
          {renderCompletedHabits(habits.completed)}
        </div>
      </section>
    </main>
  );
}
