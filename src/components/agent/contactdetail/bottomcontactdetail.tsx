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
import Email from "@/components/agent/contactdetail/email";
import SMS from "@/components/agent/contactdetail/sms";
import ActionPlans from "@/components/agent/contactdetail/actionplans";
import Attachments from "@/components/agent/contactdetail/attachments";
import Misc from "@/components/agent/contactdetail/misc";
import Activities from "@/components/agent/contactdetail/activities";
import History from "@/components/agent/contactdetail/history";
import LeadSheet from "@/components/agent/contactdetail/leadsheet";
import AiCallSentiment from "@/components/agent/contactdetail/aicallsentiment";

const BottomContactDetail = () => {
    const [openStatus, setOpenStatus] = useState("Notes");

    const stages = [
        { id: 1, name: "Notes" },
        { id: 2, name: "Misc" },
        { id: 3, name: "Activities" },
        { id: 4, name: "History" },
        { id: 5, name: "Emails" },
        { id: 6, name: "SMS" },
        { id: 7, name: "Action Plans" },
        { id: 8, name: "Lead Sheet" },
        { id: 9, name: "Attachments" },
        { id: 10, name: "AI Sidekick" },
    ];

    return (
        <section className="bg-white flex flex-col gap-8 shadow-2xl px-6 py-5 w-[96%] mx-auto rounded-[24px]">
            {/* Tabs */}
            <div className="flex bg-[#F3F4F7] max-w-screen overflow-x-auto gap-4 rounded-lg justify-between items-center">
                {stages.map((stg) => (
                    <button
                        key={stg.id}
                        onClick={() => setOpenStatus(stg.name)}
                        className={`${openStatus === stg.name ? "bg-[#FFCA06]" : ""} px-6 rounded-lg py-3 cursor-pointer text-sm text-[#18181B] font-[500]`}
                    >
                        {stg.name}
                    </button>
                ))}
            </div>

            {/* Content Section */}
            <div className="w-full">
                {openStatus === "Notes" && (<Notes />)}
                {openStatus === "Misc" && (<Misc />)}
                {openStatus === "Activities" && (<Activities />)}
                {openStatus === "History" && (<History />)}
                {openStatus === "Emails" && (<Email />)}
                {openStatus === "SMS" && (<SMS />)}
                {openStatus === "Action Plans" && (<ActionPlans />)}
                {openStatus === "Lead Sheet" && (<LeadSheet />)}
                {openStatus === "Attachments" && (<Attachments />)}
                {openStatus === "AI Sidekick" && (<AiCallSentiment />)}
            </div>
        </section>
    );
};

export default BottomContactDetail;
