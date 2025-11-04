import React from 'react'
import { IoIosAdd } from "react-icons/io";



const ActionPlans = () => {
    return (
        <div className='flex gap-6 flex-col min-h-40'>
            <h1 className='test-[#0E1011] text-[18px] font-[500]'>Action Plans:</h1>

            <div className='flex justify-center  gap-3 items-center w-full text-center md:w-[50%]  flex-col'>
                <h1 className='text-[#000000] text-[14px] font-[500]'>No Data Available</h1>
                <p className='text-[#848C94] text-[14px] font-[400]'>There are no action plan assigned yet</p>
                <button className='flex bg-[#EBEDF0] py-2 px-4 cursor-pointer hover:bg-gray-300 rounded-[12px] gap-3 items-center justify-center'>
                    <span><IoIosAdd className='text-[#0E1011] text-lg'/></span>
                    <span className='text-[#0E1011] text-[14px] font-[500]'>Assign Action Plan</span>
                </button>

            </div>
        </div>
    )
}

export default ActionPlans