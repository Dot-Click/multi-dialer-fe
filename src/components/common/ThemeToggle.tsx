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
      className="w-full px-4 py-2 text-left cursor-pointer  text-sm  transition-colors"
      aria-label="Toggle Theme"
    >
      {mode === "light" ? (
        <p className="flex items-center justify-between gap-2">Light Mode <Sun className="size-4" /></p>
      ) : (
        <p className="flex items-center justify-between gap-2">Dark Mode <Moon className="size-4" /></p>
      )}
    </button>
  );
};

export default ThemeToggle;
