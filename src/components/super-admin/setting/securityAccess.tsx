import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";



// type ToggleProps = {
//   active: boolean;
//   onClick: () => void;
// };

type Option = {
  label: string;
  value: number;
};

const sessionTimeoutOptions: Option[] = [
  { label: "15 minutes", value: 15 },
  { label: "30 minutes", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "4 hours", value: 240 },
  { label: "8 hours", value: 480 },
  { label: "24 hours", value: 1440 },
];

type DropdownFieldProps = {
  label: string;
  value: number;
  options: Option[];
  onChange: (value: number) => void;
};

/* ---------- DropdownField (must live outside SecurityAccess to keep stable identity) ---------- */

const DropdownField = ({ label, value, options, onChange }: DropdownFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[1];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mb-4 w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-[#F3F4F7] dark:bg-slate-700 py-3 px-3 rounded-[12px] w-full cursor-pointer hover:bg-[#efeff0] dark:hover:bg-slate-600 transition-colors group"
      >
        <label className="text-[12px] font-medium text-[#495057] dark:text-white block mb-0.5 cursor-pointer">
          {label}
        </label>
        <div className="flex justify-between items-center">
          <span className="text-[16px] font-normal text-[#848C94] dark:text-gray-400 work-sans">
            {selectedOption.label}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#828291] dark:text-gray-400 group-hover:text-[#343434] dark:group-hover:text-white transition-all ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[12px] shadow-lg py-2 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2 text-[14px] cursor-pointer transition-colors hover:bg-[#F3F4F7] dark:hover:bg-slate-700 ${
                value === option.value
                  ? "text-[#030213] dark:text-white font-semibold bg-[#F3F4F7] dark:bg-slate-700"
                  : "text-[#71717A] dark:text-gray-400 font-normal"
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------- Toggle (moved outside for same reason) ---------- */

// const Toggle = ({ active, onClick }: ToggleProps) => (
//   <button
//     onClick={onClick}
//     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
//       active ? "bg-[#030213]" : "bg-[#DADBDB]"
//     }`}
//   >
//     <span
//       className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
//         active ? "translate-x-[22px]" : "translate-x-[2px]"
//       }`}
//     />
//   </button>
// );

/* ---------- Main Component ---------- */

const SecurityAccess = () => {
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeoutMinutes: 30,
    minPasswordLength: 8,
    passwordExpiryDays: 90,
    requireSpecialChars: true,
    requireNumbers: true,
    requireUppercase: true,
    require2faForAdmins: false,
    allow2faForUsers: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Password change form — previously missing
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get("/company/my-company");
        if (data.data) {
          setSecuritySettings({
            sessionTimeoutMinutes: data.data.sessionTimeoutMinutes,
            minPasswordLength: data.data.minPasswordLength,
            passwordExpiryDays: data.data.passwordExpiryDays,
            requireSpecialChars: data.data.requireSpecialChars,
            requireNumbers: data.data.requireNumbers,
            requireUppercase: data.data.requireUppercase,
            require2faForAdmins: data.data.require2faForAdmins,
            allow2faForUsers: data.data.allow2faForUsers,
          });
        }
      } catch (err) {
        console.error("Failed to fetch security settings", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await api.post("/company/create", securitySettings);
      toast.success("Security settings updated successfully");
    } catch (err) {
      toast.error("Failed to save security settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < securitySettings.minPasswordLength) {
      toast.error(
        `Password must be at least ${securitySettings.minPasswordLength} characters`
      );
      return;
    }

    setIsChanging(true);
    const { error } = await authClient.changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      toast.error(error.message || "Failed to change password");
    } else {
      toast.success("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
    setIsChanging(false);
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-4 work-sans md:px-8 md:py-[23px] rounded-[22px] shadow-sm w-full max-w-full mx-auto">
        <h2 className="text-[18px] font-medium inter text-[#343434] dark:text-white mb-5">
          Security & Access
        </h2>

        {/* --- Change Password Section --- */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-5">
            <div className="bg-[#F4F4F5] dark:bg-slate-700 p-2 rounded-lg">
              <Lock className="w-5 h-5 text-[#343434] dark:text-white" />
            </div>
            <h3 className="font-semibold text-[18px] inter text-[#343434] dark:text-white">
              Change Password
            </h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            {/* Current Password */}
            <div className="bg-[#F3F4F7] dark:bg-slate-700 py-3 px-3 rounded-[12px] work-sans w-full relative">
              <label className="text-[12px] font-medium text-[#495057] dark:text-white block mb-0.5">
                Current Password
              </label>
              <div className="flex items-center">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="bg-transparent border-none outline-none w-full text-[16px] text-[#34363B] dark:text-white placeholder:text-[#848C94]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                  }
                  className="text-[#828291] focus:outline-none"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="bg-[#F3F4F7] dark:bg-slate-700 py-3 px-3 rounded-[12px] work-sans w-full relative">
              <label className="text-[12px] font-medium text-[#495057] dark:text-white block mb-0.5">
                New Password
              </label>
              <div className="flex items-center">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="bg-transparent border-none outline-none w-full text-[16px] text-[#34363B] dark:text-white placeholder:text-[#848C94]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, new: !showPasswords.new })
                  }
                  className="text-[#828291] focus:outline-none"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="bg-[#F3F4F7] dark:bg-slate-700 py-3 px-3 rounded-[12px] work-sans w-full relative">
              <label className="text-[12px] font-medium text-[#495057] dark:text-white block mb-0.5">
                Confirm New Password
              </label>
              <div className="flex items-center">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="bg-transparent border-none outline-none w-full text-[16px] text-[#34363B] dark:text-white placeholder:text-[#848C94]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                  }
                  className="text-[#828291] focus:outline-none"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isChanging}
              className="w-full bg-[#030213] text-white py-3 rounded-[12px] font-medium flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors disabled:opacity-50"
            >
              {isChanging ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>

        <div className="h-px bg-gray-100 w-full mb-5" />

        {/* --- Session Management Section --- */}
        <div className="mb-8">
          <h3 className="font-semibold text-[18px] inter text-[#343434] dark:text-white mb-6 ml-1">
            Session Management
          </h3>

          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-[#030213]" />
            </div>
          ) : (
            <DropdownField
              label="Session Timeout Duration"
              value={securitySettings.sessionTimeoutMinutes}
              options={sessionTimeoutOptions}
              onChange={(val) =>
                setSecuritySettings({ ...securitySettings, sessionTimeoutMinutes: val })
              }
            />
          )}

          {!isLoading && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-[#030213] text-white px-8 py-2.5 rounded-[12px] text-[15px] font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SecurityAccess;