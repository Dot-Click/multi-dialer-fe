// import { useState } from "react";
// import mapicon from "../../../assets/mapicon.png";
// import streeticon from "../../../assets/streeticon.png";
// import groupicon from "../../../assets/groupicon.png";
// import InnerContactInfo from "@/components/agent/contactinfo/innercontactinfo";
// import NotesContactInfo from "@/components/agent/contactinfo/notescontactinfo";
// import HistoryContactInfo from "@/components/agent/contactinfo/historycontactinfo";
// import SendTextContactInfo from "@/components/agent/contactinfo/sendtextcontactinfo";
// import SendEmailContactInfo from "@/components/agent/contactinfo/sendemailcontactinfo";

// const ContactInfoBottom = () => {
//     const [openDialogue, setOpenDialogue] = useState("Contact Info");

//     const groupOptions = ["Contact Info", "Notes", "History", "Send Text", "Send Email"];

//     return (
//         <div className="bg-white rounded-2xl shadow-md p-6 w-full">
//             <div className="space-y-6 ">

//                 {/* Group Section */}
//                 <div className="flex flex-col sm:flex-row justify-between w-full sm:items-center gap-2 sm:gap-6">

//                     {/* Button Group */}
//                     <div className="flex w-full overflow-auto md:w-[80%]  rounded-lg text-[12px] md:text-[15px] font-medium bg-gray-200 justify-between gap-4">
//                         {groupOptions.map((option) => (
//                             <button
//                                 key={option}
//                                 onClick={() => setOpenDialogue(option)}
//                                 className={`
//                  rounded-md px-4 py-2.5 w-fit whitespace-nowrap transition-colors duration-200
//                   ${openDialogue === option ? "bg-[#FFCA06] font-semibold" : "bg-transparent"}
//                 `}
//                             >
//                                 {option}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Icons */}
//                     <div className=" w-full md:w-[20%] md:justify-between flex gap-4 items-center">
//                         <img src={mapicon} alt="map icon" className="w-10 border px-2 py-1 rounded-md object-contain" />
//                         <img src={streeticon} alt="street icon" className="w-12 border px-2 py-1 rounded-md object-contain" />
//                         <img src={groupicon} alt="group icon" className="w-12 border px-2 py-1 rounded-md object-contain" />
//                     </div>
//                 </div>

//                 {/* ✅ Dialogue Component Below */}
//                 <div className=" mt-2">
//                     {openDialogue === "Contact Info" && <div><InnerContactInfo /></div>}
//                     {openDialogue === "Notes" && <div><NotesContactInfo /></div>}
//                     {openDialogue === "History" && <div><HistoryContactInfo /></div>}
//                     {openDialogue === "Send Text" && <div><SendTextContactInfo /></div>}
//                     {openDialogue === "Send Email" && <div><SendEmailContactInfo/></div>}
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default ContactInfoBottom;





import { FileText, Circle } from 'lucide-react';

const ContactInfoBottom = () => {
  // Increased mock data to ensure it overflows and demonstrates scrolling
  const transcriptData = [
    { time: "10:32:15", speaker: "Agent", color: "text-blue-600", text: "Hello, this is calling from ABC Company. Am I speaking with John Smith?" },
    { time: "10:32:22", speaker: "Contact", color: "text-green-500", text: "Yes, this is John. How can I help you?" },
    { time: "10:32:28", speaker: "Agent", color: "text-blue-600", text: "Thanks for taking my call, John. I wanted to discuss our new services that might benefit your business." },
    { time: "10:32:38", speaker: "Contact", color: "text-green-500", text: "I see. What kind of services are we talking about?" },
    { time: "10:32:45", speaker: "Agent", color: "text-blue-600", text: "We offer a variety of CRM integrations and automated workflow solutions." },
    { time: "10:32:55", speaker: "Contact", color: "text-green-500", text: "That sounds interesting. Can you send me some documentation on that?" },
    { time: "10:33:10", speaker: "Agent", color: "text-blue-600", text: "Absolutely, I will send that over to your email right now." },
  ];

  return (
    <>
      {/* Scrollbar Styling - Add this to your Global CSS or a Style tag */}
      <style>
        {`
          .transcript-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .transcript-scroll::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .transcript-scroll::-webkit-scrollbar-thumb {
            background: #bdc3c7;
            border-radius: 10px;
          }
          .transcript-scroll::-webkit-scrollbar-thumb:hover {
            background: #95a5a6;
          }
        `}
      </style>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 font-inter w-full flex flex-col overflow-hidden h-[450px]">
        
        {/* Fixed Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2 text-gray-500">
            <FileText size={18} strokeWidth={1.5} />
            <span className="text-sm font-medium">Live Call Transcript</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#FEE2E2] text-[#EF4444] px-3 py-1 rounded-full border border-red-100">
            <Circle size={8} fill="currentColor" className="animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider">Recording</span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="transcript-scroll flex-grow overflow-y-auto p-6 pr-4 space-y-6">
          {transcriptData.map((item, index) => (
            <div key={index} className="flex gap-6 items-start">
              {/* Timestamp */}
              <div className="text-gray-400 text-[12px] font-medium w-16 shrink-0 mt-1">
                {item.time}
              </div>
              
              {/* Message */}
              <div className="flex-1">
                <p className={`${item.color} font-bold text-sm mb-1`}>
                  {item.speaker}
                </p>
                <p className="text-[#2D3748] text-[14px] leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ContactInfoBottom;