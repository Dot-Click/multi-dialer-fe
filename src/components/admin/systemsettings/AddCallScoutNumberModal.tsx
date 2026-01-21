// import React, { useState } from 'react';
// import { FiPhone } from 'react-icons/fi';

// interface AddCallScoutNumberModalProps {
//     isOpen: boolean;
//     onClose: () => void;
// }

// const mockNumbers = [
//     { id: 1, number: '+1 (555) 111-2222', location: 'New York, NY' },
//     { id: 2, number: '+1 (555) 333-4444', location: 'Los Angeles, CA' },
//     { id: 3, number: '+1 (555) 555-6666', location: 'Chicago, IL' },
//     { id: 4, number: '+1 (555) 777-8888', location: 'Houston, TX' },
//     { id: 5, number: '+1 (555) 999-0000', location: 'Miami, FL' },
// ];

// const AddCallScoutNumberModal: React.FC<AddCallScoutNumberModalProps> = ({ isOpen, onClose }) => {
//     const [selectedId, setSelectedId] = useState<number>(4); // Defaulted to 4 to match your image selection

//     if (!isOpen) return null;

//     return (
//         // Backdrop: Centering the modal vertically and horizontally
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">

//             {/* Modal Container */}
//             <div className="bg-white w-full max-w-[520px] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

//                 <div className="p-10 space-y-8">

//                     {/* Header Controls (Labels and Inputs) */}
//                     <div className="grid grid-cols-3 gap-4">
//                         {[
//                             { label: 'AREA CODE', placeholder: 'eg., 555' },
//                             { label: 'CITY', placeholder: 'eg., New York' },
//                             { label: 'STATE', placeholder: 'eg., NY' }
//                         ].map((field, idx) => (
//                             <div key={idx} className="flex flex-col gap-2">
//                                 <label className="text-[10px] font-extrabold text-[#9CA3AF] tracking-wider ml-1">
//                                     {field.label}
//                                 </label>
//                                 <input
//                                     type="text"
//                                     placeholder={field.placeholder}
//                                     className="bg-[#F3F4F8] border-none rounded-[14px] py-3.5 px-4 text-[13px] font-medium focus:ring-2 focus:ring-yellow-400 outline-none transition-all placeholder:text-[#CBCDD6]"
//                                 />
//                             </div>
//                         ))}
//                     </div>

//                     {/* Numbers List Section */}
//                     <div className="bg-[#F9FAFB] rounded-[24px] p-5">
//                         <h3 className="text-[13px] font-extrabold text-[#4B5563] mb-4 ml-1">
//                             Available Numbers (5)
//                         </h3>

//                         {/* Scrollable Container */}
//                         <div className="h-[200px] xl:h-[200px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
//                             {mockNumbers.map((item) => (
//                                 <div
//                                     key={item.id}
//                                     onClick={() => setSelectedId(item.id)}
//                                     className={`flex items-center gap-4 p-4 rounded-[18px] cursor-pointer transition-all border-2 ${selectedId === item.id
//                                         ? 'bg-white border-[#FFE200] shadow-sm'
//                                         : 'bg-white border-transparent hover:border-gray-200'
//                                         }`}
//                                 >
//                                     <div className={`p-1 ${selectedId === item.id ? 'text-[#FACC15]' : 'text-[#9CA3AF]'}`}>
//                                         <FiPhone size={18} />
//                                     </div>
//                                     <div>
//                                         <p className="text-[15px] font-bold text-gray-900 leading-none">
//                                             {item.number}
//                                         </p>
//                                         <p className="text-[11px] font-bold text-[#9CA3AF] mt-1.5 uppercase tracking-tight">
//                                             {item.location}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Footer Actions */}
//                     <div className="flex gap-4">
//                         <button
//                             onClick={onClose}
//                             className="flex-1 bg-[#E5E7EB] hover:bg-gray-300 text-gray-900 text-[14px] font-extrabold py-4 rounded-[18px] transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             className="flex-[2] bg-[#FECD56] hover:bg-[#F0D500] text-gray-900 text-[14px] font-extrabold py-4 rounded-[18px] transition-colors shadow-sm"
//                         >
//                             Add Number to Account
//                         </button>
//                     </div>
//                 </div>
//             </div>

//             {/* Internal CSS for the custom thin gray scrollbar */}
//             <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 5px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #D1D5DB;
//           border-radius: 10px;
//         }
//       `}</style>
//         </div>
//     );
// };

// export default AddCallScoutNumberModal;

import React, { useState } from 'react';
import { FiPhone, FiX } from 'react-icons/fi';

interface AddCallScoutNumberModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const mockNumbers = [
    { id: 1, number: '+1 (555) 111-2222', location: 'New York, NY' },
    { id: 2, number: '+1 (555) 333-4444', location: 'Los Angeles, CA' },
    { id: 3, number: '+1 (555) 555-6666', location: 'Chicago, IL' },
    { id: 4, number: '+1 (555) 777-8888', location: 'Houston, TX' },
    { id: 5, number: '+1 (555) 999-0000', location: 'Miami, FL' },
];

const AddCallScoutNumberModal: React.FC<AddCallScoutNumberModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [selectedId, setSelectedId] = useState<number>(4);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
            <div className="bg-white w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header with X button */}
                <div className="px-8 pt-8 pb-2 flex justify-between items-center">
                    <h2 className="text-[20px] font-bold text-gray-900">Add CallScout Number</h2>
                    <button onClick={onClose} className="p-1.5 bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"><FiX size={20}/></button>
                </div>

                <div className="p-8 pt-4 space-y-6">
                    <div className="grid grid-cols-3 gap-3">
                        {['AREA CODE', 'CITY', 'STATE'].map((label, i) => (
                            <div key={i} className="space-y-1.5">
                                <label className="text-[10px] font-extrabold text-[#9CA3AF] tracking-wider ml-1">{label}</label>
                                <input type="text" placeholder="eg., ..." className="w-full bg-[#F3F4F8] rounded-xl py-3 px-3 text-[13px] outline-none focus:ring-1 focus:ring-yellow-400" />
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#F9FAFB] rounded-[24px] p-4">
                        <h3 className="text-[12px] font-extrabold text-gray-500 mb-3 ml-1 uppercase">Available Numbers (5)</h3>
                        <div className="max-h-[220px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                            {mockNumbers.map((item) => (
                                <div key={item.id} onClick={() => setSelectedId(item.id)} className={`flex items-center gap-4 p-4 rounded-[18px] cursor-pointer transition-all border-2 ${selectedId === item.id ? 'bg-white border-[#FFE200]' : 'bg-white border-transparent'}`}>
                                    <FiPhone size={18} className={selectedId === item.id ? 'text-yellow-400' : 'text-gray-400'} />
                                    <div>
                                        <p className="text-[14px] font-bold text-gray-900">{item.number}</p>
                                        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-tight">{item.location}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={onClose} className="flex-1 bg-[#E5E7EB] text-gray-900 text-[14px] font-extrabold py-4 rounded-[18px]">Cancel</button>
                        <button onClick={onSuccess} className="flex-[2] bg-[#FECD56] text-gray-900 text-[14px] font-extrabold py-4 rounded-[18px] shadow-sm">Add Number to Account</button>
                    </div>
                </div>
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }`}</style>
        </div>
    );
};

export default AddCallScoutNumberModal;