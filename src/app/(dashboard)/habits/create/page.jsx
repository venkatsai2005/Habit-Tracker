"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Days from "@/components/Days";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateHabitPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        category: "Health",
        recurrence: "Daily",
    });

    const [loading, setLoading] = useState(false);

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
            const response = await axios.post("/api/habits/create", formData);
            if (response.status === 200) {
                toast.success("Habit created successfully!");
                router.push("/habits");
            } else {
                toast.error(response.data.message || "Failed to create habit");
            }
        } catch (error) {
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
                            <span className="text-[#A0FFBA]">Create</span> Habit
                        </h1>
                    </div>
                    <Days />
                </div>
                <br />
                <div className="bottom w-[549px]">
                    <p className="text-[#F0F0F0] font-poppins text-base">
                        Create a new Habit.
                    </p>
                </div>
            </section>
            <br />
            <section className="ml-[49px] mr-[79px] flex-col justify-between my-10 rounded-lg">
                <div className="flex flex-col justify-center gap-7">
                    <div className="flex flex-col gap-2 h-[72px] w-2/3 rounded-xl p-3 font-poppins text-sm bg-[#333F4E] text-white">
                        <label htmlFor="name" className="text-sm">
                            Habit Name
                        </label>
                        <input
                            className="bg-inherit outline-none"
                            type="text"
                            placeholder="Enter habit name"
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
                            <option value="Personal Development">Personal Development</option>
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

                    <div className="flex gap-5">
                        <button
                            className={`bg-[#A0FFBA] rounded-md text-black font-outfit text-lg font-semibold h-[50px] w-[90px] ${loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Submit"}
                        </button>
                        <button
                            className={`bg-[#333F4E] rounded-md font-outfit text-lg font-semibold h-[50px] w-[90px]`}
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
