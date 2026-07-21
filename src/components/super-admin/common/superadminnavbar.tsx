import { useState, useRef, useEffect } from "react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { useNavigate } from "react-router-dom";
import { BsBell } from "react-icons/bs";
import { FiCheck, FiCheckSquare } from "react-icons/fi";
import { useNotifications } from "@/hooks/useSystemSettings";
import { formatDistanceToNow } from "date-fns";

const SuperAdminNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
const navigate = useNavigate();
  const { data: notifications = [], markRead, markAllRead } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const handleAccountSetting = () => {
    navigate("/super-admin/setting") ;
    setDropdownOpen(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="border dark:border-gray-600 border-[#EBEDF0] w-full h-16 bg-white dark:bg-gray-800 flex justify-end items-center gap-5 pt-3 pb-4 px-9">
      <ThemeToggle />

      {/* Notification Bell */}
      <div className="relative" ref={notifRef}>
        <div
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer text-gray-600 dark:text-gray-300 relative transition-all border border-gray-200 dark:border-slate-700"
        >
          <BsBell className="text-xl" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>

        {isNotifOpen && (
          <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-[1001]">
            <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-700/50">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="text-[10px] text-yellow-600 dark:text-yellow-400 hover:underline font-bold flex items-center gap-1"
                >
                  <FiCheckSquare size={12} />
                  MARK ALL READ
                </button>
              )}
            </div>
            <div className="max-h-[350px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && markRead.mutate(n.id)}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border-b border-gray-50 dark:border-slate-700/30 ${!n.isRead ? "bg-yellow-50/30 dark:bg-yellow-400/5" : ""}`}
                  >
                    <div className="flex gap-3">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${n.isRead ? "bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500" : "bg-green-100 text-green-600"}`}>
                        <FiCheck size={14} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs leading-tight ${!n.isRead ? "font-bold text-gray-900 dark:text-white" : "font-medium text-gray-600 dark:text-gray-400"}`}>
                          {n.title}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">{n.description}</p>
                        <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-2 font-bold uppercase tracking-tighter">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Quiet for now</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Avatar with Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="bg-gray-600 text-lg flex justify-center items-center text-gray-200 cursor-pointer rounded-full px-3.5 py-1.5"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <h1>C</h1>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded shadow-md z-10">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={handleAccountSetting}
            >
              Account Setting
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default SuperAdminNavbar;
