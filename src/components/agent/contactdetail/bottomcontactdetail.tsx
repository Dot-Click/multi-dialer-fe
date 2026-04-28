// import { useState } from "react"
// import Notes from "./notes"

// const BottomContactDetail = () => {

//     const [openStatus, setOpenStatus] = useState("Notes")

//     const stages = [
//         { id: 1, name: "Notes" },
//         { id: 2, name: "Misc" },
//         { id: 3, name: "Activities" },
//         { id: 4, name: "History" },
//         { id: 5, name: "Emails" },
//         { id: 6, name: "SMS" },
//         { id: 7, name: "Action Plans" },
//         { id: 8, name: "Lead Sheet" },
//         { id: 9, name: "Attachments" },
//         { id: 10, name: "AI Sidekick" },
//     ]



//     return (
//         <section className='bg-white flex flex-col gap-8 shadow-2xl  px-6 py-5 w-[96%] mx-auto rounded-[24px]'>

//             <div className='flex bg-[#F3F4F7] gap-4 rounded-lg  justify-between items-center'>
//                 {stages.map((stg) => (
//                     <button key={stg.id} onClick={() => setOpenStatus(stg.name)}
//                         className={`${openStatus == stg.name && "bg-[#FFCA06]"} px-6 rounded-lg py-3 cursor-pointer text-sm text-[#18181B]  font-[500]`}>{stg.name}</button>
//                 ))}
//             </div>


//             <div>
//                 <Notes/>
//             </div>



//         </section>
//     )
// }

// export default BottomContactDetail

import { useState } from "react";
import Notes from "@/components/agent/contactdetail/notes";
import SMS from "@/components/agent/contactdetail/sms";
import TouchPoint from "@/components/agent/contactdetail/touchpoint";
import Attachments from "@/components/agent/contactdetail/attachments";
import Misc from "@/components/agent/contactdetail/misc";
import Activities from "@/components/agent/contactdetail/activities";
import History from "@/components/agent/contactdetail/history";
import LeadSheet from "@/components/agent/contactdetail/leadsheet";
import AiCallSentiment from "@/components/agent/contactdetail/aicallsentiment";
import { useLocation } from "react-router-dom";
import Email from "./email";
import DetailsTab from "./detailstab";
import QualifyTab from "./qualifytab";

const BottomContactDetail = () => {
    const location = useLocation();
    const isContactInfo = location.pathname.includes("contact-info");
    const [openStatus, setOpenStatus] = useState(isContactInfo ? "Details" : "Notes");

    const stages = [
        ...(isContactInfo ? [
            { id: 2, name: "Details" },
            { id: 3, name: "Dominios" },
        ] : []),
        { id: 1, name: "Notes" },
        { id: 4, name: "Activities" },
        { id: 5, name: "History" },
        { id: 6, name: "Emails" },
        { id: 7, name: "SMS" },
        { id: 8, name: "Profile" },
        { id: 9, name: "Touch Point" },
        { id: 10, name: "Lead Sheet" },
        { id: 11, name: "Attachments" },
        ...(!isContactInfo ? [{ id: 12, name: "AI Sidekick" }] : []),
    ];

    return (
        <section className="bg-white dark:bg-slate-800 flex flex-col h-full w-full mx-auto rounded-[24px] shadow-sm overflow-hidden border border-gray-100 dark:border-slate-700">
            {/* Tabs */}
            <div className="flex bg-gray-50 dark:bg-slate-900/50 gap-1 overflow-x-auto no-scrollbar p-1.5 shrink-0">
                {stages.map((stg) => (
                    <button
                        key={stg.id}
                        onClick={() => setOpenStatus(stg.name)}
                        className={`${openStatus === stg.name 
                            ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm" 
                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"} 
                            px-4 py-2 rounded-xl cursor-pointer text-xs font-bold transition-all whitespace-nowrap min-w-[100px]`}
                    >
                        {stg.name}
                    </button>
                ))}
            </div>

            {/* Content Section - Scrollable internally */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {openStatus === "Details" && (<DetailsTab />)}
                {openStatus === "Notes" && (<Notes />)}
                {openStatus === "Dominios" && (<QualifyTab />)}
                {openStatus === "Profile" && (<Misc />)}
                {openStatus === "Activities" && (<Activities />)}
                {openStatus === "History" && (<History />)}
                {openStatus === "Emails" && (<Email />)}
                {openStatus === "SMS" && (<SMS />)}
                {openStatus === "Touch Point" && (<TouchPoint />)}
                {openStatus === "Lead Sheet" && (<LeadSheet />)}
                {openStatus === "Attachments" && (<Attachments />)}
                {openStatus === "AI Sidekick" && (<AiCallSentiment />)}
            </div>
        </section>
    );
};

export default BottomContactDetail;
