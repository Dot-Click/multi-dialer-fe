import React from "react";
import { Moon, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/themeSlice";

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const { mode } = useAppSelector((state) => state.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-300 flex items-center justify-center text-gray-600 dark:text-gray-300"
      aria-label="Toggle Theme"
    >
      {mode === "light" ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
