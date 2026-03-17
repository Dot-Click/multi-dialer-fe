import { useRef } from "react";
import ThemeToggle from "@/components/common/ThemeToggle";
import { BsBell } from "react-icons/bs";
import { useAppSelector } from "@/store/hooks";

const AdminNavbar = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { session } = useAppSelector((state) => state.auth);

  const fullName: string = session?.user?.fullName || "";
  const firstLetter = fullName.charAt(0).toUpperCase() || "U";

  return (
    <nav className="border border-[#EBEDF0] dark:border-slate-700 w-full h-16 bg-white dark:bg-slate-800 flex justify-end items-center gap-5 pt-3 pb-4 px-9">
      <ThemeToggle />

      {/* Notification Bell */}
      <div className="border border-gray-400 dark:border-slate-700 cursor-pointer rounded-full p-1.5">
        <span>
          <BsBell className="text-gray-600 text-xl dark:text-white " />
        </span>
      </div>

      {/* Avatar */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="bg-gray-600 text-lg flex justify-center items-center text-gray-200 cursor-pointer rounded-full px-3.5 py-1.5"
          title={fullName}
        >
          <h1>{firstLetter}</h1>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
