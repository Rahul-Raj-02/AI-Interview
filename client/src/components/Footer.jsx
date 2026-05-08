import React from 'react'
import { RiRobot3Line } from "react-icons/ri";

const Footer = () => {
  return (
    <div className='w-full bg-[#F3F3F3] flex justify-center pt-10'>
        <div className="w-full bg-white shadow-sm border border-gray-200 pt-4 text-center">
            <div className="flex justify-center items-center gap-3 mb-3">
                <div className='p-2 border-2 rounded-full'><RiRobot3Line size={20} /></div>
                <h2 className='font-semibold'>AI Interview</h2>
            </div>
            <p className="text-gray-500 text-md-max-w-xl mx-auto pb-4">
              AI-powered interview prepration platform designed to improve communication skills, technical depth and professional confidence.  
            </p>
        </div>
    </div>
  )
}

export default Footer
