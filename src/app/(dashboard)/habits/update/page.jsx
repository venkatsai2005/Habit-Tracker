"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Days from "@/components/Days";
import axios from "axios";
import toast from "react-hot-toast";

export default function UpdateHabitPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        habitId: "",
    });
    const [habits, setHabits] = useState({ daily: [], weekly: [], monthly: [], completed: [] });
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    useEffect(() => {
        const fetchHabits = async () => {
            try {
                const response = await axios.get("/api/habits");
                setHabits(response.data.data || {
                    daily: [],
                    weekly: [],
                    monthly: [],
                    completed: [],
                });
            } catch (error) {
                console.error("Error fetching habits:", error);
                toast.error("Failed to fetch habits.");
            }
        };
        fetchHabits();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleUpdateProgress = async () => {
        setLoading(true);
        try {
            const response = await axios.patch("/api/habits/update", {
                habitId: formData.habitId,
            });
            if (response.status === 200) {
                toast.success(response.data.message || "Progress updated successfully!");
                router.push("/habits");
            } else {
                toast.error(response.data.message || "Failed to update progress.");
            }
        } catch (error) {
            console.error("Error updating progress:", error);
            toast.error(
                error.response?.data?.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };


    const handleCompleteHabit = async () => {
        setLoading2(true);
        try {
            const response = await axios.post("/api/habits/update", {
                habitId: formData.habitId,
            });
            if (response.status === 200) {
                toast.success(response.data.message || "Habit marked as complete!");
                router.push("/habits");
            } else {
                toast.error(response.data.message || "Failed to complete habit.");
            }
        } catch (error) {
            console.error("Error completing habit:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading2(false);
        }
    };

    return (
        <main className="w-full">
            <section className="ml-[49px] mr-[79px] flex-col justify-between my-7">
                <div className="top flex justify-between">
                    <div className="greeting flex items-center gap-3">
                        <h1 className="font-outfit font-bold text-[70px]">
                            <span className="text-[#A0FFBA]">Update</span> Habit
                        </h1>
                    </div>
                    <Days />
                </div>
                <br />
                <div className="bottom w-[549px]">
                    <p className="text-[#F0F0F0] font-poppins text-base">
                        Update the progress or mark your habit as complete.
                    </p>
                </div>
            </section>
            <br />
            <section className="ml-[49px] mr-[79px] flex-col justify-between my-10 rounded-lg">
                <div className="flex flex-col justify-center gap-7">
                    <div className="flex flex-col gap-2 h-[72px] w-2/3 rounded-xl p-3 font-poppins text-sm bg-[#333F4E] text-white">
                        <label htmlFor="habitId" className="text-sm">
                            Select Habit
                        </label>
                        <select
                            className="bg-inherit outline-none"
                            id="habitId"
                            name="habitId"
                            value={formData.habitId}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>
                                -- Select a Habit --
                            </option>
                            {Object.values(habits).flat().map((habit) => (
                                <option key={habit._id} value={habit._id}>
                                    {habit.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-5">
                        <button
                            className={`bg-[#A0FFBA] rounded-md text-black font-outfit text-lg font-semibold h-[50px] w-[120px] ${loading || loading2 ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            onClick={handleUpdateProgress}
                            disabled={loading || loading2}
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                        <button
                            className={`bg-[#FFF] rounded-md text-black font-outfit text-lg font-semibold h-[50px] w-[160px] ${loading || loading2 ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            onClick={handleCompleteHabit}
                            disabled={loading || loading2}
                        >
                            {loading2 ? "Completing..." : "Complete Habit"}
                        </button>
                        <button
                            className="bg-[#333F4E] rounded-md font-outfit text-lg font-semibold h-[50px] w-[90px]"
                            onClick={() => router.push("/habits")}
                        >
                            Back
                        </button>
                    </div>

                </div>
            </section>
        </main>
    );
}
