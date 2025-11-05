import { useState } from 'react';
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoAddOutline, IoCloseOutline } from "react-icons/io5";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import AppointmentModal from '@/components/modal/appointmentmodal';
import TaskModal from '@/components/modal/taskmodal';
import CallBackModal from '@/components/modal/callbackmodal';
import TakeActionModal from '@/components/modal/takeactionmodal';

const ContactDetailHeader = () => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);
    const [isCallBackModalOpen, setCallBackModalOpen] = useState(false);
    const [isActionModalOpen, setActionModalOpen] = useState(false);


    // Header buttons
    const originalHeaderLinks = [
        { id: 2, name: "Task", icon: <IoAddOutline />, onClick: () => setTaskModalOpen(true) },
        { id: 3, name: "Call Back", icon: <IoAddOutline />, onClick: () => setCallBackModalOpen(true) },
    ];

    return (
        <>
            <header className=' shadow-lg bg-red-500 flex items-center justify-between px-4 md:px-6 w-full h-16'>
                {/* Left Section */}
                <div className='flex justify-start  items-center gap-3 md:gap-4'>
                    <button className='flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200'>
                        <span className='text-sm font-medium text-gray-800'>Action</span>
                        <MdKeyboardArrowDown className='text-md text-gray-800' />
                    </button>

                    <button onClick={() => setActionModalOpen(true)} className='flex items-center gap-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200'>
                        <span className='text-sm font-medium text-gray-800'>Take Action</span>

                    </button>

                    {/* --- APPOINTMENT BUTTON --- */}
                    <button
                        onClick={() => setModalOpen(true)}
                        className='flex gap-2 items-center p-2 rounded-md hover:bg-gray-100'
                    >
                        <span className='text-lg font-medium text-gray-700'><IoAddOutline /></span>
                        <span className='text-sm font-medium text-gray-700'>Appointment</span>
                    </button>

                    {/* --- OTHER LINKS (Task + Call Back) --- */}
                    <div className='flex items-center gap-4'>
                        {originalHeaderLinks.map((li) => (
                            <button
                                key={li.id}
                                onClick={li.onClick}
                                className='flex gap-2 items-center p-2 rounded-md hover:bg-gray-100'
                            >
                                <span className='text-lg font-medium text-gray-700'>{li.icon}</span>
                                <span className='text-sm font-medium text-gray-700'>{li.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Section */}
                <div className='flex items-center gap-2'>
                    <button className='border rounded-md p-2 hover:bg-gray-100'>
                        <IoIosArrowBack className='text-gray-700 text-md' />
                    </button>
                    <button className='border rounded-md p-2 hover:bg-gray-100'>
                        <IoIosArrowForward className='text-gray-700 text-md' />
                    </button>
                    <button className='border bg-gray-100 rounded-md p-2 hover:bg-gray-200'>
                        <IoCloseOutline className='text-gray-700 text-md' />
                    </button>
                </div>
            </header>

            {/* --- MODALS --- */}
            <AppointmentModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
            />
            <TaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setTaskModalOpen(false)}
            />

            <CallBackModal
                isOpen={isCallBackModalOpen}
                onClose={() => setCallBackModalOpen(false)}
            />
            <TakeActionModal
                isOpen={isActionModalOpen}
                onClose={() => setActionModalOpen(false)}
            />
        </>
    );
}

export default ContactDetailHeader;
