"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Days from "@/components/Days";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditHabitPage() {
    const router = useRouter();

    const [habits, setHabits] = useState({ daily: [], weekly: [], monthly: [], completed: [] });
    const [selectedHabitId, setSelectedHabitId] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        category: "Health",
        recurrence: "Daily",
    });
    const [loading, setLoading] = useState(false);

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

    const handleSelectChange = (e) => {
        const habitId = e.target.value;
        setSelectedHabitId(habitId);

        const allHabits = Object.values(habits).flat();
        const selectedHabit = allHabits.find((habit) => habit._id === habitId);
        if (selectedHabit) {
            setFormData({
                name: selectedHabit.name,
                category: selectedHabit.category,
                recurrence: selectedHabit.recurrence,
            });
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put("/api/habits/edit", {
                habitId: selectedHabitId,
                ...formData,
            });
            if (response.status === 200) {
                toast.success("Habit updated successfully!");
                router.push("/habits");
            } else {
                toast.error(response.data.message || "Failed to update habit.");
            }
        } catch (error) {
            console.error("Error updating habit:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="w-full">
            <section className="ml-[49px] mr-[79px] flex-col justify-between my-7">
                <div className="top flex justify-between">
                    <div className="greeting flex items-center gap-3">
                        <h1 className="font-outfit font-bold text-[70px]">
                            <span className="text-[#A0FFBA]">Edit</span> Habit
                        </h1>
                    </div>
                    <Days />
                </div>
                <br />
                <div className="bottom w-[549px]">
                    <p className="text-[#F0F0F0] font-poppins text-base">
                        Modify or update your existing habits.
                    </p>
                </div>
            </section>
            <br />
            <section className="ml-[49px] mr-[79px] flex-col justify-between my-10 rounded-lg">
                <div className="flex flex-col justify-center gap-7">
                    <div className="flex flex-col gap-2 h-[72px] w-2/3 rounded-xl p-3 font-poppins text-sm bg-[#333F4E] text-white">
                        <label htmlFor="selectHabit" className="text-sm">
                            Select Habit
                        </label>
                        <select
                            className="bg-inherit outline-none"
                            id="selectHabit"
                            value={selectedHabitId}
                            onChange={handleSelectChange}
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

                    {selectedHabitId && (
                        <>
                            <div className="flex flex-col gap-2 h-[72px] w-2/3 rounded-xl p-3 font-poppins text-sm bg-[#333F4E] text-white">
                                <label htmlFor="name" className="text-sm">
                                    Habit Name
                                </label>
                                <input
                                    className="bg-inherit outline-none"
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2 h-[72px] w-2/3 rounded-xl p-3 font-poppins text-sm bg-[#333F4E] text-white">
                                <label htmlFor="category" className="text-sm">
                                    Category
                                </label>
                                <select
                                    className="bg-inherit outline-none"
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    <option value="Health">Health</option>
                                    <option value="Work">Work</option>
                                    <option value="Personal Development">
                                        Personal Development
                                    </option>
                                    <option value="Social">Social</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Household">Household</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2 h-[72px] w-2/3 rounded-xl p-3 font-poppins text-sm bg-[#333F4E] text-white">
                                <label htmlFor="recurrence" className="text-sm">
                                    Recurrence
                                </label>
                                <select
                                    className="bg-inherit outline-none"
                                    id="recurrence"
                                    name="recurrence"
                                    value={formData.recurrence}
                                    onChange={handleInputChange}
                                >
                                    <option value="Daily">Daily</option>
                                    <option value="Weekly">Weekly</option>
                                    <option value="Monthly">Monthly</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="flex gap-5">
                        <button
                            className={`bg-[#A0FFBA] rounded-md text-black font-outfit text-lg font-semibold h-[50px] w-[90px] ${loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Submit"}
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
