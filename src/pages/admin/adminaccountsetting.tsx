// import { useState } from 'react';
// import { FiChevronUp } from 'react-icons/fi';
// import PhoneInput, { E164Number } from 'react-phone-number-input';
// import 'react-phone-number-input/style.css';

// // === TYPES ===
// interface InfoFieldProps {
//     label: string;
//     value: string;
// }

// interface CheckboxOptionProps {
//     id: string;
//     label: string;
//     defaultChecked?: boolean;
// }

// interface RadioOptionProps {
//     id: string;
//     name: string;
//     label: string;
//     defaultChecked?: boolean;
// }

// // === REUSABLE INPUT FIELD ===
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

// // === CHECKBOX ===
// const CheckboxOption = ({ id, label, defaultChecked = false }: CheckboxOptionProps) => (
//     <div className="flex items-center gap-3">
//         <input
//             type="checkbox"
//             id={id}
//             defaultChecked={defaultChecked}
//             className="h-4 w-4 rounded accent-black border-gray-400 text-black focus:ring-0 cursor-pointer"
//         />
//         <label htmlFor={id} className="text-sm text-gray-800 cursor-pointer">{label}</label>
//     </div>
// );

// // === RADIO OPTION ===
// const RadioOption = ({ id, name, label, defaultChecked = false }: RadioOptionProps) => (
//     <div className="flex items-center gap-3">
//         <input
//             type="radio"
//             id={id}
//             name={name}
//             defaultChecked={defaultChecked}
//             className="h-4 accent-black w-4 border-gray-400 text-black focus:ring-0 cursor-pointer"
//         />
//         <label htmlFor={id} className="text-sm text-gray-800 cursor-pointer">{label}</label>
//     </div>
// );

// const AdminAccountSetting = () => {
//     const [isPersonalInfoOpen, setPersonalInfoOpen] = useState(true);
//     const [isNotificationsOpen, setNotificationsOpen] = useState(true);

//     // FIX: String enforce kiya
//     const [phoneNumber, setPhoneNumber] = useState<string>("+10000000000");

//     const handlePhoneChange = (value?: E164Number | undefined) => {
//         setPhoneNumber(value || "");
//     };

//     return (
//         <section className="w-full pr-3 lg:pr-6 min-h-screen font-sans">
//             <div className="max-w-7xl mx-auto">

//                 {/* Header */}
//                 <header className="flex items-baseline gap-4 mb-6">
//                     <h1 className="text-gray-900 text-xl md:text-3xl font-bold">Account Settings</h1>
//                     <p className="text-sm font-normal text-gray-500">Changes saved 18:09</p>
//                 </header>

//                 <main className="space-y-6">

//                     {/* Personal Info */}
//                     <div className="bg-white border border-gray-200 rounded-xl">
//                         <button
//                             className="flex items-center justify-between w-full p-5 text-left"
//                             onClick={() => setPersonalInfoOpen(!isPersonalInfoOpen)}
//                         >
//                             <h2 className="text-lg font-bold text-gray-900">Personal Info</h2>
//                             <FiChevronUp
//                                 className={`text-gray-500 transform transition-transform duration-300 ${isPersonalInfoOpen ? 'rotate-0' : 'rotate-180'}`}
//                                 size={20}
//                             />
//                         </button>

//                         {isPersonalInfoOpen && (
//                             <div className="px-5 pb-6">
//                                 <div className="space-y-4">
//                                     <InfoField label="Full Name" value="John Lee" />
//                                     <InfoField label="Email" value="user@example.com" />

//                                     {/* Phone Input */}
//                                     <div className="bg-[#F9FAFB] border border-gray-200 p-3 rounded-lg w-full sm:max-w-md">
//                                         <label className="text-xs text-gray-500 block">Contact number</label>

//                                         <PhoneInput
//                                             international
//                                             defaultCountry="US"
//                                             value={phoneNumber}
//                                             onChange={handlePhoneChange}
//                                             className="phone-input"
//                                         />
//                                     </div>

//                                     <InfoField label="CallScout Number ID" value="8162737465" />

//                                     <button className="flex-shrink-0 bg-gray-100 border border-gray-300 text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
//                                         Change Password
//                                     </button>
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Notifications */}
//                     <div className="bg-white border border-gray-200 rounded-xl">
//                         <button
//                             className="flex items-center justify-between w-full p-5 text-left"
//                             onClick={() => setNotificationsOpen(!isNotificationsOpen)}
//                         >
//                             <h2 className="text-lg font-bold text-gray-900">Notification Preferences</h2>
//                             <FiChevronUp
//                                 className={`text-gray-500 transform transition-transform duration-300 ${isNotificationsOpen ? 'rotate-0' : 'rotate-180'}`}
//                                 size={20}
//                             />
//                         </button>

//                         {isNotificationsOpen && (
//                             <div className="px-5 pb-6">
//                                 <div className="space-y-6">
                                    
//                                     {/* Channels */}
//                                     <div className="space-y-3">
//                                         <h3 className="font-semibold text-gray-800">Channels:</h3>
//                                         <CheckboxOption id="channel-email" label="Email" defaultChecked />
//                                         <CheckboxOption id="channel-inapp" label="In-App" defaultChecked />
//                                         <CheckboxOption id="channel-sms" label="SMS" defaultChecked />
//                                     </div>

//                                     {/* Reminders */}
//                                     <div className="space-y-3">
//                                         <h3 className="font-semibold text-gray-800">Reminders:</h3>
//                                         <RadioOption id="rem-none" name="reminders" label="None" defaultChecked />
//                                         <RadioOption id="rem-5min" name="reminders" label="5 min" />
//                                         <RadioOption id="rem-10min" name="reminders" label="10 min" />
//                                         <RadioOption id="rem-15min" name="reminders" label="15 min" />
//                                         <RadioOption id="rem-30min" name="reminders" label="30 min" />
//                                     </div>

//                                     {/* Campaign Events */}
//                                     <div className="space-y-3">
//                                         <h3 className="font-semibold text-gray-800">Notification for Campaign Events:</h3>
//                                         <CheckboxOption id="event-incoming" label="Incoming follow-up calls" defaultChecked />
//                                         <CheckboxOption id="event-scheduled" label="Scheduled meetings from campaigns" defaultChecked />
//                                     </div>

//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </main>
//             </div>

//             {/* FIXED: normal <style> tag (NOT Next.js syntax!) */}
//             <style>
//                 {`
//                     .phone-input .PhoneInputInput {
//                         border: none;
//                         background-color: transparent;
//                         font-weight: 500;
//                         color: #111827;
//                         outline: none;
//                     }
//                     .phone-input .PhoneInputCountry {
//                         margin-right: 8px;
//                     }
//                 `}
//             </style>

//         </section>
//     );
// };

// export default AdminAccountSetting;



import { useState } from 'react';
import { FiChevronUp } from 'react-icons/fi';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

// === TYPES ===
interface InfoFieldProps {
    label: string;
    value: string;
}

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
const InfoField = ({ label, value }: InfoFieldProps) => (
    <div className="bg-[#F9FAFB] flex flex-col gap-1 px-2 py-1.5 rounded-lg w-full sm:max-w-md">
        <label className="text-xs text-gray-500 block">{label}</label>
        <input
            type="text"
            value={value}
            readOnly
            className="w-full text-sm bg-transparent text-gray-900 font-medium focus:outline-none"
        />
    </div>
);

// === CHECKBOX ===
const CheckboxOption = ({ id, label, defaultChecked = false }: CheckboxOptionProps) => (
    <div className="flex items-center gap-3">
        <input
            type="checkbox"
            id={id}
            defaultChecked={defaultChecked}
            className="h-4 w-4 rounded accent-black border-gray-400 text-black focus:ring-0 cursor-pointer"
        />
        <label htmlFor={id} className="text-sm text-gray-800 cursor-pointer">{label}</label>
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
        <section className="w-full pr-3 lg:pr-6 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <header className="flex items-baseline gap-4 mb-6">
                    <h1 className="text-gray-900 text-xl md:text-3xl font-bold">Account Settings</h1>
                    <p className="text-sm font-normal text-gray-500">Changes saved 18:09</p>
                </header>

                <main className="space-y-6">

                    {/* Personal Info */}
                    <div className="bg-white border border-gray-200 rounded-xl">
                        <button
                            className="flex items-center justify-between w-full p-5 text-left"
                            onClick={() => setPersonalInfoOpen(!isPersonalInfoOpen)}
                        >
                            <h2 className="text-lg font-bold text-gray-900">Personal Info</h2>
                            <FiChevronUp
                                className={`text-gray-500 transform transition-transform duration-300 ${isPersonalInfoOpen ? 'rotate-0' : 'rotate-180'}`}
                                size={20}
                            />
                        </button>

                        {isPersonalInfoOpen && (
                            <div className="px-5 pb-6 space-y-4">
                                <InfoField label="Full Name" value="John Lee" />
                                <InfoField label="Email" value="user@example.com" />

                                {/* Phone Input */}
                                <div className="bg-[#F9FAFB] border border-gray-200 p-3 rounded-lg w-full sm:max-w-md">
                                    <label className="text-xs text-gray-500 block">Contact number</label>
                                    <PhoneInput
                                        international
                                        defaultCountry="US"
                                        value={phoneNumber}
                                        onChange={handlePhoneChange}
                                        className="phone-input"
                                    />
                                </div>

                                <InfoField label="CallScout Number ID" value="8162737465" />

                                <button className="flex-shrink-0 bg-gray-100 border border-gray-300 text-gray-800 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                                    Change Password
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    <div className="bg-white border border-gray-200 rounded-xl">
                        <button
                            className="flex items-center justify-between w-full p-5 text-left"
                            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                        >
                            <h2 className="text-lg font-bold text-gray-900">Notification Preferences</h2>
                            <FiChevronUp
                                className={`text-gray-500 transform transition-transform duration-300 ${isNotificationsOpen ? 'rotate-0' : 'rotate-180'}`}
                                size={20}
                            />
                        </button>

                        {isNotificationsOpen && (
                            <div className="px-5 pb-6 space-y-6">
                                {/* Channels */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-800">Channels:</h3>
                                    <CheckboxOption id="channel-email" label="Email" defaultChecked />
                                    <CheckboxOption id="channel-inapp" label="In-App" defaultChecked />
                                    <CheckboxOption id="channel-sms" label="SMS" defaultChecked />
                                </div>

                                {/* Reminders */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-800">Reminders:</h3>
                                    <RadioOption id="rem-none" name="reminders" label="None" defaultChecked />
                                    <RadioOption id="rem-5min" name="reminders" label="5 min" />
                                    <RadioOption id="rem-10min" name="reminders" label="10 min" />
                                    <RadioOption id="rem-15min" name="reminders" label="15 min" />
                                    <RadioOption id="rem-30min" name="reminders" label="30 min" />
                                </div>

                                {/* Campaign Events */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-800">Notification for Campaign Events:</h3>
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
