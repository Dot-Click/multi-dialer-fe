import React, { useState } from 'react'
import { FaRegEdit } from "react-icons/fa";
import mapIcon from "@/assets/mapicon.png"
import streeticon from "@/assets/streeticon.png"
import groupicon from "@/assets/groupicon.png"
import { LuMapPin } from "react-icons/lu";
import { CiMail } from "react-icons/ci";
import { IoBagHandleOutline } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAddOutline } from "react-icons/io5";
import { IoCallOutline } from "react-icons/io5";
import { CiMobile1 } from "react-icons/ci";
import { PiDotsSixVertical } from "react-icons/pi";
import EditModal from '@/components/modal/editmodal';
import PhoneModal from '@/components/modal/phonemodal';
import EmailModal from '@/components/modal/emailmodal';





const Detail = () => {
    const [showModal, setShowModal] = useState(false);
        const [phoneModal, setPhoneModal] = useState(false);
        const [emailModal, setEmailModal] = useState(false);


    const data = [
        { id: 1, name: "Calls", number: 23 },
        { id: 2, name: "Emails", number: 10 },
        { id: 3, name: "SMS", number: 0 },
    ]

    const phones = [
        { id: 1, number: "+98765456789", icon: <IoBagHandleOutline /> },
        { id: 2, number: "+98765456789", icon: <IoBagHandleOutline /> },
        { id: 3, number: "+98765456789", icon: <IoCallOutline /> },
        { id: 4, number: "+98765456789", icon: <CiMobile1 /> },
        { id: 5, number: "+98765456789", icon: <PiDotsSixVertical /> },
    ]


    const emails = [
        { id: 1, email: "+nchawdhry@aol.com" },
        { id: 2, email: "+nchawdhry@aol.com" },
    ]

    const despositions = [
        { id: 1, name: "Wrong Number" },
        { id: 2, name: "Not Interested" },
        { id: 3, name: "Answering Machine" },
        { id: 4, name: "Got Sale" },
        { id: 5, name: "DNC" },
        { id: 6, name: "Call Back" }
    ]

    const status = [
        { id: 1, name: "Permission" },
        { id: 2, name: "Want" },
        { id: 3, name: "Why" },
        { id: 4, name: "Status Quo" },
        { id: 5, name: "Timeline" },
        { id: 6, name: "Agent" }
    ]





    return (
        <section className='bg-white flex flex-col gap-8 shadow-2xl  px-6 py-5 w-[96%] mx-auto rounded-[24px]'>

            <div className='flex flex-col md:flex-row md:justify-between md:items-center'>

                <div className='flex  flex-col lg:flex-row lg:gap-14 lg:items-center'>
                    <div className='flex flex-col   gap-1'>
                        <div className='flex  items-center gap-2'>
                            <h1 className='text-[20px] md:text-[24px] text-[#0E1011] font-[500]'>Contact Name</h1>
                            <span onClick={() => setShowModal(true)} className='border bg-[#EBEDF0] cursor-pointer rounded-[8px] border-[#EBEDF0] py-[6px] px-1 hover:bg-[#d8d8d8]'><FaRegEdit className='text-[#838383] text-[18px]' /></span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-[14px] font-[500] text-[#2B3034]'>Name</span>
                            <span className='text-[14px] font-[400] text-[#495057]'>(Co-owner)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-5'>
                        {data.map((dt) => (
                            <span key={dt.id} className='flex text-[14px] gap-1 items-center'>
                                <h1 className='text-[#2B3034] font-[600]'>{dt.name}:</h1>
                                <h1 className='text-[#0E1011] font-[400]' >{dt.number}</h1>
                            </span>
                        ))}
                    </div>
                </div>
                <div className='flex items-center gap-3 '>
                    <span className='border p-1 rounded-lg border-gray-200'><img src={mapIcon} className='h-6 w-6 object-contain' /></span>
                    <span className='border p-1 rounded-lg border-gray-200'><img src={streeticon} className='h-6 w-6 object-contain' /></span>
                    <span className='border p-1 rounded-lg border-gray-200'><img src={groupicon} className='h-6 w-6 object-contain' /></span>

                </div>


            </div>




            <div className='flex lg:flex-row flex-col justify-between gap-8 items-start'>

                <div className='flex w-full  lg:w-1/3  flex-col gap-5'>
                    <div className='flex gap-2 items-start'>
                        <h1><LuMapPin className='text-[18px] font-[500] text-[#0E1011]' /></h1>
                        <div className='flex flex-col gap-1'>
                            <span>
                                <h1 className='text-[15px] font-[500] text-[#0E1011]'>Property Address:</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] text-[14px] font-[500]'>City:</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] text-[14px] font-[500]'>State:</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] text-[14px] font-[500]'>Zip code:</h1>
                            </span>
                        </div>
                    </div>

                    <div className='flex gap-2 items-start'>
                        <h1><CiMail className='text-[18px] font-[500] text-[#0E1011]' /></h1>
                        <div className='flex flex-col gap-1'>
                            <span>
                                <h1 className='text-[15px] font-[500] text-[#0E1011]'>Mailing Address:</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] text-[14px] font-[500]'>City:</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] text-[14px] font-[500]'>State:</h1>
                            </span>
                            <span>
                                <h1 className='text-[#495057] text-[14px] font-[500]'>Zip code:</h1>
                            </span>
                        </div>
                    </div>

                </div>


                <div className='flex w-full  lg:w-1/3  flex-col gap-4'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-[15px] font-[500] text-[#0E1011]'>Phones:</h1>
                        <span onClick={() => setPhoneModal(true)} className='border p-1 rounded-lg bg-gray-100 border-gray-200'><IoAddOutline className='text-[#717171] text-[18px]' /></span>
                    </div>
                    <div className='flex flex-col gap-3 '>
                        {phones.map((phone) => (
                            <div key={phone.id} className='flex px-1 py-2 justify-between  border-b border-gray-100 items-center gap-2'>
                                <div className='flex gap-4 items-center'>
                                    <span className='text-xl text-[#495057]'>{phone.icon}</span>
                                    <span className='text-[#1D85F0] font-[500] text-[15px]'>{phone.number}</span>
                                </div>
                                <div>

                                    <BsThreeDotsVertical className='text-[#6a6767] text-[19px]' />

                                </div>
                            </div>
                        ))}
                    </div>

                </div>


                <div className='flex w-full lg:w-1/3 flex-col gap-4'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-[15px] font-[500] text-[#0E1011]'>E-mails:</h1>
                        <span onClick={() => setEmailModal(true)} className='border p-1 rounded-lg bg-gray-100 border-gray-200'><IoAddOutline className='text-[#717171] text-[18px]' /></span>
                    </div>
                    <div className='flex flex-col gap-3 '>
                        {emails.map((email) => (
                            <div key={email.id} className='flex  px-1 py-2 justify-between  border-b border-gray-100 items-center gap-2'>
                                <div className='flex gap-4 items-center'>
                                    <span className='text-[#1D85F0] font-[500] text-[15px]'>{email.email}</span>
                                </div>
                                <div>

                                    <BsThreeDotsVertical className='text-[#6a6767] text-[19px]' />

                                </div>
                            </div>
                        ))}
                    </div>

                </div>




            </div>

            <div className='flex  flex-col lg:flex-row w-full md:w-[60%]  lg:items-center gap-4'>
                <div className='flex w-full md:w-full items-center gap-2'>
                    <label htmlFor="list" className='text-md text-gray-900 font-[500]'>List :</label>
                    <input type="text" id="list" placeholder='List Number 1'
                        className='border-b py-1 px-2 border-gray-300 flex-1 text-gray-950 placeholder:text-sm text-sm outline-none' />
                </div>

                <div className='flex w-full md:w-full items-center gap-2'>
                    <label htmlFor="group" className='text-md text-gray-900 font-[500]'>Group :</label>
                    <input type="text" id="group" placeholder='Working'
                        className='border-b py-1 px-2 border-gray-300 flex-1  text-gray-950 placeholder:text-sm text-sm outline-none' />
                </div>
            </div>


            <div className='flex  flex-col gap-3'>
                <h1 className='text-md text-gray-900 font-[500]'>Dispositions:</h1>
                <div className='flex gap-4 flex-wrap items-center'>
                    {despositions.map((disp) => (
                        <button key={disp.id} className='bg-[#EBEDF0] cursor-pointer rounded-md text-sm text-[#18181B] px-3 py-1.5 font-[500]'>{disp.name}</button>
                    ))}
                </div>
            </div>

            <div className="border-t  border-gray-100 w-full"></div>

            <div className="flex gap-4 flex-wrap justify-center md:justify-around items-center">
                {status.map((stat) => (
                    <div key={stat.id} className="flex items-center flex-col gap-2">
                        <span className='border border-gray-700 h-2 w-2 p-2 rounded'></span>
                        <span className='text-[14px] text-gray-600 font-[500]'>{stat.name}</span>
                    </div>
                ))}
            </div>
            {showModal && <EditModal onClose={() => setShowModal(false)} />}
            {phoneModal && <PhoneModal isOpen={phoneModal} onClose={() => setPhoneModal(false)} />}
            {emailModal && <EmailModal isOpen={emailModal} onClose={() => setEmailModal(false)} />}




        </section>
    )
}

export default Detail 