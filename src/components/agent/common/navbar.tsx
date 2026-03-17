import { useState, useRef, useEffect } from "react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { BsBell } from "react-icons/bs";
import { FiCheck, FiMoreVertical, FiClock, FiCheckSquare } from "react-icons/fi";
import { useNotifications } from "@/hooks/useSystemSettings";
import { usePush } from "@/hooks/usePush";
import { formatDistanceToNow } from "date-fns";

const Navbar = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
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
    <nav className="border-b border-[#EBEDF0] w-full h-16 dark:bg-slate-900 dark:border-slate-700 bg-white flex justify-end items-center gap-5 px-9 relative">
      <ThemeToggle />
      
      {/* Notification Bell & Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div 
          onClick={() => setIsNotifOpen(!isNotifOpen)}
          className="border border-gray-400 cursor-pointer dark:border-slate-600 dark:hover:bg-slate-800 hover:text-gray-900 hover:bg-gray-200 rounded-full p-2 relative transition-all active:scale-95"
        >
          <BsBell className="text-gray-600 dark:text-gray-300 text-xl" />
          {/* Notification Badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center animate-in zoom-in">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>

        {/* Dropdown Menu */}
        {isNotifOpen && (
          <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-1001">
            <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex flex-col gap-2 bg-gray-50/50 dark:bg-slate-700/50">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
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
                  className="w-full mt-1 bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {pushLoading ? 'Enabling...' : 'Enable Push Notifications'}
                </button>
              )}
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => !n.isRead && markRead.mutate(n.id)}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors border-b border-gray-50 dark:border-slate-700/30 group ${!n.isRead ? 'bg-yellow-50/30 dark:bg-yellow-400/5' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                        n.isRead ? 'bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-slate-500' :
                        n.type === 'event' ? 'bg-blue-100 text-blue-600' : 
                        n.type === 'meeting' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {n.type === 'event' ? <FiClock size={14} /> : n.type === 'meeting' ? <FiMoreVertical size={14} /> : <FiCheck size={14} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-2">
                          <p className={`text-sm leading-tight ${!n.isRead ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-600 dark:text-gray-400'}`}>
                            {n.title}
                          </p>
                          {!n.isRead && <span className="w-2 h-2 bg-yellow-400 rounded-full shrink-0 mt-1"></span>}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{n.description}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-medium">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
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
                  <p className="text-gray-400 text-sm font-medium">No notifications yet</p>
                </div>
              )}
            </div>
            
            <div className="p-3 text-center border-t border-gray-100 dark:border-slate-700">
              <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                View all notifications
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
