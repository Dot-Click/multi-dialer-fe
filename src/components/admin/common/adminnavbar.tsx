import { useState, useRef, useEffect } from "react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { BsBell } from "react-icons/bs";

const AdminNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAccountSetting = () => {
    window.location.href = "/admin/account-setting";
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
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="border border-[#EBEDF0] dark:border-slate-700 w-full h-16 bg-white dark:bg-slate-800 flex justify-end items-center gap-5 pt-3 pb-4 px-9">
      <ThemeToggle />

      {/* Notification Bell */}
      <div className="border border-gray-400 dark:border-slate-700 cursor-pointer rounded-full p-1.5">
        <span>
          <BsBell className="text-gray-600 text-xl dark:text-white " />
        </span>
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
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded shadow-md z-10">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
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

export default AdminNavbar;
