import { useState } from 'react';
import { FiChevronUp } from 'react-icons/fi'; // Icon ke liye: npm install react-icons
import { IoChevronDown } from 'react-icons/io5';

const Setting = () => {
    const [isPersonalInfoOpen, setPersonalInfoOpen] = useState(true);
    const [isNotificationsOpen, setNotificationsOpen] = useState(true);

    return (
        <section className="w-full min-h-screen  pr-5 pt-1 pb-4">
            <div className="">
                {/* Header */}
                <header className="flex items-center gap-7 mb-6">
                    <h1 className="text-[#0E1011] text-[20px] md:text-[26px] lg:text-[28px] font-[500]">Settings</h1>
                    <p className="text-[16px] font-[500] text-[#495057]">Changes saved 18:09</p>
                </header>

                {/* Main content */}
                <main className="space-y-6">

                    {/* --- Personal Info --- */}
                    <div className="bg-white rounded-[12px] shadow-sm">
                        <button
                            className="flex items-center pt-[24px] py-[32px] px-[24px] justify-between w-full  text-left"
                            onClick={() => setPersonalInfoOpen(!isPersonalInfoOpen)}
                        >
                            <h2 className="text-[24px] -translate-x-2 inter font-[500] text-[#17181B]">Personal Info</h2>
                            <FiChevronUp
                                className={`text-gray-500 transform transition-transform duration-300 ${isPersonalInfoOpen ? 'rotate-0' : 'rotate-180'}`}
                                size={20}
                            />
                        </button>
                        {isPersonalInfoOpen && (
                            <div className="px-6 pb-6">
                                <div className="space-y-5">

                                    {/* Full Name */}
                                    <div className="bg-[#F3F4F7] py-[8px] px-[12px] rounded-[12px] w-full sm:max-w-sm">
                                        <label htmlFor="fullName" className="text-[12px] font-[500] text-[#495057] block">Full Name</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            defaultValue="John Lee"
                                            readOnly
                                            className="w-full bg-transparent text-[16px] text-[#0E1011] font-[400] focus:outline-none"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="bg-[#F3F4F7] py-[8px] px-[12px] rounded-[12px] w-full sm:max-w-sm">
                                            <label htmlFor="email" className="text-[12px] font-[500] text-[#495057] block">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                defaultValue="user@example.com"
                                                readOnly
                                                className="w-full bg-transparent text-[16px] text-[#0E1011] font-[400] focus:outline-none"
                                            />
                                        </div>
                                        <button className=" bg-gray-200 text-[#0E1011] text-[16px] py-[8px] px-[12px] font-[500] rounded-[8px] hover:bg-gray-300 transition-colors w-full sm:w-auto">
                                            Change Email
                                        </button>
                                    </div>

                                    {/* Time Zone */}
                                    <div className="bg-[#F3F4F7] py-[8px] px-[12px] rounded-[12px] w-full sm:max-w-sm relative">
                                        <label
                                            htmlFor="timezone"
                                            className="text-[12px] font-[500] text-[#495057] block"
                                        >
                                            Time zone
                                        </label>

                                        <select
                                            id="timezone"
                                            className="w-full bg-transparent text-[16px] text-[#0E1011] font-[400] focus:outline-none appearance-none pr-8"
                                        >
                                            <option>GMT+3</option>
                                            <option>GMT+5</option>
                                            <option>GMT-8</option>
                                        </select>

                                        {/* React Icon */}
                                        <IoChevronDown className="absolute text-[#47474C] right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[18px]" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- Notification Preferences --- */}
                    <div className="bg-white rounded-[12px] shadow-sm">
                        <button
                            className="flex items-center justify-between w-full pt-[24px] py-[32px] px-[24px] text-left"
                            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                        >
                            <h2 className="text-[24px] -translate-x-2 inter font-[500] text-[#17181B]">Notification Preferences</h2>
                            <FiChevronUp
                                className={`text-gray-500 transform transition-transform duration-300 ${isNotificationsOpen ? 'rotate-0' : 'rotate-180'}`}
                                size={20}
                            />
                        </button>
                        {isNotificationsOpen && (
                            <div className="px-6 pb-6">
                                <div className="space-y-8">

                                    {/* Channels - Checkbox */}
                                    <div className="space-y-2 ">
                                        <h3 className="font-[500] -translate-x-2  inter text-[18px] text-[#34363B]">Channels:</h3>

                                        {/* Email Channel Checkbox */}
                                        <div className="flex items-center gap-3">
                                            <label htmlFor="channel-email" className="relative  flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id="channel-email"
                                                    defaultChecked
                                                    className="peer relative h-5 w-5 cursor-pointer appearance-none border border-black bg-white transition-all checked:border-black checked:bg-black"
                                                />
                                                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        stroke="#D1D5DB" // Light gray color for the tick
                                                        strokeWidth="2"   // Adjust for desired thickness
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M4.5 9.5l4 4L15.5 5"
                                                        />
                                                    </svg>
                                                </div>
                                            </label>
                                            <label
                                                htmlFor="channel-email"
                                                className="text-[16px]  inter font-[400] text-[#495057] cursor-pointer"
                                            >
                                                Email
                                            </label>
                                        </div>

                                        {/* In-App Channel Checkbox */}
                                        <div className="flex  items-center gap-3">
                                            <label htmlFor="channel-inapp" className="relative flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id="channel-inapp"
                                                    defaultChecked
                                                    className="peer relative h-5 w-5 cursor-pointer appearance-none border border-black bg-white transition-all checked:border-black checked:bg-black"
                                                />
                                                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        stroke="#D1D5DB" // Light gray color for the tick
                                                        strokeWidth="2"   // Adjust for desired thickness
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M4.5 9.5l4 4L15.5 5"
                                                        />
                                                    </svg>
                                                </div>
                                            </label>
                                            <label
                                                htmlFor="channel-inapp"
                                                className="text-[16px] inter font-[400] text-[#495057] cursor-pointer"
                                            >
                                                In-App
                                            </label>
                                        </div>
                                    </div>


                                    {/* Reminders - Radio */}
                                    <div className="space-y-2">
                                        <h3 className="font-[500] -translate-x-2 inter text-[18px] text-[#34363B]">Reminders:</h3>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="rem-none"
                                                name="reminders"
                                                defaultChecked
                                                className="appearance-none h-5 w-5 cursor-pointer rounded-full border-2 border-gray-300 bg-white checked:border-[4px] checked:border-[#34363B] focus:outline-none focus:ring-0"
                                            />
                                            <label htmlFor="rem-none" className="cursor-pointer font-[400] text-[16px] inter text-[#495057]">None</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="rem-5min"
                                                name="reminders"
                                                className="appearance-none h-5 w-5 cursor-pointer rounded-full border-2 border-gray-300 bg-white checked:border-[4px] checked:border-[#34363B] focus:outline-none focus:ring-0"
                                            />
                                            <label htmlFor="rem-5min" className="cursor-pointer font-[400] text-[16px] inter text-[#495057]">5 min</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="rem-10min"
                                                name="reminders"
                                                className="appearance-none h-5 w-5 cursor-pointer rounded-full border-2 border-gray-300 bg-white checked:border-[4px] checked:border-[#34363B] focus:outline-none focus:ring-0"
                                            />
                                            <label htmlFor="rem-10min" className="cursor-pointer font-[400] text-[16px] inter text-[#495057]">10 min</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="rem-15min"
                                                name="reminders"
                                                className="appearance-none h-5 w-5 cursor-pointer rounded-full border-2 border-gray-300 bg-white checked:border-[4px] checked:border-[#34363B] focus:outline-none focus:ring-0"
                                            />
                                            <label htmlFor="rem-15min" className="cursor-pointer font-[400] text-[16px] inter text-[#495057]">15 min</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="rem-30min"
                                                name="reminders"
                                                className="appearance-none h-5 w-5 cursor-pointer rounded-full border-2 border-gray-300 bg-white checked:border-[4px] checked:border-[#34363B] focus:outline-none focus:ring-0"
                                            />
                                            <label htmlFor="rem-30min" className="cursor-pointer font-[400] text-[16px] inter text-[#495057]">30 min</label>
                                        </div>
                                    </div>

                                    {/* Campaign Events - Checkbox */}
                                    <div className="space-y-2">
                                        <h3 className="inter -translate-x-2 font-[500] text-[#34363B] text-[18px] cursor-pointer">Notification for Campaign Events:</h3>

                                        {/* Incoming follow-up calls Checkbox */}
                                        <div className="flex items-center gap-3">
                                            <label htmlFor="event-incoming" className="relative flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id="event-incoming"
                                                    defaultChecked
                                                    className="peer relative h-5 w-5 cursor-pointer appearance-none border border-black bg-white transition-all checked:border-black checked:bg-black"
                                                />
                                                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        stroke="#D1D5DB" // Light gray color for the tick
                                                        strokeWidth="2"   // Adjust for desired thickness
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M4.5 9.5l4 4L15.5 5"
                                                        />
                                                    </svg>
                                                </div>
                                            </label>
                                            <label
                                                htmlFor="event-incoming"
                                                className="inter font-[400] text-[#495057] text-[16px] cursor-pointer"
                                            >
                                                Incoming follow-up calls
                                            </label>
                                        </div>

                                        {/* Scheduled meetings from campaigns Checkbox */}
                                        <div className="flex items-center gap-3">
                                            <label htmlFor="event-scheduled" className="relative flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id="event-scheduled"
                                                    defaultChecked
                                                    className="peer relative h-5 w-5 cursor-pointer appearance-none border border-black bg-white transition-all checked:border-black checked:bg-black"
                                                />
                                                <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        viewBox="0 0 20 20"
                                                        fill="none"
                                                        stroke="#D1D5DB" // Light gray color for the tick
                                                        strokeWidth="2"   // Adjust for desired thickness
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M4.5 9.5l4 4L15.5 5"
                                                        />
                                                    </svg>
                                                </div>
                                            </label>
                                            <label
                                                htmlFor="event-scheduled"
                                                className="inter font-[400] text-[#495057] text-[16px] cursor-pointer"
                                            >
                                                Scheduled meetings from campaigns
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </section>
    );
};

export default Setting;
