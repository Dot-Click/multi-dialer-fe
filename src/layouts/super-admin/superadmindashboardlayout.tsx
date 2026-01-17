import { useState } from "react";
import { Outlet } from "react-router-dom";
import SuperAdminSidebar from "@/components/super-admin/common/superadminsidebar";
import SuperAdminNavbar from "@/components/super-admin/common/superadminnavbar";

const SuperAdminDashboardLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    return (
        <div className='    min-h-screen w-full relative'>
            {/* agent pages  */}
            <div className="fixed top-0 z-[1000]">
                <SuperAdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} isMobile={isMobile} setIsMobile={setIsMobile} />
            </div>
            <div className="fixed z-[999] top-0 w-full">
                <SuperAdminNavbar />
            </div>

            <div
                className={`absolute top-16 pt-[5px] min-h-full  bg-[#F7F7F7] w-full   transition-all duration-300
                     ${isMobile ? "pl-4" : isOpen ? "pl-[270px]" : "pl-16"} `}
            >
                <Outlet />
            </div>

        </div>
    )
}

export default SuperAdminDashboardLayout