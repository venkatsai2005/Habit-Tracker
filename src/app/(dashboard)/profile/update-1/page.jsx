"use client";
import React, { useState, useEffect } from "react";
import Days from "@/components/Days";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";

export default function UpdatePage1() {
    const [user, setUser] = useState({
        name: "",
        username: "",
        email: "",
        avatar: "/user.png",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch user data on mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("/api/user/root");
                const { data } = response.data;

                setUser({
                    name: data.name || "",
                    username: data.username || "",
                    email: data.email || "",
                    avatar: data.profilePic || "/user.png",
                });
            } catch (error) {
                console.log("Failed to fetch user data:", error);
                toast.error("Unable to load user data.");
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUser((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        if (!user.name.trim()) {
            toast.error("Name cannot be empty.");
            return;
        }
        setIsSubmitting(true);

        try {
            const response = await axios.post("/api/user/update", {
                name: user.name,
                username: user.username,
                email: user.email,
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Profile updated successfully!");
                setTimeout(() => {
                    window.location.reload();
                }, 2100);
            } else {
                toast.error(response.data.message || "Failed to update profile.");
            }
        } catch (error) {
            console.log("Error updating profile:", error);
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
                            Edit Your <span className="text-[#A0FFBA]">Profile</span>
                        </h1>
                    </div>
                    <Days />
                </div>
                <br />
                <div className="bottom w-[549px]">
                    <p className="text-[#F0F0F0] font-poppins text-base">
                        Your personal space for tracking your journey.
                    </p>
                </div>
            </section>
            <br />
            <section className="ml-[49px] mr-[79px] flex-col justify-between my-10 rounded-lg">
                <div className="flex flex-col justify-center gap-7">
                    <div className="flex gap-2 items-center">
                        <Image
                            src={user.avatar}
                            width={86}
                            height={88.81}
                            alt="avatar"
                            draggable={false}
                            className="rounded-full cursor-pointer"
                        />
                        <button className="bg-[#263238] rounded-md font-outfit text-lg h-[50px] w-[90px]" onClick={() => {
                            toast('Sorry, This part is not done yet!', {
                                position: 'top-center',
                                style: {
                                    border: "1px solid #ffd415",
                                    padding: "10px",
                                    color: "#fff",
                                    background: "#333F4E",
                                },
                                // Custom Icon
                                icon: '😅',
                            });
                        }}>
                            Upload
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 h-[72px] w-2/3 rounded-xl p-3 font-poppins text-sm bg-[#333F4E] text-white">
                        <label htmlFor="name" className="text-sm">
                            Name
                        </label>
                        <input
                            className="bg-inherit outline-none"
                            type="text"
                            placeholder="Enter Your Name"
                            id="name"
                            value={user.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2 h-[72px] w-2/3 rounded-xl p-3 font-poppins text-sm bg-[#333F4E] text-white">
                        <label htmlFor="username" className="text-sm">
                            Username
                        </label>
                        <input
                            className="bg-inherit outline-none"
                            type="text"
                            placeholder="Enter Your Username"
                            id="username"
                            value={user.username}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="flex flex-col gap-2 h-[72px] w-2/3 rounded-xl p-3 font-poppins text-sm bg-[#333F4E] text-white">
                        <label htmlFor="email" className="text-sm">
                            Email
                        </label>
                        <input
                            className="bg-inherit outline-none"
                            type="email"
                            placeholder="Enter Your Email"
                            id="email"
                            value={user.email}
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
                                className={`bg-[#333F4E] rounded-md font-outfit text-lg font-semibold h-[50px] w-[90px] `}
                            >
                                Back
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
