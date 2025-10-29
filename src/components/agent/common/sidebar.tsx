import React, { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import { BiSolidDashboard } from "react-icons/bi";
import { FiMenu, FiX } from "react-icons/fi";

const Sidebar = ({isOpen,setIsOpen,isMobile,setIsMobile}) => {
  // const [isOpen, setIsOpen] = useState(true);
  // const [isMobile, setIsMobile] = useState(false);

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
    { id: 1, name: "Dashboard", link: "/", icon: <BiSolidDashboard /> },
    { id: 2, name: "Data & Dialer", link: "/", icon: <BiSolidDashboard /> },
    { id: 3, name: "Calendar", link: "/", icon: <BiSolidDashboard /> },
    { id: 4, name: "Library", link: "/", icon: <BiSolidDashboard /> },
    { id: 5, name: "Reports & Analytics", link: "/", icon: <BiSolidDashboard /> },
    { id: 6, name: "Settings", link: "/", icon: <BiSolidDashboard /> },
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
              className={`object-contain transition-all duration-300 ${
                isOpen ? "w-36" : "w-8"
              }`}
            />

            {/* 🔹 Toggle icon */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 bg-gray-100 hover:bg-gray-200 rounded-md transition"
            >
              {isMobile ? (
                // Mobile → show close icon inside sidebar
                isOpen && <FiX size={20} />
              ) : (
                // Desktop → toggle open/collapse
                isOpen ? <FiX size={20} /> : <FiMenu size={20} />
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
          <div className="flex flex-col gap-2 justify-center">
            {sidebarLinks.map((slinks) => (
              <div
                key={slinks.id}
                className={`flex items-center gap-3 cursor-pointer px-2 py-2 rounded-md hover:bg-yellow-400 transition-all duration-200
                  ${!isOpen ? "justify-center" : ""}
                `}
              >
                <span className="text-lg text-gray-700">{slinks.icon}</span>
                {isOpen && (
                  <span className="text-base font-medium text-gray-700">
                    {slinks.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        
      
      </aside>

      {/* 🔹 Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
