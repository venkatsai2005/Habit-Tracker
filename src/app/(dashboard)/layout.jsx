import React from 'react'
import Footera from '@/components/Footera'
import Sidebar from '@/components/Sidebar'

const layout = ({children}) => {
  return (
    <div>
      <div className='flex ml-[34px] mb-[10px] gap-[30px] mt-[35px]'>
      <Sidebar />
      {children}
      </div>
      <Footera />
    </div>
  )
}

export default layout
