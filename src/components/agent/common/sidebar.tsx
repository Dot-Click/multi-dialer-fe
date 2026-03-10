import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import sidebaricon from "@/assets/sidebaricon.png";
import dashboardicon from "@/assets/dashboardicon.png";
import settingicon from "@/assets/settingicon.png";
import reporticon from "@/assets/reporticon.png";
import libraryicon from "@/assets/libraryicon.png";
import calendericon from "@/assets/calendericon.png";
import dataicon from "@/assets/dataicon.png";
import trainingicon from "@/assets/trainingicon.png";
import exiticon from "@/assets/exiticon.png";
import { FiMenu } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;
  session: any;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  isMobile,
  setIsMobile,
  session,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);
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

  const handleLogout = () => {
    dispatch(logout());
    navigate("/agent/login");
  };

  const sidebarLinks = [
    { id: 1, name: "Dashboard", link: "/", icon: dashboardicon },
    { id: 2, name: "Data & Dialer", link: "/data-dialer", icon: dataicon },
    { id: 3, name: "Calendar", link: "/calendar", icon: calendericon },
    { id: 4, name: "Library", link: "/library", icon: libraryicon },
    {
      id: 5,
      name: "Reports & Analytics",
      link: "/reports-analytics",
      icon: reporticon,
    },
    { id: 6, name: "Settings", link: "/settings", icon: settingicon },
  ];

  const bottomLinks = [
    { id: 1, name: "Training", link: "/training", icon: trainingicon },
  ];

  return (
    <>
      {/* MOBILE TOGGLE ICON */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 transition"
        >
          <FiMenu size={22} />
        </button>
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 z-40
          ${isOpen ? "w-64" : "w-16"}
          ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* MAIN CONTENT */}
        <div className="flex flex-col px-3 py-4 gap-4 overflow-y-auto flex-1">
          {/* Top Section (Logo + Toggle) */}
          <div className="flex items-center justify-between">
            {/* Logo only shows when sidebar is OPEN */}
            {isOpen && (
              <img
                src={
                  mode === "dark" ? "/images/darkLogo.png" : "/images/logo.png"
                }
                alt="Logo"
                className="object-contain w-36 transition-all duration-300"
              />
            )}

            {/* Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 rounded-md transition"
            >
              {isOpen ? (
                <img src={sidebaricon} className="h-5 w-5 object-contain" />
              ) : (
                <FiMenu size={20} />
              )}
            </button>
          </div>

          {/* Agent Info */}
          {isOpen && (
            <div className="flex bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 px-3 py-2 rounded-md flex-col">
              <h1 className="font-semibold text-gray-950 dark:text-slate-100 text-sm">
                {session?.user?.fullName || "Admin User"}
              </h1>
              <p className="text-gray-600 dark:text-slate-400 text-xs">
                {session?.user?.email || "admin@example.com"}
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 dark:border-slate-800"></div>

          {/* Sidebar Links */}
          <div className="flex flex-col gap-1 justify-center">
            {sidebarLinks.map((slinks) => (
              <NavLink
                key={slinks.id}
                to={slinks.link}
                className={({ isActive }) =>
                  `flex items-center gap-2 cursor-pointer px-2 py-2 rounded-md transition-all duration-200
                  ${!isOpen ? "justify-center" : ""}
                  ${
                    isActive
                      ? "bg-[#FFCA06] font-[600] text-gray-900"
                      : "hover:bg-[#FFCA06] text-gray-700 dark:text-white"
                  }`
                }
              >
                <img
                  src={slinks.icon}
                  className="h-4 w-4 dark:invert object-contain"
                />
                {isOpen && (
                  <span className="text-[12px] font-medium">{slinks.name}</span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* 🔹 BOTTOM LINKS — STICK TO BOTTOM */}
        <div className="flex flex-col border-t border-gray-200 dark:border-slate-800 px-3 py-4 gap-1">
          {bottomLinks.map((blink) => (
            <NavLink
              key={blink.id}
              to={blink.link}
              className={({ isActive }) =>
                `flex items-center gap-2 cursor-pointer px-2 py-2 rounded-md transition-all duration-200
                ${!isOpen ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-[#FFCA06] font-[600] text-gray-900"
                    : "hover:bg-[#FFCA06] text-gray-700 dark:text-white"
                }`
              }
            >
              <img
                src={blink.icon}
                className="h-4 w-4 dark:invert object-contain"
              />
              {isOpen && (
                <span className="text-[12px] font-medium">{blink.name}</span>
              )}
            </NavLink>
          ))}

          {/* EXIT BUTTON */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-2 py-2 rounded-md hover:bg-red-500 text-gray-600 dark:text-slate-300 hover:text-white transition-all
              ${!isOpen ? "justify-center" : ""}`}
          >
            <img src={exiticon} className="h-3 w-3 object-contain" />
            {isOpen && <span className="text-[12px] font-medium">Exit</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-40 z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
