import { useState } from 'react'
import mapIcon from "@/assets/mapicon.png"
import streeticon from "@/assets/streeticon.png"
import groupicon from "@/assets/groupicon.png"
import { CiMail } from "react-icons/ci";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoAddOutline } from "react-icons/io5";
import EditModal from '@/components/modal/editmodal';
import PhoneModal from '@/components/modal/phonemodal';
import EmailModal from '@/components/modal/emailmodal';
import editcontactdetail from "../../../assets/editcontactdetail.png"
import propertyicon from "../../../assets/propertyicon.png"
import kiticon from "../../../assets/kiticon.png"
import callsicon from "../../../assets/callsicon.png"
import mobileicon from "../../../assets/mobileicon.png"
import doticon from "../../../assets/doticon.png"





const Detail = () => {
    const [showModal, setShowModal] = useState(false);
    const [phoneModal, setPhoneModal] = useState(false);
    const [emailModal, setEmailModal] = useState(false);
    const [openDesposition, setOpenDesposition] = useState("Call Back");


    const data = [
        { id: 1, name: "Calls", number: 2 },
        { id: 2, name: "Emails", number: 3 },
        { id: 3, name: "SMS", number: 0 },
    ]

    const phones = [
        { id: 1, number: "(252) 555-0126", icon: kiticon },
        { id: 2, number: "(252) 555-0126", icon: kiticon },
        { id: 3, number: "(252) 555-0126", icon: callsicon },
        { id: 4, number: "(252) 555-0126", icon: mobileicon },
        { id: 5, number: "(252) 555-0126", icon: doticon },
        { id: 5, number: "(252) 555-0126", icon: doticon },
    ]


    const emails = [
        { id: 1, email: "nchawdhry@aol.com" },
        { id: 2, email: "nchawdhry@aol.com" },
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
        <section className='bg-white flex flex-col gap-8   px-6 py-5 w-[96%] mx-auto rounded-[24px]'>

            <div className='flex flex-col md:flex-row md:justify-between md:items-center'>

                <div className='flex  flex-col lg:flex-row  lg:gap-14 lg:items-center'>
                    <div className='flex flex-col '>
                        <div className='flex  items-center gap-7'>
                            <h1 className='text-[20px] md:text-[28px] text-[#0E1011] font-[500]'>Contact Name</h1>
                            <span className="bg-[#F7F7F7] p-2 rounded-[12px]">
                                <img src={editcontactdetail} onClick={() => setShowModal(true)} className="w-[18px] object-contain " />
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-[14px] font-[500] text-[#2B3034]'>Name</span>
                            <span className='text-[14px] font-[400] text-[#495057]'>(Co-owner)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-5'>
                        {data.map((dt) => (
                            <span key={dt.id} className='flex text-[14px] gap-1 items-center'>
                                <h1 className='text-[#2B3034] font-[500]'>{dt.name}:</h1>
                                <h1 className='text-[#0E1011] font-[600]' >{dt.number}</h1>
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
                    <div className='flex gap-1 items-start'>
                        <img src={propertyicon} className='w-[15px] translate-y-0.5 object-contain' />                      <div className='flex flex-col gap-1'>
                            <span>
                                <h1 className='text-[14px] font-[500] text-[#0E1011]'>Property Address:</h1>
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

                    <div className='flex gap-1 items-start'>
                        <h1><CiMail className='text-[19px] translate-y-0.5 font-[500] text-[#0E1011]' /></h1>
                        <div className='flex flex-col gap-1'>
                            <span>
                                <h1 className='text-[14px] font-[500] text-[#0E1011]'>Mailing Address:</h1>
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


                <div className='flex w-full  lg:w-1/3  flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-[14px] font-[500] text-[#0E1011]'>Phones:</h1>
                        <span onClick={() => setPhoneModal(true)} className='p-1 rounded-[8px] bg-[#F7F7F7]'><IoAddOutline className='text-[#495057] text-[18px]' /></span>
                    </div>
                    <div className='flex flex-col gap-1 '>
                        {phones.map((phone) => (
                            <div key={phone.id} className='flex px-1 py-2 justify-between  border-b border-gray-100 items-center gap-2'>
                                <div className='flex gap-4 items-center'>
                                    {/* <span className='text-xl text-[#495057]'>{phone.icon}</span> */}
                                    <img src={phone.icon} alt="icon" />
                                    <span className='text-[#1D85F0] font-[500] text-[14px]'>{phone.number}</span>
                                </div>
                                <div>

                                    <BsThreeDotsVertical className='text-[#2B3034] text-[15px]' />

                                </div>
                            </div>
                        ))}
                    </div>

                </div>


                <div className='flex w-full lg:w-1/3 flex-col gap-1'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-[14px] font-[500] text-[#0E1011]'>E-mails:</h1>
                        <span onClick={() => setEmailModal(true)} className='p-1 rounded-[8px] bg-[#F7F7F7]'><IoAddOutline className='text-[#495057] text-[18px]' /></span>
                    </div>
                    <div className='flex flex-col gap-3 '>
                        {emails.map((email) => (
                            <div key={email.id} className='flex  px-1 py-2 justify-between  border-b border-gray-100 items-center gap-2'>
                                <div className='flex gap-4 items-center'>
                                    <span className='text-[#1D85F0] font-[500] text-[14px]'>{email.email}</span>
                                </div>
                                <div>

                                    <BsThreeDotsVertical className='text-[#2B3034] text-[15px]' />


                                </div>
                            </div>
                        ))}
                    </div>

                </div>




            </div>

            <div className='flex  flex-col lg:flex-row w-full md:w-[60%]  lg:items-center gap-12'>
                <div className='flex w-full md:w-full items-center gap-4'>
                    <label htmlFor="list" className='text-[14px] text-[#0E1011] font-[500]'>List :</label>
                    <input type="text" id="list" placeholder='List Number 1'
                        className='border-b py-1 px-2 font-[400] text-[#18181B] placeholder:text-[#18181B] border-gray-300 flex-1  placeholder:text-[16px] text-[16px] outline-none' />
                </div>

                <div className='flex w-full md:w-full items-center gap-4'>
                    <label htmlFor="group" className='text-[14px] text-[#0E1011] font-[500]'>Group</label>
                    <input type="text" id="group" placeholder='Working'
                        className='border-b py-1 px-2 font-[400] text-[#18181B] placeholder:text-[#18181B] border-gray-300 flex-1  placeholder:text-[16px] text-[16px] outline-none' />

                </div>
            </div>


            <div className='flex  flex-col gap-3'>
                <h1 className='text-[14px] text-[#0E1011] font-[500]'>Dispositions:</h1>
                <div className='flex gap-4 flex-wrap items-center'>
                    {despositions.map((disp) => (
                        <span key={disp.id} onClick={() => setOpenDesposition(disp.name)}
                            className={`${openDesposition === disp.name ? "bg-[#0E1011] text-[#FFFFFF]" : "bg-[#EBEDF0] text-[#18181B]"}  cursor-pointer rounded-[8px] text-[14px]  px-[16px] py-[5px] font-[400]`}>
                            {disp.name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="border-t  border-gray-100 w-full"></div>

            <div className="flex gap-4 flex-wrap justify-center md:justify-around items-center">
                {status.map((stat) => (
                    <div key={stat.id} className="flex items-center flex-col gap-2">
                        <span className='border border-[#495057] h-2 w-2 p-2 rounded-[1.5px]'></span>
                        <span className='text-[14px] text-[#495057] inter font-[400]'>{stat.name}</span>
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