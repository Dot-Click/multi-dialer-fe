import React from 'react'
import { RiSubtractFill } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";



const Activities = () => {
    return (
        <div className='flex gap-6 w-full  min-h-40'>
            <div className='flex w-[50%] gap-6 flex-col'>
                <h1 className='test-[#0E1011] text-[18px] font-[500]'>Activities:</h1>

                <div className='flex justify-center items-center w-  flex-col'>
                    <h1 className='text-[#000000] text-[14px] font-[500]'>No Data Available</h1>
                    <p className='text-[#848C94] text-[14px] font-[400]'>There are no activities for this contact</p>

                </div>
            </div>


        
    <div className="flex w-full md:w-[50%] flex-col gap-6">
      <h1 className="text-[#0E1011] text-[18px] font-[600]">Information:</h1>

      <div className="flex flex-col gap-4">

        {/* Source */}
        <div className="w-full flex items-center">
          <label
            htmlFor="source"
            className="text-[14px] font-[500] text-[#0E1011] w-[180px]"
          >
            Source
          </label>
          <select
            id="source"
            className="border-b border-gray-500 text-[14px] w-[320px] outline-none px-2 py-1"
          >
            <option value="none">None</option>
          </select>
        </div>

        {/* Timezone */}
        <div className="w-full flex items-center">
          <label
            htmlFor="timezone"
            className="text-[14px] font-[500] text-[#0E1011] w-[180px]"
          >
            Timezone
          </label>
          <input
            id="timezone"
            value="Central"
            readOnly
            className=" text-[14px] w-[320px] outline-none px-2 py-1"
          />
        </div>

        {/* Last Call Result + Mark As Contact */}
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            <label
              htmlFor="lastCall"
              className="text-[14px] font-[500] text-[#0E1011] w-[180px]"
            >
              Last Call Result
            </label>
            <input
              id="lastCall"
              value="N/A"
              readOnly
              className=" text-[14px] w-[320px] outline-none px-2 py-1"
            />
          </div>
          <div className="bg-[#EBEDF0] w-40  flex justify-center items-center px-3 py-2 rounded-sm">
            <button className="text-[11px] text-[#0E1011] font-[500]">
              Mark As Contact
            </button>
          </div>
        </div>

        {/* Last Dial Date */}
        <div className="w-full flex items-center">
          <label
            htmlFor="lastDial"
            className="text-[14px] font-[500] text-[#0E1011] w-[180px]"
          >
            Last Dial Date
          </label>
          <input
            id="lastDial"
            value="N/A"
            readOnly
            className=" text-[14px] w-[320px] outline-none px-2 py-1"
          />
        </div>

        {/* Attempts */}
        <div className="flex w-full items-center">
          <label className="text-[14px] font-[500] text-[#0E1011] w-[180px]">
            Attempts
          </label>
          <div className="flex gap-4 items-center">
            <span className="rounded-full text-gray-950 p-1 flex justify-center items-center bg-gray-200">
              <RiSubtractFill className="text-[17px]" />
            </span>
            <span>0</span>
            <span className="rounded-full text-gray-950 p-1 flex justify-center items-center bg-gray-200">
              <IoIosAdd className="text-[19px]" />
            </span>
            <span className="rounded-full text-sm px-3 py-1 bg-gray-200">
              Reset
            </span>
          </div>
        </div>

        {/* Tasks + View Tasks */}
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center">
            <label
              htmlFor="tasks"
              className="text-[14px] font-[500] text-[#0E1011] w-[180px]"
            >
              Tasks
            </label>
            <input
              id="tasks"
              value={3}
              readOnly
              className=" text-[14px] w-[320px] outline-none px-2 py-1"
            />
          </div>
          <div className="bg-[#EBEDF0] px-3 py-1.5 rounded-sm">
            <button className="text-[11px] text-[#0E1011] font-[500]">
              View Tasks
            </button>
          </div>
        </div>

        {/* Next Appointment */}
        <div className="w-full flex items-center">
          <label
            htmlFor="appointment"
            className="text-[14px] font-[500] text-[#0E1011] w-[180px]"
          >
            Next Appointment
          </label>
          <input
            id="appointment"
            value="09/09/2025"
            readOnly
            className=" text-[14px] w-[320px] outline-none px-2 py-1"
          />
        </div>

        {/* Date Created */}
        <div className="w-full flex items-center">
          <label
            htmlFor="created"
            className="text-[14px] font-[500] text-[#0E1011] w-[180px]"
          >
            Date Created
          </label>
          <input
            id="created"
            value="08/09/2026"
            readOnly
            className=" text-[14px] w-[320px] outline-none px-2 py-1"
          />
        </div>

        {/* Modified Date */}
        <div className="w-full flex items-center">
          <label
            htmlFor="modified"
            className="text-[14px] font-[500] text-[#0E1011] w-[180px]"
          >
            Modified Date
          </label>
          <input
            id="modified"
            value="09/09/2025 by Cameron Williamson"
            readOnly
            className=" text-[14px] w-[320px] outline-none px-2 py-1"
          />
        </div>
      </div>
    </div>


        </div>
    )
}

export default Activities