import { useState, useRef, useEffect } from "react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { BsBell } from "react-icons/bs";
import { FiCheck, FiMoreVertical, FiClock, FiCheckSquare } from "react-icons/fi";
import { useNotifications } from "@/hooks/useSystemSettings";
import { usePush } from "@/hooks/usePush";
import { formatDistanceToNow } from "date-fns";
import { Phone } from "lucide-react";
import QuickCallModal from "@/components/agent/common/quickcallmodal";

interface NavbarProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

const Navbar = ({ isOpen = true,  }: NavbarProps) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isQuickCallOpen, setIsQuickCallOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: notifications = [], markRead, markAllRead } = useNotifications();
  const { subscribe, loading: pushLoading } = usePush();
  const [hasPushPermission, setHasPushPermission] = useState(Notification.permission === 'granted');

  // Auto-subscribe if permission already granted
  useEffect(() => {
    if (Notification.permission === 'granted') {
      subscribe();
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className={`h-16 w-full border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 transition-all duration-300 ${isOpen ? "pl-64 lg:pl-72" : "pl-16 lg:pl-20"}`}>
      {/* Left Section: Quick Actions */}

      <QuickCallModal open={isQuickCallOpen} onOpenChange={setIsQuickCallOpen} />

      {/* Right Section: Theme & Notifications */}
      <div className="flex w-full items-center justify-end gap-2 lg:gap-4">

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsQuickCallOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md border border-[#EBEDF0] bg-white dark:bg-slate-900 dark:border-slate-700 text-gray-600 dark:text-gray-300 text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-95 shadow-sm"
          >
            <Phone className="size-4" />
            Quick Call
          </button>
        </div>

        <ThemeToggle />

        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer text-gray-600 dark:text-gray-300 relative transition-all active:scale-95 border border-gray-200 dark:border-slate-700"
          >
            <BsBell className="text-xl" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>

          {/* Dropdown Menu */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[1001]">
              <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col gap-2 bg-gray-50/50 dark:bg-slate-700/50">
                <div className="flex justify-between items-center">
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

                {!hasPushPermission && (
                  <button
                    onClick={async () => {
                      const success = await subscribe();
                      if (success) setHasPushPermission(true);
                    }}
                    disabled={pushLoading}
                    className="w-full mt-1 bg-yellow-400 hover:bg-yellow-500 text-black text-[10px] font-black py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {pushLoading ? 'ENABLING...' : 'ENABLE PUSH NOTIFICATIONS'}
                  </button>
                )}
              </div>

              <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.isRead && markRead.mutate(n.id)}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border-b border-gray-50 dark:border-slate-700/30 group ${!n.isRead ? 'bg-yellow-50/30 dark:bg-yellow-400/5' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${n.isRead ? 'bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500' :
                          n.type === 'event' ? 'bg-blue-100 text-blue-600' :
                            n.type === 'meeting' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                          }`}>
                          {n.type === 'event' ? <FiClock size={14} /> : n.type === 'meeting' ? <FiMoreVertical size={14} /> : <FiCheck size={14} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start gap-2">
                            <p className={`text-xs leading-tight ${!n.isRead ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-600 dark:text-gray-400'}`}>
                              {n.title}
                            </p>
                            {!n.isRead && <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full shrink-0 mt-1"></span>}
                          </div>
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
                    <div className="w-12 h-12 bg-gray-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <BsBell className="text-gray-300 dark:text-slate-500" size={20} />
                    </div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Quiet for now</p>
                  </div>
                )}
              </div>

              <div className="p-3 text-center border-t border-gray-100 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-900/30">
                <button className="text-[10px] font-black text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors uppercase tracking-widest">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
