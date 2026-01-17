// import { TbPointFilled } from "react-icons/tb";
// import callsentimenticon from "../../../assets/callsentimenticon.png"

// const ContactInfoCallSentiment = () => {
//   return (
//     <div className="bg-white flex flex-col gap-2 shadow-2xl  px-3 py-4 rounded-md">
//         <div className="flex   justify-between items-center">
//             <div className='flex w-full items-center gap-2'>
//                 <img src={callsentimenticon} alt="callsentimenticon" className="w-4  object-contain" />
//                 <h1 className='text-gray-700 text-[15px] font-medium'>Call Sentiment</h1>
//             </div>
//             <div className="flex items-center gap-2">
//                 <span className="text-green-500"><TbPointFilled/></span>
//                 <span className="text-green-500">Positive</span>
//             </div>
//             <div>

//             </div>
//         </div>
//         <div className="bg-gray-200 flex flex-col gap-1 px-3 py-3 rounded-md">
//             <h1 className="text-sm font-medium">AI Sidekick:</h1>
//             <p className="text-sm text-gray-600 font-medium">Customer sounds open and cooperative.</p>
//         </div>
//     </div>
//   )
// }

// export default ContactInfoCallSentiment





import React from 'react';
import { Bot, Sparkles, Circle } from 'lucide-react';

const CallSentiment = () => {
  const suggestions = [
    {
      id: "1.",
      text: "Ask about their current pain points with customer engagement."
    },
    {
      id: "2.",
      text: "Mention our 30-day free trial offer"
    },
    {
      id: "3.",
      text: "Reference case study: similar company saw 45% improvements"
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 w-full font-inter flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 shrink-0">
        <div className="flex items-center gap-2 text-[#4b5563]">
          <div className="relative">
             <Bot size={20} strokeWidth={1.5} />
             {/* Tiny sparkles icon to match the 'AI' look in the design */}
             <Sparkles size={8} className="absolute -top-1 -right-1 text-gray-400" />
          </div>
          <h3 className="text-[15px] font-medium text-gray-600">Call Sentiment</h3>
        </div>
        
        {/* Status */}
        <div className="flex items-center gap-1.5">
          <Circle size={8} fill="#10B981" className="text-[#10B981]" />
          <span className="text-[#10B981] text-[14px] font-semibold">Positive</span>
        </div>
      </div>

      {/* Content Area - Scrollable for small screens */}
      <div className="space-y-3 overflow-y-auto pr-1">
        
        {/* AI Sidekick Box */}
        <div className="bg-[#f4f6fa] rounded-xl p-4">
          <p className="text-[13px] font-bold text-[#1a1a1a] mb-1">AI Sidekick:</p>
          <p className="text-[14px] text-[#374151] leading-relaxed">
            Customer sounds open and cooperative.
          </p>
        </div>

        {/* Suggestion Boxes */}
        {suggestions.map((item) => (
          <div 
            key={item.id} 
            className="bg-[#f4f6fa] rounded-xl p-4 flex gap-3 items-start transition-colors hover:bg-[#ebedf3]"
          >
            <span className="text-[13px] font-bold text-[#1a1a1a] shrink-0 mt-0.5">
              {item.id}
            </span>
            <p className="text-[14px] text-[#374151] leading-relaxed">
              {item.text}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
};

export default CallSentiment;