import { useState } from 'react';
import { FiChevronUp, FiInfo } from 'react-icons/fi';
import { IoChevronDown } from 'react-icons/io5';

const Setting = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [isPersonalInfoOpen, setPersonalInfoOpen] = useState(true);
    const [isNotificationsOpen, setNotificationsOpen] = useState(true);
    const [voicemailOption, setVoicemailOption] = useState('auto');
    const [liveAnswerBeep, setLiveAnswerBeep] = useState(false);

    const tabs = [
        { id: 'personal', label: 'Personal Info & Notification' },
        { id: 'caller-id', label: 'Caller ID & Campaigns' },
        { id: 'dialer', label: 'Dialer Settings' },
        { id: 'touch-points', label: 'Touch Points' },
        { id: 'lead-sheet', label: 'Lead Sheet Templates' },
    ];

    return (
        <section className="w-full min-h-screen  pr-5 pt-1 pb-4">
            <div className="">
                   {/* Header */}
                   <header className="flex items-center gap-7 mb-6">
                    <h1 className="text-[#0E1011] text-[20px] md:text-[26px] lg:text-[28px] font-[500]">Settings</h1>
                    <p className="text-[16px] font-[500] text-[#495057]">Changes saved 18:09</p>
                </header>

                {/* Tab Navigation */}
                <div className="flex flex-wrap bg-white py-5 px-4 rounded-lg gap-2 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-yellow-400 text-gray-900'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

             
                {/* Main content */}
                <main className="space-y-6">
                    {activeTab === 'personal' && (
                        <>
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
                        </>
                    )}

                    {activeTab === 'caller-id' && (
                        <div className="bg-white rounded-[12px] shadow-sm p-6">
                            <h2 className="text-[24px] font-[500] text-[#17181B] mb-6">Caller ID & Campaigns</h2>
                            
                            {/* Default CallID */}
                            <div className="mb-8">
                                <label className="text-[14px] font-[500] text-[#495057] block mb-2">Default CallID</label>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                    <div className="bg-[#F3F4F7] py-[8px] px-[12px] rounded-[12px] w-full sm:max-w-sm">
                                        <input
                                            type="text"
                                            defaultValue="+1 (555) 123-456"
                                            readOnly
                                            className="w-full bg-transparent text-[16px] text-[#0E1011] font-[400] focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-[14px] text-[#495057]">
                                        <FiInfo className="w-4 h-4 text-gray-300" />
                                        <span className="test-gray-300">Caller IDs are managed by Admin</span>
                                    </div>
                                </div>
                            </div>

                            {/* Outbound Caller IDs */}
                            <div>
                                <h3 className="text-[18px] font-[500] text-[#34363B] mb-4">Outbound Caller IDs</h3>
                                <div className="space-y-4">
                                    {/* Caller ID Entry 1 */}
                                    <div className="flex items-center py-4 pl-2  rounded-lg">
  <div className="flex items-center gap-4">
    {/* Card */}
    <div className="border border-gray-200 rounded-xl py-2 pl-3 sm:pr-34 pr-16 bg-white">
      <p className="text-[15px] font-medium text-[#0E1011] leading-tight">
        +1 (555) 123-4567
      </p>
      <p className="text-[13px] text-[#6B7280]">
        Campaigns: Campaign A, Campaign B
      </p>
    </div>

    {/* Button */}
    <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg">
      Active
    </button>
  </div>
</div>



                                    {/* Caller ID Entry 2 */}
                                    <div className="flex items-center py-4 pl-2  rounded-lg">
  <div className="flex items-center gap-4">
    {/* Card */}
    <div className="border border-gray-200 rounded-xl py-2 pl-3 sm:pr-34 pr-16 bg-white">
      <p className="text-[15px] font-medium text-[#0E1011] leading-tight">
        +1 (555) 123-4567
      </p>
      <p className="text-[13px] text-[#6B7280]">
        Campaigns: Campaign A, Campaign B
      </p>
    </div>

    {/* Button */}
    <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg">
      Active
    </button>
  </div>
</div>

                                    {/* Caller ID Entry 3 */}
                                   <div className="flex items-center py-4 pl-2  rounded-lg">
  <div className="flex items-center gap-4">
    {/* Card */}
    <div className="border border-gray-200 rounded-xl py-2 pl-3 sm:pr-34 pr-16 bg-white">
      <p className="text-[15px] font-medium text-[#0E1011] leading-tight">
        +1 (555) 123-4567
      </p>
      <p className="text-[13px] text-[#6B7280]">
        Campaigns: Campaign A, Campaign B
      </p>
    </div>

    {/* Button */}
    <button className="px-4 py-1.5 bg-gray-300 text-black text-sm font-medium rounded-lg">
                                            Inactive
                                        </button>
  </div>
</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'dialer' && (
                        <div className="bg-white rounded-[12px] shadow-sm p-6">
                            <h2 className="text-[24px] font-[500] text-[#17181B] mb-6">Dialer Settings</h2>
                            
                            <div className="space-y-8">
                                {/* Voicemail Handling */}
                                <div>
                                    <h3 className="text-[18px] font-[500] text-[#34363B] mb-2">Voicemail Handling</h3>
                                    <p className="text-[14px] text-[#495057] mb-4">Choose how to handle voicemail messages</p>
                                    
                                    <div className="space-y-4">
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="voicemail"
                                                value="manual"
                                                checked={voicemailOption === 'manual'}
                                                onChange={(e) => setVoicemailOption(e.target.value)}
                                                className="mt-1 appearance-none h-5 w-5 cursor-pointer rounded-full border-2 border-gray-300 bg-white checked:border-[4px] checked:border-[#34363B] focus:outline-none focus:ring-0"
                                            />
                                            <div className="flex-1">
                                                <p className="text-[16px] font-medium text-[#17181B]">Manual Voicemail</p>
                                                <p className="text-[14px] text-[#495057] mt-1">Agent manually drops voicemail during the call</p>
                                            </div>
                                        </label>
                                        
                                        <label className="flex items-start gap-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="voicemail"
                                                value="auto"
                                                checked={voicemailOption === 'auto'}
                                                onChange={(e) => setVoicemailOption(e.target.value)}
                                                className="mt-1 appearance-none h-5 w-5 cursor-pointer rounded-full border-2 border-gray-300 bg-white checked:border-[4px] checked:border-[#34363B] focus:outline-none focus:ring-0"
                                            />
                                            <div className="flex-1">
                                                <p className="text-[16px] font-medium text-[#17181B]">Auto Drop Voicemail</p>
                                                <p className="text-[14px] text-[#495057] mt-1">System automatically drops pre-recorded voicemail</p>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Time Zone */}
                                <div>
                                    <h3 className="text-[18px] font-[500] text-[#34363B] mb-2">Time Zone</h3>
                                    <p className="text-[14px] text-[#495057] mb-4">Select your time zone</p>
                                    
                                    <div className="bg-[#F3F4F7] py-[8px] px-[12px] rounded-[12px] w-full sm:max-w-sm relative">
                                        <select className="w-full bg-transparent text-[16px] text-[#0E1011] font-[400] focus:outline-none appearance-none pr-8">
                                            <option>Eastern Time (ET)</option>
                                            <option>Central Time (CT)</option>
                                            <option>Mountain Time (MT)</option>
                                            <option>Pacific Time (PT)</option>
                                            <option>Alaska Time (AKT)</option>
                                            <option>Hawaii Time (HST)</option>
                                        </select>
                                        <IoChevronDown className="absolute text-[#47474C] right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[18px]" />
                                    </div>
                                </div>

                                {/* Live Answer Beep */}
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="text-[18px] font-[500] text-[#34363B] mb-2">Live Answer Beep</h3>
                                        <p className="text-[14px] text-[#495057]">Play a beep sound when a live person answers</p>
                                    </div>
                                    <button
                                        onClick={() => setLiveAnswerBeep(!liveAnswerBeep)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                            liveAnswerBeep ? 'bg-yellow-400' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                liveAnswerBeep ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'touch-points' && (
                        <div className="bg-white rounded-[12px] shadow-sm p-6">
                            {/* Header with title and Create button */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-[24px] font-[500] text-[#17181B]">Touch Point</h2>
                                <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto">
                                    Create Touch Point
                                </button>
                            </div>

                            {/* Touch Point Cards */}
                            <div className="space-y-4">
                                {/* Touch Point Card 1 */}
                                <div className="flex items-center justify-between px-3 py-4 bg-white border border-gray-200 rounded-lg   transition-shadow">
                                    <div className="flex-1">
                                        <h3 className="text-[16px] font-bold text-[#17181B] mb-1">Welcome Email</h3>
                                        <p className="text-[14px] text-[#495057]">Email • Schedule: Day 1</p>
                                    </div>
                                    <button className="px-4 py-2  border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                                        Edit
                                    </button>
                                </div>

                                {/* Touch Point Card 2 */}
                                <div className="flex items-center justify-between px-3 py-4 bg-white border border-gray-200 rounded-lg   transition-shadow">
                                    <div className="flex-1">
                                        <h3 className="text-[16px] font-bold text-[#17181B] mb-1">Welcome Email</h3>
                                        <p className="text-[14px] text-[#495057]">Email • Schedule: Day 2</p>
                                    </div>
                                    <button className="px-4 py-2  border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                                        Edit
                                    </button>
                                </div>

                                {/* Touch Point Card 3 */}
                                <div className="flex items-center justify-between px-3 py-4 bg-white border border-gray-200 rounded-lg   transition-shadow">
                                    <div className="flex-1">
                                        <h3 className="text-[16px] font-bold text-[#17181B] mb-1">Welcome Email</h3>
                                        <p className="text-[14px] text-[#495057]">Email • Schedule: Day 3</p>
                                    </div>
                                    <button className="px-4 py-2  border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'lead-sheet' && (
                        <div className="bg-white rounded-[12px] shadow-sm p-6">
                            {/* Header with title and Manage Templates button */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-[24px] font-[500] text-[#17181B]">Lead Sheet Templates</h2>
                                <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto">
                                    Manage Templates
                                </button>
                            </div>

                            {/* Lead Sheet Template Cards */}
                            <div className="space-y-4">
                                {/* Template Card 1 */}
                                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg transition-shadow">
                                    <div className="flex-1">
                                        <h3 className="text-[16px] font-bold text-[#17181B] mb-1">Standard Lead Sheet</h3>
                                        <p className="text-[14px] text-[#495057]">12 fields • Last updated Dec 15, 2025</p>
                                    </div>
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                                        Select
                                    </button>
                                </div>

                                {/* Template Card 2 */}
                                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg transition-shadow">
                                    <div className="flex-1">
                                        <h3 className="text-[16px] font-bold text-[#17181B] mb-1">Detailed Prospect Form</h3>
                                        <p className="text-[14px] text-[#495057]">24 fields • Last updated Jan 2, 2026</p>
                                    </div>
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                                        Select
                                    </button>
                                </div>

                                {/* Template Card 3 */}
                                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg transition-shadow">
                                    <div className="flex-1">
                                        <h3 className="text-[16px] font-bold text-[#17181B] mb-1">Quick Capture</h3>
                                        <p className="text-[14px] text-[#495057]">6 fields • Last updated Nov 30, 2025</p>
                                    </div>
                                    <button className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors">
                                        Select
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </section>
    );
};

export default Setting;
