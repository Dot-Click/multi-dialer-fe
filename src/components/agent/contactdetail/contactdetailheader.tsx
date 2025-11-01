import React from 'react'
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoAddOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";




const ContactDetailHeader = () => {

    const headerLinks = [
        { id: 1, name: "Appointment", icon: <IoAddOutline /> },
        { id: 2, name: "Task", icon: <IoAddOutline /> },
        { id: 3, name: "Call Back", icon: <IoAddOutline /> },
    ]

    return (
        <header className='bg-white shadow-2xl flex items-center justify-between px-6 w-full h-13'>
            <div className='flex justify-start items-center gap-6'>
                <span className='flex items-center gap-2 px-4 py-1.5 rounded-sm bg-[#EBEDF0]'>
                    <h1 className='text-[14px] font-[500] text-[#0E1011]'>Action</h1>
                    <h1><MdKeyboardArrowDown className='text-[14px] font-[500] text-[#0E1011]' /></h1>
                </span>
                <span className='flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#EBEDF0]'>
                    <h1 className='text-[14px] font-[500] text-[#0E1011]'>Take Action</h1>

                </span>

                {headerLinks.map((li) => (
                    <span className='flex gap-2 items-center'>
                        <h1 className='text-[15x] font-[500] text-[#0E1011]'>{li.icon}</h1>
                        <h1 className='text-[14px] font-[500] text-[#0E1011]'>{li.name}</h1>
                    </span>

                ))}

            </div>
            <div className='flex items-center gap-3'>
                <span className='border rounded-md border-[#495057] p-1.5'><IoIosArrowForward className='text-[#34373a] text-[15px] '/></span>
                <span className='border rounded-md border-[#495057] p-1.5'><IoIosArrowBack className='text-[#34373a] text-[15px]'/></span>
                <span className='border bg-[#EBEDF0] rounded-md border-[#EBEDF0] p-1.5'><IoCloseOutline className='text-[#34373a] text-[15px]'/></span>
            </div>
        </header>
    )
}

export default ContactDetailHeader