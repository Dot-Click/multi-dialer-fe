import { useState } from 'react'
import { RiSubtractFill } from "react-icons/ri";
import { IoIosAdd } from "react-icons/io";
import TaskForContact from '@/components/modal/taskforcontact';



const Activities = () => {
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  return (
    <div className='flex flex-col md:flex-row gap-12 md:gap-6  w-full  min-h-40'>
      <div className='flex w-full md:w-[45%] gap-6 flex-col'>
        <h1 className='test-[#0E1011] text-[18px] font-[500]'>Activities:</h1>

        <div className='flex mt-[14%] gap-0.5 h-full items-center w-full  flex-col'>
          <h1 className='text-[#000000] text-[14px] font-[500]'>No Data Available</h1>
          <p className='text-[#848C94] text-[14px] font-[400]'>There are no activities for this contact</p>

        </div>
      </div>



      <div className="flex w-full md:w-[55%] flex-col gap-6">
        <h1 className="text-[#0E1011] text-[18px] font-[500]">Information:</h1>

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
              className="border-b border-gray-500 text-[#18181B] font-[400] text-[16px] w-[320px] outline-none px-2 py-1"
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
              className=" text-[16px] w-[320px] font-[400] text-[#18181B] outline-none px-2 py-1"
            />
          </div>

          {/* Last Call Result + Mark As Contact */}
          <div className="w-full flex  flex-col lg:flex-row lg:justify-between lg:items-center">
            <div className="flex items-center">
              <label
                htmlFor="lastCall"
                className="text-[14px] whitespace-nowrap font-[500] text-[#0E1011] w-[180px]"
              >
                Last Call Result
              </label>
              <input
                id="lastCall"
                value="N/A"
                readOnly
                className=" text-[16px] w-[320px] font-[400] text-[#18181B] outline-none px-2 py-1"
              />
            </div>
            <div className="bg-[#EBEDF0] w-40  flex justify-center items-center px-[12px] py-[7px] rounded-[8px]">
              <button className="text-[16px] text-[#0E1011] font-[500]">
                Mark As Contact
              </button>
            </div>
          </div>

          {/* Last Dial Date */}
          <div className="w-full flex items-center">
            <label
              htmlFor="lastDial"
              className="text-[14px] whitespace-nowrap font-[500] text-[#0E1011] w-[180px]"
            >
              Last Dial Date
            </label>
            <input
              id="lastDial"
              value="N/A"
              readOnly
              className="text-[16px] w-[320px] font-[400] text-[#18181B] outline-none px-2 py-1"
            />
          </div>

          {/* Attempts */}
          <div className="flex w-full items-center">
            <label className="text-[14px] font-[500] text-[#0E1011] w-[180px]">
              Attempts
            </label>
            <div className="flex gap-4 items-center">
              <span className="rounded-[8px] text-[#495057] py-[6px] px-[5px] flex justify-center items-center bg-[#F7F7F7]">
                <RiSubtractFill className="text-[17px]" />
              </span>
              <span className="text-[#000000] font-[500] text-[16px]">0</span>
              <span className="rounded-[8px] text-[#495057] py-[6px] px-[5px] flex justify-center items-center bg-[#F7F7F7]">
                <IoIosAdd className="text-[19px]" />
              </span>
              <span className="rounded-[8px] text-[14px] font-[400] text-[#0E1011] py-[8px] px-[12px] flex justify-center items-center bg-[#F7F7F7]">
                Reset
              </span>
            </div>
          </div>

          {/* Tasks + View Tasks */}
          <div className="w-full flex flex-col lg:flex-row lg:flow-row lg:justify-between lg:items-center">
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
                className="text-[16px] w-[320px] font-[400] text-[#18181B] outline-none px-2 py-1"

              />
            </div>
            <div onClick={() => setTaskModalOpen(true)} className="bg-[#EBEDF0] w-fit px-[12px] py-[7px] rounded-[8px]">
              <button className="text-[13px] text-[#0E1011] font-[500]">
                View Tasks
              </button>
            </div>
          </div>

          {/* Next Appointment */}
          <div className="w-full flex items-center">
            <label
              htmlFor="appointment"
              className="text-[14px] whitespace-nowrap font-[500] text-[#0E1011] w-[180px]"

            >
              Next Appointment
            </label>
            <input
              id="appointment"
              value="09/09/2025"
              readOnly
              className="text-[16px] w-[320px] font-[400] text-[#18181B] outline-none px-2 py-1"

            />
          </div>

          {/* Date Created */}
          <div className="w-full flex items-center">
            <label
              htmlFor="created"
              className="text-[14px] whitespace-nowrap font-[500] text-[#0E1011] w-[180px]"
            >
              Date Created
            </label>
            <input
              id="created"
              value="08/09/2026"
              readOnly
              className="text-[16px] w-[320px] font-[400] text-[#18181B] outline-none px-2 py-1"

            />
          </div>

          {/* Modified Date */}
          <div className="w-full flex items-center">
            <label
              htmlFor="modified"
              className="text-[14px] whitespace-nowrap font-[500] text-[#0E1011] w-[180px]"

            >
              Modified Date
            </label>
            <input
              id="modified"
              value="09/09/2025 by John"
              readOnly
              className="text-[16px] w-[320px] font-[400] text-[#18181B] outline-none px-2 py-1"

            />
          </div>
        </div>
      </div>

      <TaskForContact
        isOpen={isTaskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        contactName="John Doe" // Optional: Contact ka naam yahan se pass karein
      />

    </div>
  )
}

export default Activities