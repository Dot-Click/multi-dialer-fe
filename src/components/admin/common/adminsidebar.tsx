import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import sidebaricon from "../../../assets/sidebaricon.png";
import dashboardicon from "../../../assets/dashboardicon.png";
import settingicon from "../../../assets/settingicon.png";
import reporticon from "../../../assets/reporticon.png";
import libraryicon from "../../../assets/libraryicon.png";
import calendericon from "../../../assets/calendericon.png";
import dataicon from "../../../assets/fluent_building-shop-24-regular.png";
import billingicon from "../../../assets/admin/billingicon.png";
import bulbicon from "../../../assets/admin/bulbicon.png";
import usericon from "../../../assets/admin/usericon.png";
// import trainingicon from "@/assets/trainingicon.png";
import exiticon from "../../../assets/exiticon.png";
import { FiMenu } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

interface AdminSidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;
  session: any;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
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
    navigate("/admin/login");
  };

  const sidebarLinks = [
    { id: 1, name: "Dashboard", link: "/admin", icon: dashboardicon },
    {
      id: 2,
      name: "Data & Dialer",
      link: "/admin/data-dialer",
      icon: dataicon,
    },
    { id: 3, name: "Calendar", link: "/admin/calendar", icon: calendericon },
    { id: 4, name: "Library", link: "/admin/library", icon: libraryicon },
    {
      id: 5,
      name: "Reports & Analytics",
      link: "/admin/reports-analytics",
      icon: reporticon,
    },
    {
      id: 6,
      name: "Compliance & DNC",
      link: "/admin/compliance",
      icon: bulbicon,
    },
    {
      id: 7,
      name: "User Management",
      link: "/admin/user-management",
      icon: usericon,
    },
    {
      id: 8,
      name: "System Settings",
      link: "/admin/system-settings",
      icon: settingicon,
    },
    { id: 9, name: "Billing", link: "/admin/billing", icon: billingicon },
  ];

  const bottomLinks = [
    // { id: 10, name: "Training", link: "/training", icon: trainingicon },
    { id: 11, name: "Lead Store", link: "/admin/lead-store", icon: dataicon },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-md hover:bg-gray-700 transition"
        >
          <FiMenu size={22} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 z-40
          ${isOpen ? "w-64" : "w-16"}
          ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        <div className="flex flex-col px-3 py-4 gap-4">
          {/* Logo + Toggle */}
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

          {/* User Info */}
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

          {/* Top Links */}
          <div className="flex flex-col gap-1 justify-center">
            {sidebarLinks.map((slinks) => (
              <NavLink
                key={slinks.id}
                to={slinks.link}
                end={slinks.link === "/admin"} // exact match for Dashboard only
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

        {/* Bottom Links */}
        <div className="px-3 pb-4 border-t border-gray-200 dark:border-slate-800 pt-3 flex flex-col gap-1">
          {bottomLinks.map((item) => (
            <NavLink
              key={item.id}
              to={item.link}
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-2 rounded-md transition-all
                ${!isOpen ? "justify-center" : ""}
                ${
                  isActive
                    ? "bg-[#FFCA06] font-[600] text-gray-900"
                    : "hover:bg-[#FFCA06] text-gray-700 dark:text-white"
                }`
              }
            >
              <img
                src={item.icon}
                className="h-4 w-4 dark:invert object-contain"
              />
              {isOpen && (
                <span className="text-[12px] font-medium">{item.name}</span>
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

      {/* Mobile Overlay */}
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
