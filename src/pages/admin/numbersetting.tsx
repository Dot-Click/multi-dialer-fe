// import React, { useState } from 'react';
// import { IoIosArrowDown } from "react-icons/io";

// // Reusable Input Field Component
// const InputField = ({ label, type = 'text', placeholder, value }) => (
//   <div className='bg-gray-100 rounded-md  px-3 py-2'>
//     <label className="block text-xs font-medium text-gray-950 mb-1">{label}</label>
//     <input
//       type={type}
//       placeholder={placeholder}
//       defaultValue={value}
//       className="w-full  text-sm text-gray-900 focus:outline-none "
//     />
//   </div>
// );

// // Reusable Select Field Component
// const SelectField = ({ label, children }) => (
//   <div className="relative bg-gray-100 rounded-md  px-3 py-2">
//     <label className="block text-xs font-medium text-gray-950 mb-1">{label}</label>
//     <select className="w-full text-sm text-gray-900 appearance-none focus:outline-none ">
//       {children}
//     </select>
//     <IoIosArrowDown className="absolute right-4 top-9 text-gray-500 pointer-events-none" />
//   </div>
// );

// // Reusable Checkbox Component
// const CheckboxField = ({ label }) => (
//   <div className="flex items-center gap-3">
//     <input type="checkbox" className="h-4 w-4 rounded accent-black text-blue-500 border-gray-300 focus:ring-blue-400" />
//     <label className="text-sm text-gray-700">{label}</label>
//   </div>
// );

// // Reusable Radio Group Component
// const RadioGroup = ({ title, name, options, selected, onChange }) => (
//   <div>
//     <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
//     <div className="flex flex-col gap-2">
//       {options.map(option => (
//         <div key={option} className="flex items-center gap-3">
//           <input
//             type="radio"
//             id={`${name}-${option}`}
//             name={name}
//             value={option}
//             checked={selected === option}
//             onChange={(e) => onChange(e.target.value)}
//             className="h-4 w-4 accent-black text-blue-500 border-gray-300 focus:ring-blue-400"
//           />
//           <label htmlFor={`${name}-${option}`} className="text-sm text-gray-700">{option}</label>
//         </div>
//       ))}
//     </div>
//   </div>
// );


// const NumberSetting = () => {
//     // State to manage radio button selections
//     const [dncCalls, setDncCalls] = useState('No');
//     const [sendEmail, setSendEmail] = useState('No');
//     const [sendText, setSendText] = useState('No');

//   return (
//     <div className=" min-h-screen px-6">
//       <div className="max-w-7xl mx-auto">
        
//         {/* --- Header --- */}
//         <div className="flex justify-between items-center mb-3">
//           <h1 className="text-2xl font-semibold text-gray-900">Number Settings</h1>
//           <div className="flex items-center gap-3">
//             <button className="px-5 py-2 text-sm font-medium w-28 text-gray-950 bg-gray-200 rounded-md hover:bg-gray-300">
//               Cancel
//             </button>
//             <button className="px-5 py-2 text-sm font-medium w-28 text-gray-950 bg-[#FFCA06] rounded-md hover:bg-[#f7c309]">
//               Save
//             </button>
//           </div>
//         </div>

//         {/* --- Form Card --- */}
//         <div className="bg-white px-4 py-5 rounded-lg shadow-lg space-y-8">
          
//           {/* Section 1: Label and Availability */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <InputField label="Label" placeholder="Enter label" />
//             <SelectField label="Available to">
//               <option>All</option>
//               <option>Team Only</option>
//             </SelectField>
//           </div>

//           {/* Section 2: Voice Recordings Details */}
//           <div>
//             <h2 className="text-lg font-semibold text-gray-800 mb-4">Voice recordings Details</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <SelectField label="On-hold Recording 1"><option>Select</option></SelectField>
//               <SelectField label="On-hold Recording 2"><option>Select</option></SelectField>
//               <SelectField label="On-hold Recording 3"><option>Select</option></SelectField>
//               <SelectField label="Answering Machine Recordings"><option>Select</option></SelectField>
//             </div>
//           </div>

//           {/* Section 3: General Communication & DNC */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">General Communication</h2>
//               <div className="space-y-4">
//                 <CheckboxField label="Enable Auto Pause" />
//                 <CheckboxField label="Enable Recording" />
//                 <CheckboxField label="Send scheduled appointment mail in outlook format" />
//               </div>
//             </div>
//             <div>
//               <RadioGroup
//                 title="Make Calls to DNC Numbers"
//                 name="dnc"
//                 options={['No', 'Yes']}
//                 selected={dncCalls}
//                 onChange={setDncCalls}
//               />
//             </div>
//           </div>

//           {/* Section 4: Caller ID & Call Settings */}
//           <div className="space-y-6">
//              <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
//                 <div className="sm:col-span-3">
//                     <InputField label="Caller ID" value="CallScout ID" />
//                 </div>
//                 <div className="sm:col-span-2">
//                     <SelectField label="Country Code"><option>Select</option></SelectField>
//                 </div>
//              </div>
//              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                 <SelectField label="No of Lines"><option>Select</option></SelectField>
//                 <SelectField label="Phone Ring Time"><option>Select</option></SelectField>
//                 <SelectField label="Call Script"><option>Select</option></SelectField>
//              </div>
//           </div>

//           {/* Section 5: Send Email & Text */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
//             <RadioGroup
//                 title="Send Email"
//                 name="email"
//                 options={['No', 'Yes']}
//                 selected={sendEmail}
//                 onChange={setSendEmail}
//             />
//             <RadioGroup
//                 title="Send Text"
//                 name="text"
//                 options={['No', 'Yes']}
//                 selected={sendText}
//                 onChange={setSendText}
//             />
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default NumberSetting;

import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

// ----------------------
// Reusable Input Field
// ----------------------
interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
}
const InputField = ({
  label,
  type = "text",
  placeholder = "",
  value = "",
}: InputFieldProps) => (
  <div className="bg-gray-100 rounded-md px-3 py-2">
    <label className="block text-xs font-medium text-gray-950 mb-1">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={value}
      className="w-full text-sm text-gray-900 focus:outline-none bg-transparent"
    />
  </div>
);

// ----------------------
// Reusable Select Field
// ----------------------
interface SelectFieldProps {
  label: string;
  children: React.ReactNode;
}
const SelectField = ({ label, children }: SelectFieldProps) => (
  <div className="relative bg-gray-100 rounded-md px-3 py-2">
    <label className="block text-xs font-medium text-gray-950 mb-1">
      {label}
    </label>
    <select className="w-full text-sm text-gray-900 appearance-none focus:outline-none bg-transparent">
      {children}
    </select>
    <IoIosArrowDown className="absolute right-4 top-9 text-gray-500 pointer-events-none" />
  </div>
);

// ----------------------
// Reusable Checkbox
// ----------------------
interface CheckboxFieldProps {
  label: string;
}
const CheckboxField = ({ label }: CheckboxFieldProps) => (
  <div className="flex items-center gap-3">
    <input
      type="checkbox"
      className="h-4 w-4 rounded accent-black text-blue-500 border-gray-300 focus:ring-blue-400"
    />
    <label className="text-sm text-gray-700">{label}</label>
  </div>
);

// ----------------------
// Reusable Radio Group
// ----------------------
interface RadioGroupProps {
  title: string;
  name: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}
const RadioGroup = ({
  title,
  name,
  options,
  selected,
  onChange,
}: RadioGroupProps) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="flex flex-col gap-2">
      {options.map((option: string) => (
        <div key={option} className="flex items-center gap-3">
          <input
            type="radio"
            id={`${name}-${option}`}
            name={name}
            value={option}
            checked={selected === option}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 accent-black text-blue-500 border-gray-300 focus:ring-blue-400"
          />
          <label
            htmlFor={`${name}-${option}`}
            className="text-sm text-gray-700"
          >
            {option}
          </label>
        </div>
      ))}
    </div>
  </div>
);

// ----------------------
// Main Page Component
// ----------------------
const NumberSetting = () => {
  const [dncCalls, setDncCalls] = useState("No");
  const [sendEmail, setSendEmail] = useState("No");
  const [sendText, setSendText] = useState("No");

  return (
    <div className="min-h-screen px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-semibold text-gray-900">
            Number Settings
          </h1>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 text-sm font-medium w-28 text-gray-950 bg-gray-200 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button className="px-5 py-2 text-sm font-medium w-28 text-gray-950 bg-[#FFCA06] rounded-md hover:bg-[#f7c309]">
              Save
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white px-4 py-5 rounded-lg shadow-lg space-y-8">
          {/* Label and Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Label" placeholder="Enter label" />
            <SelectField label="Available to">
              <option>All</option>
              <option>Team Only</option>
            </SelectField>
          </div>

          {/* Voice Recording Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Voice recordings Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField label="On-hold Recording 1">
                <option>Select</option>
              </SelectField>
              <SelectField label="On-hold Recording 2">
                <option>Select</option>
              </SelectField>
              <SelectField label="On-hold Recording 3">
                <option>Select</option>
              </SelectField>
              <SelectField label="Answering Machine Recordings">
                <option>Select</option>
              </SelectField>
            </div>
          </div>

          {/* General Communication & DNC */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                General Communication
              </h2>
              <div className="space-y-4">
                <CheckboxField label="Enable Auto Pause" />
                <CheckboxField label="Enable Recording" />
                <CheckboxField label="Send scheduled appointment mail in outlook format" />
              </div>
            </div>
            <RadioGroup
              title="Make Calls to DNC Numbers"
              name="dnc"
              options={["No", "Yes"]}
              selected={dncCalls}
              onChange={setDncCalls}
            />
          </div>

          {/* Caller ID & Call Settings */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
              <div className="sm:col-span-3">
                <InputField
                  label="Caller ID"
                  placeholder="Enter ID"
                  value="CallScout ID"
                />
              </div>
              <div className="sm:col-span-2">
                <SelectField label="Country Code">
                  <option>Select</option>
                </SelectField>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <SelectField label="No of Lines">
                <option>Select</option>
              </SelectField>
              <SelectField label="Phone Ring Time">
                <option>Select</option>
              </SelectField>
              <SelectField label="Call Script">
                <option>Select</option>
              </SelectField>
            </div>
          </div>

          {/* Send Email & Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
            <RadioGroup
              title="Send Email"
              name="email"
              options={["No", "Yes"]}
              selected={sendEmail}
              onChange={setSendEmail}
            />
            <RadioGroup
              title="Send Text"
              name="text"
              options={["No", "Yes"]}
              selected={sendText}
              onChange={setSendText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberSetting;
