import { useState } from 'react';
import { FiChevronUp } from 'react-icons/fi';
import { IoMdCamera } from 'react-icons/io';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// // === TYPES ===
// interface InfoFieldProps {
//     label: string;
//     value: string;
// }

interface CheckboxOptionProps {
    id: string;
    label: string;
    defaultChecked?: boolean;
}

interface RadioOptionProps {
    id: string;
    name: string;
    label: string;
    defaultChecked?: boolean;
}

// === REUSABLE INPUT FIELD ===
// const InfoField = ({ label, value }: InfoFieldProps) => (
//     <div className="bg-[#F9FAFB] flex flex-col gap-1 px-2 py-1.5 rounded-lg w-full sm:max-w-md">
//         <label className="text-xs text-gray-500 block">{label}</label>
//         <input
//             type="text"
//             value={value}
//             readOnly
//             className="w-full text-sm bg-transparent text-gray-900 font-medium focus:outline-none"
//         />
//     </div>
// );

// === CHECKBOX ===
const CheckboxOption = ({ id, label, defaultChecked = false }: CheckboxOptionProps) => (
    <div className="flex items-center gap-3">
        <input
            type="checkbox"
            id={id}
            defaultChecked={defaultChecked}
            className="h-4 w-4 rounded accent-black border-gray-400 text-black focus:ring-0 cursor-pointer"
        />
        <label htmlFor={id} className="text-[16px] text-[#495057] font-[400] cursor-pointer">{label}</label>
    </div>
);

// === RADIO OPTION ===
const RadioOption = ({ id, name, label, defaultChecked = false }: RadioOptionProps) => (
    <div className="flex items-center gap-3">
        <input
            type="radio"
            id={id}
            name={name}
            defaultChecked={defaultChecked}
            className="h-4 accent-black w-4 border-gray-400 text-black focus:ring-0 cursor-pointer"
        />
        <label htmlFor={id} className="text-sm text-gray-800 cursor-pointer">{label}</label>
    </div>
);

const AdminAccountSetting = () => {
    const [isPersonalInfoOpen, setPersonalInfoOpen] = useState(true);
    const [isNotificationsOpen, setNotificationsOpen] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState<string>('+10000000000');

    const handlePhoneChange = (value?: string) => {
        setPhoneNumber(value || '');
    };

    return (
        <section className="w-full pr-3 lg:pr-6 min-h-screen font-sans ">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <header className="flex items-baseline gap-4 mb-6">
                    <h1 className="text-gray-900 text-xl md:text-3xl font-bold">Account Settings</h1>
                    <p className="text-sm font-normal text-gray-500">Changes saved 18:09</p>
                </header>

                <main className="space-y-6">

                    {/* Personal Info */}
                    <div className="bg-white rounded-[24px]">
                        {/* Header */}
                        <button
                            className="flex items-center mb-4 justify-between w-full p-5 text-left"
                            onClick={() => setPersonalInfoOpen(!isPersonalInfoOpen)}
                        >
                            <h2 className="text-[24px] font-[500] inter text-[#17181B]">Personal Info</h2>
                            <FiChevronUp
                                className={`text-gray-500 transition-transform duration-300 ${isPersonalInfoOpen ? "rotate-0" : "rotate-180"
                                    }`}
                                size={20}
                            />
                        </button>

                        {isPersonalInfoOpen && (
                            <div className="px-5 pb-6">
                                {/* Upload Photo */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-28 h-28 bg-[#F3F4F7] rounded-full border-2 
                                    border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                        <IoMdCamera size={50} />

                                    </div>

                                    <div className='w-full lg:w-[35%] '>
                                        <button className="bg-[#FFCA06] hover:bg-yellow-500 
                                        text-[#0E1011] text-[18px] font-[500] px-4 py-2 rounded-[10px]">
                                            Upload Photo
                                        </button>
                                        <p className="text-[16px] w-full font-[400] text-[#848C94] mt-1">
                                            At least 800 × 800 px recommended. JPG or PNG is allowed
                                        </p>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                                    {/* Full Name */}
                                    <div className="bg-[#F3F4F7] w-full lg:w-[45%] px-3 py-1.5 rounded-[12px]">
                                        <label className="text-[12px] font-[500] text-[#495057] block mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value="John Lee"
                                            readOnly
                                            className="w-full bg-transparent text-sm text-gray-900 outline-none"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="bg-[#F3F4F7] w-full lg:w-[45%] px-3 py-1.5 rounded-[12px]">
                                        <label className="text-[12px] font-[500] text-[#495057] block mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value="user@example.com"
                                            readOnly
                                            className="w-full bg-transparent text-sm text-gray-900 outline-none"
                                        />
                                    </div>

                                    {/* Contact Number */}
                                    <div className="bg-[#F3F4F7] w-full lg:w-[45%] px-3 py-1.5 rounded-[12px]">
                                        <label className="text-[12px] font-[500] text-[#495057] block mb-1">
                                            Contact number
                                        </label>
                                        <PhoneInput
                                            international
                                            defaultCountry="US"
                                            value={phoneNumber}
                                            onChange={handlePhoneChange}
                                            className="w-full text-sm"
                                        />
                                    </div>

                                    {/* CallScout ID */}
                                    <div className="bg-[#F3F4F7] w-full lg:w-[45%] px-3 py-1.5 rounded-[12px]">
                                        <label className="text-[12px] font-[500] text-[#495057] block mb-1">
                                            CallScout Number ID
                                        </label>
                                        <input
                                            type="text"
                                            value="9182737465"
                                            readOnly
                                            className="w-full bg-transparent text-sm text-gray-900 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className='border-[0.2px] w-full mt-8 border-[#0B0A0E1A]'></div>

                                {/* Change Password */}
                                <button className="mt-6 bg-[#EBEDF0] hover:bg-gray-200
                                 text-[16px] font-[500] text-[#0E1011] px-5 py-2 rounded-[12px]">
                                    Change Password
                                </button>
                            </div>
                        )}
                    </div>


                    {/* Notifications */}
                    <div className="bg-white  rounded-[24px]">
                        <button
                            className="flex items-center justify-between w-full p-5 text-left"
                            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                        >
                            <h2 className="text-[24px] font-[500] inter text-[#17181B]">Notification Preferences</h2>
                            <FiChevronUp
                                className={`text-gray-500 transform transition-transform duration-300 ${isNotificationsOpen ? 'rotate-0' : 'rotate-180'}`}
                                size={20}
                            />
                        </button>

                        {isNotificationsOpen && (
                            <div className="px-5 pb-6 space-y-6">
                                {/* Channels */}
                                <div className="space-y-3 inter">
                                    <h3 className="font-[500] inter text-[#34363B]">Channels:</h3>
                                    <CheckboxOption id="channel-email" label="Email" defaultChecked />
                                    <CheckboxOption id="channel-inapp" label="In-App" defaultChecked />
                                    <CheckboxOption id="channel-sms" label="SMS" defaultChecked />
                                </div>

                                {/* Reminders */}
                                <div className="space-y-3 inter">
                                    <h3 className="font-[500]  inter text-[#34363B]">Reminders:</h3>
                                    <RadioOption id="rem-none" name="reminders" label="None" defaultChecked />
                                    <RadioOption id="rem-5min" name="reminders" label="5 min" />
                                    <RadioOption id="rem-10min" name="reminders" label="10 min" />
                                    <RadioOption id="rem-15min" name="reminders" label="15 min" />
                                    <RadioOption id="rem-30min" name="reminders" label="30 min" />
                                </div>

                                {/* Campaign Events */}
                                <div className="space-y-3 inter">
                                    <h3 className="font-[500] inter text-g[#34363B]">Notification for Campaign Events:</h3>
                                    <CheckboxOption id="event-incoming" label="Incoming follow-up calls" defaultChecked />
                                    <CheckboxOption id="event-scheduled" label="Scheduled meetings from campaigns" defaultChecked />
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Phone Input Styles */}
            <style>
                {`
                    .phone-input .PhoneInputInput {
                        border: none;
                        background-color: transparent;
                        font-weight: 500;
                        color: #111827;
                        outline: none;
                    }
                    .phone-input .PhoneInputCountry {
                        margin-right: 8px;
                    }
                `}
            </style>

        </section>
    );
};

export default AdminAccountSetting;
