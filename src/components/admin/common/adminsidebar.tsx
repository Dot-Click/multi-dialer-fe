import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../../assets/logo.png";
import sidebaricon from "../../../assets/sidebaricon.png";
import dashboardicon from "../../../assets/dashboardicon.png";
import settingicon from "../../../assets/settingicon.png";
import reporticon from "../../../assets/reporticon.png";
import libraryicon from "../../../assets/libraryicon.png";
import calendericon from "../../../assets/calendericon.png";
import dataicon from "../../../assets/dataicon.png";
import billingicon from "../../../assets/admin/billingicon.png";
import bulbicon from "../../../assets/admin/bulbicon.png";
import usericon from "../../../assets/admin/usericon.png";
import { FiMenu } from "react-icons/fi";


interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;
}
const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, setIsOpen, isMobile, setIsMobile }) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsOpen(false);
      } else {
        setIsMobile(false);
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarLinks = [
    { id: 1, name: "Dashboard", link: "/", icon: dashboardicon },
    { id: 2, name: "Data & Dialer", link: "/data-dialer", icon: dataicon },
    { id: 3, name: "Calendar", link: "/calendar", icon: calendericon },
    { id: 4, name: "Library", link: "/library", icon: libraryicon },
    { id: 5, name: "Reports & Analytics", link: "/reports", icon: reporticon },
    { id: 6, name: "Compliance & DNC", link: "/settings", icon: bulbicon },
    { id: 7, name: "User Management", link: "/settings", icon: usericon },
    { id: 8, name: "System Settings", link: "/settings", icon: settingicon },
    { id: 9, name: "Billing", link: "/settings", icon: billingicon },
  ];

  return (
    <>
      {/* MOBILE TOGGLE ICON (visible only when sidebar closed) */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 transition"
        >
          <FiMenu size={22} />
        </button>
      )}

      {/*  SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-2xl flex flex-col justify-between transition-all duration-300 z-40
          ${isOpen ? "w-64" : "w-16"}
          ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <div className="flex flex-col px-3 py-4 gap-4">
          {/* 🔹 Top Section (Logo + Toggle) */}
          <div className="flex items-center justify-between">
            <img
              src={logo}
              alt="Logo"
              className={`object-contain transition-all duration-300 ${isOpen ? "w-36" : "w-8"
                }`}
            />

            {/* 🔹 Toggle icon */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 bg-gray-100 hover:bg-gray-200 rounded-md transition"
            >
              {isMobile ? (
                // isOpen && <FiX size={20} />
                isOpen && <img src={sidebaricon} className="h-5 w-5 object-contain" />
              ) : (
                isOpen ? <img src={sidebaricon} className="h-5 w-5 object-contain" /> : <FiMenu size={20} />
              )}
            </button>
          </div>

          {/* 🔹 Agent Info (visible only when open) */}
          {isOpen && (
            <div className="flex bg-gray-50 border border-gray-200 px-3 py-2 rounded-md flex-col">
              <h1 className="font-semibold text-gray-950 text-sm">John Lee</h1>
              <p className="text-gray-600 text-xs">j.lee@example.com</p>
            </div>
          )}

          <div className="border-t border-gray-200"></div>

          {/* 🔹 Sidebar Links */}
          <div className="flex flex-col gap-1 justify-center">
            {sidebarLinks.map((slinks) => (
              <NavLink
                key={slinks.id}
                to={slinks.link}
                className={({ isActive }) =>
                  `flex items-center gap-2 cursor-pointer px-2 py-2 rounded-md transition-all duration-200
                  ${!isOpen ? "justify-center" : ""}
                  ${isActive
                    ? "bg-[#FFCA06] font-[600] text-gray-900"
                    : "hover:bg-[#FFCA06] text-gray-700"
                  }`
                }
              >
                <img src={slinks.icon} className="h-3 w-3 object-contain" />
                {isOpen && (
                  <span className="text-[12px] font-medium">{slinks.name}</span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </aside>

      {/* 🔹 Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-40 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default AdminSidebar;
