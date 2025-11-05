// // components/modal/phonemodal.js
// import React from 'react';
// import { IoClose } from 'react-icons/io5';

// const PhoneModal = ({ isOpen, onClose }) => {
//   // Yahan isOpen prop check kar rahe hain
//   if (!isOpen) return null;

//   return (
//     <div 
//       className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
//       onClick={onClose} // Bahar click karne par modal band hoga
//     >
//       <div 
//         className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-gray-800">Add New Phone</h2>
//           <button 
//             onClick={onClose} // Close button click karne par modal band hoga
//             className="text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
//           >
//             <IoClose size={20} />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="space-y-5">
//           {/* Phone Number */}
//           <div className="bg-gray-100/70 p-3 rounded-lg w-full">
//             <label htmlFor="phoneNumber" className="text-xs text-gray-500 block">
//               Phone number
//             </label>
//             <input
//               type="tel"
//               id="phoneNumber"
//               placeholder="Enter phone number"
//               className="w-full bg-transparent text-gray-900 text-xs placeholder:text-xs focus:outline-none placeholder:text-gray-400"
//             />
//           </div>

//           {/* Phone Type */}
//           <div className="bg-gray-100/70 p-3 rounded-lg w-full">
//             <label htmlFor="phoneType" className="text-xs text-gray-500 block">
//               Phone type
//             </label>
//             <select
//               id="phoneType"
//               className="w-full bg-transparent text-gray-900 text-xs placeholder:text-xs focus:outline-none  cursor-pointer"
//             >
//               <option>Mobile</option>
//               <option>Work</option>
//               <option>Home</option>
//             </select>
//           </div>

//           {/* Primary Checkbox */}
//           <div className="flex items-center gap-3 pt-2">
//             <input
//               type="checkbox"
//               id="isPrimary"
//               className="h-5 w-5 rounded border-gray-400 text-black focus:ring-black cursor-pointer accent-black"
//             />
//             <label htmlFor="isPrimary" className="text-sm font-medium text-gray-700 cursor-pointer">
//               Primary
//             </label>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex justify-center items-center gap-3 pt-6 mt-6 border-t border-gray-200">
//           <button
//             onClick={onClose} // Cancel button click karne par modal band hoga
//             className="bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg"
//           >
//             Cancel
//           </button>
//           <button className="bg-[#FFCA06] w-full hover:bg-yellow-500 text-gray-950 font-semibold py-2.5 px-6 rounded-lg">
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PhoneModal;

import { IoClose } from 'react-icons/io5';

// Props interface
interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhoneModal: React.FC<PhoneModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
      onClick={onClose} // Close modal on outside click
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Add New Phone</h2>
          <button
            onClick={onClose}
            className="text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Phone Number */}
          <div className="bg-gray-100/70 p-3 rounded-lg w-full">
            <label htmlFor="phoneNumber" className="text-xs text-gray-500 block">
              Phone number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="Enter phone number"
              className="w-full bg-transparent text-gray-900 text-xs placeholder:text-xs focus:outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Phone Type */}
          <div className="bg-gray-100/70 p-3 rounded-lg w-full">
            <label htmlFor="phoneType" className="text-xs text-gray-500 block">
              Phone type
            </label>
            <select
              id="phoneType"
              className="w-full bg-transparent text-gray-900 text-xs placeholder:text-xs focus:outline-none cursor-pointer"
            >
              <option>Mobile</option>
              <option>Work</option>
              <option>Home</option>
            </select>
          </div>

          {/* Primary Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isPrimary"
              className="h-5 w-5 rounded border-gray-400 text-black focus:ring-black cursor-pointer accent-black"
            />
            <label htmlFor="isPrimary" className="text-sm font-medium text-gray-700 cursor-pointer">
              Primary
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center gap-3 pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg"
          >
            Cancel
          </button>
          <button className="bg-[#FFCA06] w-full hover:bg-yellow-500 text-gray-950 font-semibold py-2.5 px-6 rounded-lg">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneModal;
