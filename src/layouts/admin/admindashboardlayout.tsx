import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/common/adminsidebar";
import AdminNavbar from "@/components/admin/common/adminnavbar";

const AdminDashboardLayout = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    return (
        <div className='    min-h-screen w-full relative'>
            {/* agent pages  */}
            <div className="fixed top-0 z-[1000]">
                <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} isMobile={isMobile} setIsMobile={setIsMobile} />
            </div>
            <div className="fixed z-[999] top-0 w-full">
                <AdminNavbar />
            </div>

            <div
                className={`absolute top-16 pt-[1rem] min-h-full  bg-[#F7F7F7] w-full   transition-all duration-300
                     ${isMobile ? "pl-4" : isOpen ? "pl-72" : "pl-20"} `}
            >
                <Outlet />
            </div>

        </div>
    )
}

export default AdminDashboardLayout