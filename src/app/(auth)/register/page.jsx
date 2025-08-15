'use client';
import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
  });

  const validateEmail = (email) => {
    // Simple email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    if (!user.name || !user.username || !user.email) {
      toast.error("All fields are required");
      return false;
    }
    if (!validateEmail(user.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const onRegister = async () => {
    const toastId = toast.loading("Loading");
    
    if (!validateForm()) {
      toast.dismiss(toastId);
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", user);
      console.log("Registration Success:", response.data);

      toast.success("Registration Successful!", { id: toastId });
      router.push("/login");
    } catch (error) {
      console.log("Registration Error:", error);

      toast.error(
        error.response?.data?.message || "An unexpected error occurred.",
        { id: toastId }
      );
    }
  };

  return (
    <div className="flex flex-col justify-center w-[580px] h-[522px] gap-6">
      <h1 className="text-[46px] font-poppins">Create Account</h1>

      {/* Name Input */}
      <div className="gap-2 h-[72px] flex flex-col rounded-xl justify-center p-3 font-poppins text-sm bg-[#333F4E]">
        <label htmlFor="name">Name</label>
        <input
          className="bg-inherit outline-none"
          type="text"
          placeholder="Enter Your Name"
          id="name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
      </div>

      {/* Username Input */}
      <div className="gap-2 h-[72px] flex flex-col rounded-xl justify-center p-3 font-poppins text-sm bg-[#333F4E]">
        <label htmlFor="username">Username</label>
        <input
          className="bg-inherit outline-none"
          type="text"
          placeholder="Enter Your Username"
          id="username"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />
      </div>

      {/* Email Input */}
      <div className="gap-2 h-[72px] flex flex-col rounded-xl justify-center p-3 font-poppins text-sm bg-[#333F4E]">
        <label htmlFor="email">Email</label>
        <input
          className="bg-inherit outline-none"
          type="email"
          placeholder="Enter Your Email"
          id="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </div>

      {/* Submit Button */}
      <button
        className="h-[56px] rounded-[41px] bg-[#A0FFBA] text-black text-sm font-semibold"
        onClick={onRegister}
      >
        Submit
      </button>

      <p className="text-sm text-center">
        Already have an account?{" "}
        <span>
          <Link className="text-[#A0FFBA]" href="/login">
            Login
          </Link>
        </span>
      </p>
    </div>
  );
}
