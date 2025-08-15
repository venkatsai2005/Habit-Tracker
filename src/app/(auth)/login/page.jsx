'use client';
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 for email input, 2 for OTP verification
  const router = useRouter();

  // Function to validate email format
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendOTP = async () => {
    if (!email) {
      toast.error("All fields are required");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    toast.promise(
      axios.post("/api/auth/send-otp", { email }),
      {
        loading: "Sending OTP...",
        success: (response) => response.data.message || "OTP sent to your email!",
        error: (error) => error.response?.data?.message || "Failed to send OTP.",
      }
    ).then(() => {
      setStep(2);
    })
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error("OTP field cannot be empty.");
      return;
    }

    toast.promise(
      axios.post("/api/auth/verify-otp", { email, otp }),
      {
        loading: "Verifying OTP...",
        success: (response) => response.data.message || "Login successful!",
        error: (error) => error.response?.data?.message || "Failed to verify OTP.",
      }
    ).then(() => {
      router.push("/dashboard");
    })
  };

  return (
    <div className="flex flex-col justify-center w-[580px] h-[400px] gap-6">
      <h1 className="text-[46px] font-poppins">
        {step === 1 ? "Access Your Account" : "Verify OTP"}
      </h1>

      {step === 1 && (
        <div className="gap-2 h-[72px] flex flex-col rounded-xl justify-center p-3 font-poppins text-sm bg-[#333F4E]">
          <label htmlFor="email">Email</label>
          <input
            className="bg-inherit outline-none"
            type="email"
            placeholder="Enter Your Email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      {step === 2 && (
        <div className="gap-2 h-[72px] flex flex-col rounded-xl justify-center p-3 font-poppins text-sm bg-[#333F4E]">
          <label htmlFor="otp">OTP</label>
          <input
            className="bg-inherit outline-none"
            type="text"
            placeholder="Enter OTP"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>
      )}

      <button
        className="h-[56px] rounded-[41px] bg-[#A0FFBA] text-black text-sm font-semibold"
        onClick={step === 1 ? handleSendOTP : handleVerifyOTP}
      >
        {step === 1 ? "Submit" : "Verify OTP"}
      </button>

      <p className="text-sm text-center">
        Don't have an account?{" "}
        <span>
          <Link className="text-[#A0FFBA]" href="/register">
            Register
          </Link>
        </span>
      </p>
    </div>
  );
}
