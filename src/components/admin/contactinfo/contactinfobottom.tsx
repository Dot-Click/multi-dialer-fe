import { useState } from "react";
import mapicon from "../../../assets/mapicon.png";
import streeticon from "../../../assets/streeticon.png";
import groupicon from "../../../assets/groupicon.png";
import InnerContactInfo from "@/components/agent/contactinfo/innercontactinfo";
import NotesContactInfo from "@/components/agent/contactinfo/notescontactinfo";
import HistoryContactInfo from "@/components/agent/contactinfo/historycontactinfo";
import SendTextContactInfo from "@/components/agent/contactinfo/sendtextcontactinfo";
import SendEmailContactInfo from "@/components/agent/contactinfo/sendemailcontactinfo";

const ContactInfoBottom = () => {
    const [openDialogue, setOpenDialogue] = useState("Contact Info");

    const groupOptions = ["Contact Info", "Notes", "History", "Send Text", "Send Email"];

    return (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full">
            <div className="space-y-6 ">

                {/* Group Section */}
                <div className="flex flex-col sm:flex-row justify-between w-full sm:items-center gap-2 sm:gap-6">

                    {/* Button Group */}
                    <div className="flex w-full overflow-auto md:w-[80%]  rounded-lg text-[12px] md:text-[15px] font-medium bg-gray-200 justify-between gap-4">
                        {groupOptions.map((option) => (
                            <button
                                key={option}
                                onClick={() => setOpenDialogue(option)}
                                className={`
                 rounded-md px-4 py-2.5 w-fit whitespace-nowrap transition-colors duration-200
                  ${openDialogue === option ? "bg-[#FFCA06] font-semibold" : "bg-transparent"}
                `}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className=" w-full md:w-[20%] md:justify-between flex gap-4 items-center">
                        <img src={mapicon} alt="map icon" className="w-10 border px-2 py-1 rounded-md object-contain" />
                        <img src={streeticon} alt="street icon" className="w-12 border px-2 py-1 rounded-md object-contain" />
                        <img src={groupicon} alt="group icon" className="w-12 border px-2 py-1 rounded-md object-contain" />
                    </div>
                </div>

                {/* ✅ Dialogue Component Below */}
                <div className=" mt-2">
                    {openDialogue === "Contact Info" && <div><InnerContactInfo /></div>}
                    {openDialogue === "Notes" && <div><NotesContactInfo /></div>}
                    {openDialogue === "History" && <div><HistoryContactInfo /></div>}
                    {openDialogue === "Send Text" && <div><SendTextContactInfo /></div>}
                    {openDialogue === "Send Email" && <div><SendEmailContactInfo/></div>}
                </div>

            </div>
        </div>
    );
};

export default ContactInfoBottom;