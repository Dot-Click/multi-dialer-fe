import { useState } from "react";
import Sidebar from "@/components/agent/common/sidebar"
import Navbar from "@/components/agent/common/navbar"
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    return (
        <div className='min-h-screen w-full relative'>
            {/* agent pages  */}
            <div className="fixed top-0 z-[1000]">
                <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isMobile={isMobile} setIsMobile={setIsMobile} />
            </div>
            <div className="fixed top-0 w-full">
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

export default DashboardLayout