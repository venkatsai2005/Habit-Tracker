'use client';
import React, { useState } from "react";
import Image from "next/image";
import Days from "@/components/Days";

export default function HelpPage() {
  const [hoveredFaq, setHoveredFaq] = useState(null);

  const faqs = [
    {
      question: "How do I update my profile details?",
      answer: "To update your profile details, navigate to the Profile & Settings page and edit the fields you wish to update.",
      icon: "/icons/h1.svg",
    },
    {
      question: "Can I edit or delete existing habits?",
      answer: "Yes, you can manage habits by going to the Habits section, selecting a habit, and choosing the edit or delete option.",
      icon: "/icons/h2.svg",
    },
    {
      question: "How do I customize notification timings?",
      answer: "To customize notification timings, go to the Notifications settings and set your preferred time for reminders.",
      icon: "/icons/h3.svg",
    },
    {
      question: "How is my streak calculated?",
      answer: "Your streak is calculated based on consecutive days of completing all your daily goals.",
      icon: "/icons/h4.svg",
    },
  ];

  return (
    <main className="w-full">
      <section className="ml-[49px] mr-[79px] flex-col justify-between my-7">
        <div className="top flex justify-between">
          <div className="greeting flex items-center gap-3">
            <h1 className="font-outfit font-bold text-[70px]">
              Any <span className="text-[#A0FFBA]">Queries?</span>
            </h1>
          </div>
          <Days />
        </div>
        <br />
        <div className="bottom">
          <p className="text-[#F0F0F0] font-poppins text-base">
            An easy way to access assistance, troubleshoot issues, and connect with support.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="flex ml-[49px] mr-[79px] flex-col my-7 gap-2">
        <div className="faq flex flex-col">
          <h1 className="font-outfit font-semibold text-[50px] text-[#A0FFBA]">FAQs?</h1>
        </div>
        <div className="faqs flex flex-col gap-4 items-center">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item w-full rounded-[15px] bg-[#263238] px-5 transition-all duration-300`}
              onMouseEnter={() => setHoveredFaq(index)}
              onMouseLeave={() => setHoveredFaq(null)}
            >
              {/* Question */}
              <div
                className="flex gap-5 items-center h-[100px]"
              >
                <Image
                  src={faq.icon}
                  width={40}
                  height={40}
                  alt={`faq-${index + 1}`}
                  draggable={false}
                  className={`${hoveredFaq === index ? "opacity-100" : "opacity-30"}`}
                />
                <p className="font-poppins text-[25px]">{faq.question}</p>
              </div>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  hoveredFaq === index ? "max-h-[200px] py-3" : "max-h-0 py-0"
                }`}
              >
                <p className="font-poppins text-[18px] text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="flex ml-[49px] mr-[79px] flex-col my-7 gap-2">
        <div className="flex flex-col gap-3">
          <h1 className="font-outfit font-semibold text-[45px] text-[#A0FFBA]">Still Need Help?</h1>
          <p className="font-outfit text-[35px]">
            Reach us at{" "}
            <a href="mailto:habit.tracker123@gmail.com">
              <span className="text-[#A0FFBA]">habit.tracker123@gmail.com</span>
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
