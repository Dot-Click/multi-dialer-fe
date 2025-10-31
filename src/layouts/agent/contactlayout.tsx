import AllContactSidebar from "@/components/agent/common/allcontactsidebar";
import Navbar from "@/components/agent/common/navbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const ContactLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    return (
        <div className='min-h-screen w-full relative'>
            {/* agent pages  */}
            <div className="fixed top-0 z-[1000]">
                {/* <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isMobile={isMobile} setIsMobile={setIsMobile} /> */}
                <AllContactSidebar />
            </div>
            <div className="fixed z-[999] top-0 w-full">
                <Navbar />
            </div>

            <div
                className={`absolute top-16 pt-[1rem] bg-[#EBEDF0] w-full   transition-all duration-300
                     ${isMobile ? "pl-4" : isOpen ? "pl-72" : "pl-20"} `}
            >
                <Outlet />
            </div>

        </div>
    )
}

export default ContactLayout