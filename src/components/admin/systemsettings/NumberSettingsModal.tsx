// import React, { useState } from 'react';
// import { FiX, FiChevronDown } from 'react-icons/fi';

// interface NumberSettingsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const NumberSettingsModal: React.FC<NumberSettingsModalProps> = ({ isOpen, onClose }) => {
//   const [dialerType, setDialerType] = useState('predictive');
//   const [aiPacing, setAiPacing] = useState(true);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
//       {/* Modal Container */}
//       <div className="bg-white w-full max-w-[480px] max-h-[95vh] rounded-[24px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
//         {/* Header */}
//         <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50">
//           <h2 className="text-[18px] font-bold text-[#1F2937]">Number Settings</h2>
//           <button
//             onClick={onClose}
//             className="p-1.5 bg-[#F3F4F6] hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
//           >
//             <FiX size={18} />
//           </button>
//         </div>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          
//           {/* Top Selectors Section */}
//           <div className="space-y-3">
//             {[
//               { label: 'Caller ID', placeholder: 'Select a number' },
//               { label: 'Number of Lines', placeholder: '1' },
//               { label: 'On-Hold Recording', placeholder: 'Select a recording' },
//             ].map((field, idx) => (
//               <div key={idx} className="relative">
//                 <div className="bg-[#F3F4F8] rounded-xl px-4 py-2.5">
//                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-tight">
//                     {field.label}
//                   </label>
//                   <div className="flex justify-between items-center mt-0.5">
//                     <span className="text-[13px] text-gray-400">{field.placeholder}</span>
//                     <FiChevronDown className="text-gray-400" />
//                   </div>
//                 </div>
//                 {field.label === 'On-Hold Recording' && (
//                   <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
//                     This on-hold recording applies to all outbound numbers.
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Dialer Settings Section */}
//           <div className="space-y-3">
//             <h3 className="text-[13px] font-bold text-gray-800 ml-1">Dialer Settings</h3>
            
//             {/* Dialer Options */}
//             {[
//               { 
//                 id: 'predictive', 
//                 title: 'Predictive Dialing', 
//                 desc: 'AI-driven call pacing\nAutomatically adjusts based on agent availability\nIdeal for high-volume campaigns' 
//               },
//               { 
//                 id: 'power', 
//                 title: 'Power Dialing', 
//                 desc: 'Dials one number at a time\nAutomatically dials the next contact when the\ncall ends\nIdeal for solo agents or small teams' 
//               },
//               { 
//                 id: 'preview', 
//                 title: 'Preview Dialing', 
//                 desc: 'Agent views contact details before dialing\nAgent manually initiates each call' 
//               }
//             ].map((option) => (
//               <div 
//                 key={option.id}
//                 onClick={() => setDialerType(option.id)}
//                 className={`p-4 rounded-xl flex gap-3 cursor-pointer border transition-all ${
//                   dialerType === option.id ? 'bg-[#F3F4F8] border-transparent' : 'bg-[#F3F4F8] border-transparent opacity-80'
//                 }`}
//               >
//                 <div className="mt-1">
//                   <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
//                     dialerType === option.id ? 'border-gray-800' : 'border-gray-300'
//                   }`}>
//                     {dialerType === option.id && <div className="w-2 h-2 rounded-full bg-gray-800" />}
//                   </div>
//                 </div>
//                 <div>
//                   <h4 className="text-[13px] font-bold text-gray-800 leading-none">{option.title}</h4>
//                   <p className="text-[11px] text-gray-500 mt-1.5 whitespace-pre-line leading-relaxed">
//                     {option.desc}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* AI Pacing Checkbox */}
//           <div className="flex gap-3 px-1">
//             <input 
//               type="checkbox" 
//               checked={aiPacing} 
//               onChange={() => setAiPacing(!aiPacing)}
//               className="mt-1 w-4 h-4 rounded border-gray-300 text-gray-800 focus:ring-0" 
//             />
//             <div>
//               <h4 className="text-[13px] font-bold text-gray-800">Enable AI Call Pacing</h4>
//               <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
//                 AI adjusts outbound calling lines based on pickup rate.<br/>
//                 High answer rate uses 2-5 lines.<br/>
//                 Low answer rate increases up to 10 lines.
//               </p>
//             </div>
//           </div>

//           {/* Blue Info Box */}
//           <div className="bg-[#EEF2FF] border border-[#E0E7FF] p-3 rounded-lg">
//             <p className="text-[11px] font-bold text-[#4F46E5] leading-snug">
//               Each dial will automatically send an email and text using the selected templates.
//             </p>
//           </div>

//           {/* Templates Section */}
//           <div className="space-y-3 pb-2">
//             {[
//               { label: 'Email Template', placeholder: 'Select an email template' },
//               { label: 'SMS Template', placeholder: 'Select a SMS template' },
//             ].map((field, idx) => (
//               <div key={idx} className="bg-[#F3F4F8] rounded-xl px-4 py-2.5">
//                 <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-tight">
//                   {field.label}
//                 </label>
//                 <div className="flex justify-between items-center mt-0.5">
//                   <span className="text-[13px] text-gray-400">{field.placeholder}</span>
//                   <FiChevronDown className="text-gray-400" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Footer Actions */}
//         <div className="p-6 border-t border-gray-50 flex gap-4">
//           <button
//             onClick={onClose}
//             className="flex-1 bg-[#E5E7EB] hover:bg-gray-300 text-gray-800 text-[14px] font-bold py-3.5 rounded-xl transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             className="flex-1 bg-[#FFE200] hover:bg-[#F0D500] text-gray-900 text-[14px] font-bold py-3.5 rounded-xl transition-colors shadow-sm"
//           >
//             Start Dialing
//           </button>
//         </div>
//       </div>

//       <style>{`
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: transparent;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #E5E7EB;
//           border-radius: 10px;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NumberSettingsModal;


import React, { useState } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';

interface NumberSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NumberSettingsModal: React.FC<NumberSettingsModalProps> = ({ isOpen, onClose }) => {
  const [dialerType, setDialerType] = useState('predictive');
  const [aiPacing, setAiPacing] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4">
      <div className="bg-white w-full max-w-[480px] max-h-[92vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-5 flex justify-between items-center border-b border-gray-50">
          <h2 className="text-[18px] font-bold text-gray-800">Number Settings</h2>
          <button onClick={onClose} className="p-1.5 bg-gray-100 rounded-lg text-gray-400"><FiX size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          <div className="space-y-3">
            {['Caller ID', 'Number of Lines', 'On-Hold Recording'].map((label, idx) => (
              <div key={idx} className="bg-[#F3F4F8] rounded-xl px-4 py-2.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
                <div className="flex justify-between items-center mt-0.5"><span className="text-[13px] text-gray-400">Select...</span><FiChevronDown className="text-gray-400" /></div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-[13px] font-bold text-gray-800">Dialer Settings</h3>
            {[
              { id: 'predictive', title: 'Predictive Dialing', desc: 'AI-driven call pacing\nAutomatically adjusts based on availability' },
              { id: 'power', title: 'Power Dialing', desc: 'Dials one number at a time\nAutomatically dials next contact' },
                { id: 'preview', title: 'Preview Dialing', desc: 'Agent views contact details before dialingAgent manually initiates each call' },
            ].map((option) => (
              <div key={option.id} onClick={() => setDialerType(option.id)} className="p-4 rounded-xl flex gap-3 bg-[#F3F4F8] cursor-pointer">
                <div className={`w-4 h-4 mt-1 rounded-full border-2 flex items-center justify-center ${dialerType === option.id ? 'border-gray-800' : 'border-gray-300'}`}>
                  {dialerType === option.id && <div className="w-2 h-2 rounded-full bg-gray-800" />}
                </div>
                <div><h4 className="text-[13px] font-bold">{option.title}</h4><p className="text-[11px] text-gray-500 mt-1 whitespace-pre-line leading-relaxed">{option.desc}</p></div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 px-1">
            <input type="checkbox" checked={aiPacing} onChange={() => setAiPacing(!aiPacing)} className="mt-1 w-4 h-4 rounded border-gray-300 text-gray-800" />
            <div><h4 className="text-[13px] font-bold">Enable AI Call Pacing</h4><p className="text-[11px] text-gray-500 mt-1 leading-relaxed">AI adjusts outbound calling lines based on pickup rate.</p></div>
          </div>

          <div className="bg-[#EEF2FF] border border-[#E0E7FF] p-3 rounded-lg text-[11px] font-bold text-[#4F46E5]">
            Each dial will automatically send an email and text using the selected templates.
          </div>
        </div>

        <div className="p-6 border-t border-gray-50 flex gap-4">
          <button onClick={onClose} className="flex-1 bg-[#E5E7EB] text-gray-800 text-[14px] font-bold py-3.5 rounded-xl">Cancel</button>
          <button className="flex-1 bg-[#FECD56] text-gray-900 text-[14px] font-bold py-3.5 rounded-xl shadow-sm">Start Dialing</button>
        </div>
      </div>
    </div>
  );
};

export default NumberSettingsModal;

