import React from 'react'
import Image from 'next/image'

export const metadata = {
  title: "Habit Tracker",
};

const layout = ({ children }) => {
  return (
    <section className='flex h-dvh'>
      <div className="w-2/5 bg-[#A0FFBA] gap-5 text-black flex flex-col justify-center items-center">
      <div className="font-outfit">
        <h1 className='text-center text-[38px] font-semibold'>Habit Tracker</h1>
        <p className='mt-5 w-[430px] text-[25px]'>Stay consistent, achieve your goals, and unlock your full potential with our habit tracker. Start your journey today</p>
      </div>
      <div>
      <Image src={"/auth.svg"} alt="Image" draggable={false} width={500} height={500} />
      </div>
      </div>
      <div className='flex flex-col w-3/5 justify-center items-center'>
        {children}
      </div>
    </section>
  )
}

export default layout
