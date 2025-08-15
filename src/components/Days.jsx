"use client";
import React from 'react'

const Days = () => {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const d = new Date();
    let day = weekday[d.getDay()].toUpperCase();
    // Format date as DD MMM YYYY
    const date = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).toUpperCase();
    return (
        <div className="Day&Date flex items-center">
            <div className="date flex flex-col text-right">
                <p className="font-outfit text-[#A0FFBA] text-[22px] font-semibold" >
                    {day}
                </p>
                <p className="font-outfit text-[#A0FFBA] text-[22px] font-semibold" >
                    {date}
                </p>

            </div>
        </div>
    )
}

export default Days
