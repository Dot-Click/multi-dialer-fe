import { useState, useRef, useEffect } from "react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { BsBell } from "react-icons/bs";
import { FiCheck, FiMoreVertical, FiClock, FiCheckSquare } from "react-icons/fi";
import { useNotifications } from "@/hooks/useSystemSettings";
import { usePush } from "@/hooks/usePush";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { Phone } from "lucide-react";
import QuickCallModal from "@/components/agent/common/quickcallmodal";
import { useAppDispatch } from "@/store/hooks";
import { signout } from "@/store/slices/authSlice";

const AdminNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [open, setOpen] = useState(false)

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [], markRead, markAllRead } = useNotifications();
  const { subscribe, loading: pushLoading } = usePush();
  const [hasPushPermission, setHasPushPermission] = useState(
    Notification.permission === "granted"
  );

  const { data } = authClient.useSession()

  const user = data?.user

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(signout());
    navigate("/admin/login");
  };

  const handleAccountSetting = () => {
    navigate("/admin/account-setting");
    setDropdownOpen(false);
  };

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-subscribe if permission already granted
  useEffect(() => {
    if (Notification.permission === "granted") {
      subscribe();
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;



  return (
    <nav className="border-b border-[#EBEDF0] dark:border-slate-700 w-full h-16 bg-white dark:bg-slate-800 flex justify-end items-center gap-5 px-9 relative">

      < button onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border text-gray-600 dark:text-gray-300 cursor-pointer text-sm font-medium transition-colors hover:bg-gray-300 dark:border-gray-600 dark:hover:bg-slate-700" >
        <Phone className="size-4" />
        Quick Call
      </button >
      <QuickCallModal open={open} onOpenChange={setOpen} />


      {/* Notification Bell & Dropdown */}
      <div className="relative" ref={notifRef}>
        <div
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className="border border-gray-400 dark:border-slate-600 dark:hover:bg-slate-700 cursor-pointer rounded-full p-2 relative hover:bg-gray-100 transition-all active:scale-95"
        >
          <BsBell className="text-gray-600 dark:text-gray-300 text-xl" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>

        {/* Notification Dropdown */}
        {isNotifOpen && (
          <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden z-[1001]">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col gap-2 bg-gray-50/50 dark:bg-slate-700/50">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead.mutate()}
                    className="text-xs text-yellow-500 hover:text-yellow-600 font-medium flex items-center gap-1"
                  >
                    <FiCheckSquare size={12} />
                    Mark all as read
                  </button>
                )}
              </div>

              {!hasPushPermission && (
                <button
                  onClick={async () => {
                    const success = await subscribe();
                    if (success) setHasPushPermission(true);
                  }}
                  disabled={pushLoading}
                  className="w-full mt-1 bg-[#FFCA06] hover:bg-[#e6b605] text-[#0E1011] text-xs font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {pushLoading ? "Enabling..." : "Enable Push Notifications"}
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => !n.isRead && markRead.mutate(n.id)}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border-b border-gray-50 dark:border-slate-700/30 group ${!n.isRead
                      ? "bg-yellow-50/30 dark:bg-yellow-400/5"
                      : ""
                      }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${n.isRead
                          ? "bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500"
                          : n.type === "event" || n.type === "reminder"
                            ? "bg-blue-100 text-blue-600"
                            : n.type === "error"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                      >
                        {n.type === "event" || n.type === "reminder" ? (
                          <FiClock size={14} />
                        ) : n.type === "error" ? (
                          <FiMoreVertical size={14} />
                        ) : (
                          <FiCheck size={14} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <p
                            className={`text-sm leading-tight ${!n.isRead
                              ? "font-bold text-gray-900 dark:text-white"
                              : "font-medium text-gray-600 dark:text-gray-400"
                              }`}
                          >
                            {n.title}
                          </p>
                          {!n.isRead && (
                            <span className="w-2 h-2 bg-yellow-400 rounded-full shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {n.description}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-medium">
                          {formatDistanceToNow(new Date(n.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BsBell className="text-gray-400" size={20} />
                  </div>
                  <p className="text-gray-400 text-sm font-medium">
                    No notifications yet
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 text-center border-t border-gray-100 dark:border-slate-700">
              <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                View all notifications
              </button>
            </div>
          </div>
        )}
      </div>{/* ← closes ref={notifRef} */}


      {/* Avatar with Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="bg-gray-600 text-lg flex justify-center items-center text-gray-200 cursor-pointer rounded-full w-10"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img src={user?.image || "/avatar.png"} alt="Avatar" className="w-10 rounded-full" />
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded shadow-md z-10">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
              onClick={handleAccountSetting}
            >
              Account Setting
            </button>

            <ThemeToggle />

            <button
              className="block w-full cursor-pointer hover:bg-red-500 text-left px-4 py-2 hover:text-white dark:hover:bg-slate-700"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;