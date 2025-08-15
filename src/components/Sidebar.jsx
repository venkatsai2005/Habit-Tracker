"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const [userData, setUserData] = useState({
        name: "",
        email: "",
        avatar: "/user.png",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("/api/user/root");
                const { data } = response.data;
                setUserData({
                    name: data.name,
                    email: data.email,
                    avatar: data.avatar || "/user.png", 
                });
            } catch (error) {
                console.log("Failed to fetch user data:", error);
                toast.error("Unable to load user data.");
            }
        };

        fetchUserData();
    }, []);


    const onLogout = async () => {
        const toastId = toast.loading("Logging out...");
        try {
            await axios.post("/api/auth/logout");
            toast.success("Logout successful!", { id: toastId });
            router.push("/");
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error("Logout failed.", { id: toastId });
        }
    };

    const navLinks = [
        { name: "Dashboard", href: "/dashboard", icon: "/icons/dashboard.svg", activeIcon: "/iconsb/dashboard.svg" },
        { name: "Habits", href: "/habits", icon: "/icons/habits.svg", activeIcon: "/iconsb/habits.svg" },
        { name: "Progress", href: "/progress", icon: "/icons/progress.svg", activeIcon: "/iconsb/progress.svg" },
        { name: "Notifications", href: "/notifications", icon: "/icons/notification.svg", activeIcon: "/iconsb/notification.svg" },
        { name: "Profile & Settings", href: "/profile", icon: "/icons/profile.svg", activeIcon: "/iconsb/profile.svg" },
        { name: "Help & Support", href: "/help", icon: "/icons/help.svg", activeIcon: "/iconsb/help.svg" },
    ];

    return (
        <aside className="w-1/5 flex flex-col py-4 px-2 h-[949px] gap-7">
            <h1 className="font-outfit font-extrabold text-[32px] text-[#A0FFBA] text-center mb-4">
                Habit Tracker
            </h1>

            <div className="down flex flex-col">
                {/* Profile Section */}
                <div className="profile h-[139.41px] flex flex-col items-center mb-6">
                    <Image
                        src={userData.avatar}
                        width={86}
                        height={88.81}
                        alt="avatar"
                        draggable={false}
                        className="rounded-full"
                    />
                    <p className="text-base font-inter font-semibold text-center mt-2">
                        {userData.name || "User"}
                    </p>
                    <p className="text-xs font-inter text-center">
                        {userData.email || "user@example.com"}
                    </p>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col justify-center items-center">
                    <ul className="flex flex-col gap-5">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className={`flex items-center gap-3 px-7 py-2 w-[275px] h-[61.96px] rounded-[30px] bg-[#263238] ${
                                        pathname === link.href ? "bg-[#A0FFBA] text-black" : "text-white"
                                    }`}
                                >
                                    <Image
                                        className={pathname === link.href ? "opacity-100" : "opacity-30"}
                                        draggable={false}
                                        src={pathname === link.href ? link.activeIcon : link.icon}
                                        width={20}
                                        height={20}
                                        alt={`${link.name} icon`}
                                    />
                                    <span className="text-base font-poppins font-semibold">{link.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Logout Button */}
            <div className="mt-auto flex items-center justify-center">
                <button
                    className="flex items-center px-7 py-2 w-[275px] h-[61.96px] rounded-[30px] bg-[#FB5456]"
                    onClick={onLogout}
                >
                    <Image src="/icons/logout.svg" draggable={false} width={20} height={20} alt="Logout" />
                    <span className="px-4 py-2 text-base font-poppins font-semibold text-black">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
