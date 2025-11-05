import { useState } from 'react';
import { FiChevronUp } from 'react-icons/fi'; // Icon ke liye: npm install react-icons

const Setting = () => {
    const [isPersonalInfoOpen, setPersonalInfoOpen] = useState(true);
    const [isNotificationsOpen, setNotificationsOpen] = useState(true);

    return (
        <section className="w-full min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="mr-10">
                {/* Header */}
                <header className="flex items-baseline gap-4 mb-6">
                    <h1 className="text-[#0E1011] text-[20px] md:text-[26px] lg:text-[28px] font-bold">Settings</h1>
                    <p className="text-[14px] font-normal text-gray-500">Changes saved 18:09</p>
                </header>

                {/* Main content */}
                <main className="space-y-6">

                    {/* --- Personal Info --- */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                        <button
                            className="flex items-center justify-between w-full p-6 text-left"
                            onClick={() => setPersonalInfoOpen(!isPersonalInfoOpen)}
                        >
                            <h2 className="text-xl font-semibold text-gray-800">Personal Info</h2>
                            <FiChevronUp
                                className={`text-gray-500 transform transition-transform duration-300 ${isPersonalInfoOpen ? 'rotate-0' : 'rotate-180'}`}
                                size={20}
                            />
                        </button>
                        {isPersonalInfoOpen && (
                            <div className="px-6 pb-6">
                                <div className="space-y-5">

                                    {/* Full Name */}
                                    <div className="bg-gray-100/70 p-3 rounded-lg w-full sm:max-w-sm">
                                        <label htmlFor="fullName" className="text-xs text-gray-500 block">Full Name</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            defaultValue="John Lee"
                                            readOnly
                                            className="w-full bg-transparent text-gray-900 font-medium focus:outline-none"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="bg-gray-100/70 p-3 rounded-lg w-full sm:max-w-sm">
                                            <label htmlFor="email" className="text-xs text-gray-500 block">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                defaultValue="user@example.com"
                                                readOnly
                                                className="w-full bg-transparent text-gray-900 font-medium focus:outline-none"
                                            />
                                        </div>
                                        <button className="flex-shrink-0 bg-gray-200 text-gray-800 text-sm font-semibold px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors w-full sm:w-auto">
                                            Change Email
                                        </button>
                                    </div>

                                    {/* Time Zone */}
                                    <div className="bg-gray-100/70 p-3 rounded-lg w-full sm:max-w-sm">
                                        <label htmlFor="timezone" className="text-xs text-gray-500 block">Time zone</label>
                                        <select
                                            id="timezone"
                                            className="w-full bg-transparent text-gray-900 font-medium focus:outline-none appearance-none pr-8 cursor-pointer"
                                        >
                                            <option>GMT+3</option>
                                            <option>GMT+5</option>
                                            <option>GMT-8</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* --- Notification Preferences --- */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                        <button
                            className="flex items-center justify-between w-full p-6 text-left"
                            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                        >
                            <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
                            <FiChevronUp
                                className={`text-gray-500 transform transition-transform duration-300 ${isNotificationsOpen ? 'rotate-0' : 'rotate-180'}`}
                                size={20}
                            />
                        </button>
                        {isNotificationsOpen && (
                            <div className="px-6 pb-6">
                                <div className="space-y-8">

                                    {/* Channels - Checkbox */}
                                    <div className="space-y-3">
                                        <h3 className="font-medium text-gray-800">Channels:</h3>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="channel-email"
                                                defaultChecked
                                                className="h-5 w-5 rounded border-black bg-white accent-black focus:ring-0 cursor-pointer"
                                            />
                                            <label htmlFor="channel-email" className="text-sm text-gray-800 cursor-pointer">Email</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="channel-inapp"
                                                defaultChecked
                                                className="h-5 w-5 rounded border-black bg-white accent-black focus:ring-0 cursor-pointer"
                                            />
                                            <label htmlFor="channel-inapp" className="text-sm text-gray-800 cursor-pointer">In-App</label>
                                        </div>
                                    </div>

                                    {/* Reminders - Radio */}
                                    <div className="space-y-3">
                                        <h3 className="font-medium text-gray-800">Reminders:</h3>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="rem-none"
                                                name="reminders"
                                                defaultChecked
                                                className="h-5 w-5 border-black bg-white accent-black focus:ring-0 cursor-pointer"
                                            />
                                            <label htmlFor="rem-none" className="text-sm text-gray-800 cursor-pointer">None</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="rem-5min"
                                                name="reminders"
                                                className="h-5 w-5 border-black bg-white accent-black focus:ring-0 cursor-pointer"
                                            />
                                            <label htmlFor="rem-5min" className="text-sm text-gray-800 cursor-pointer">5 min</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="rem-10min"
                                                name="reminders"
                                                className="h-5 w-5 border-black bg-white accent-black focus:ring-0 cursor-pointer"
                                            />
                                            <label htmlFor="rem-10min" className="text-sm text-gray-800 cursor-pointer">10 min</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="rem-15min"
                                                name="reminders"
                                                className="h-5 w-5 border-black bg-white accent-black focus:ring-0 cursor-pointer"
                                            />
                                            <label htmlFor="rem-15min" className="text-sm text-gray-800 cursor-pointer">15 min</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="rem-30min"
                                                name="reminders"
                                                className="h-5 w-5 border-black bg-white accent-black focus:ring-0 cursor-pointer"
                                            />
                                            <label htmlFor="rem-30min" className="text-sm text-gray-800 cursor-pointer">30 min</label>
                                        </div>
                                    </div>

                                    {/* Campaign Events - Checkbox */}
                                    <div className="space-y-3">
                                        <h3 className="font-medium text-gray-800">Notification for Campaign Events:</h3>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="event-incoming"
                                                defaultChecked
                                                className="h-5 w-5 rounded border-black bg-white accent-black focus:ring-0 cursor-pointer"
                                            />
                                            <label htmlFor="event-incoming" className="text-sm text-gray-800 cursor-pointer">Incoming follow-up calls</label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="event-scheduled"
                                                defaultChecked
                                                className="h-5 w-5 rounded border-black bg-white accent-black focus:ring-0 cursor-pointer"
                                            />
                                            <label htmlFor="event-scheduled" className="text-sm text-gray-800 cursor-pointer">Scheduled meetings from campaigns</label>
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
