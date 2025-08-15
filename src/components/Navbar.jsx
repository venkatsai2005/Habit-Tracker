import React from 'react'

const Navbar = () => {
  return (
    <div className='h-[47px] flex justify-between mt-[50px] ml-[188px] mr-[187px] mb-[120px]'>
        <h1 className='font-extrabold font-outfit text-[32px] text-[#A0FFBA]'>Habit Tracker</h1>
        <button className="w-[75px] h-[47px] bg-[#A0FFBA] rounded-2xl text-black font-outfit font-medium text-xl"><a href="/login">Login</a></button>
    </div>
  )
}

export default Navbar
