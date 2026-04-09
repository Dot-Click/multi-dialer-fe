import { Database, FileText, ChevronDown, MoveRight, Loader2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import { useAuditLogs } from "@/hooks/useSystemSettings";

// ── Moved outside SystemPreference so React never remounts it on parent re-render ──
type RetentionOption = {
  label: string;
  value: number;
};

const retentionOptions: RetentionOption[] = [
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
  { label: "180 days", value: 180 },
  { label: "1 year", value: 365 },
  { label: "2 years", value: 730 },
  { label: "Forever", value: 0 },
];

type DropdownFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

const DropdownField = ({ label, value, onChange }: DropdownFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    retentionOptions.find((opt) => opt.value === value) || retentionOptions[3];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative mb-3 w-full" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-[#F3F4F7] dark:bg-slate-700 py-[8px] px-4 rounded-[12px] w-full cursor-pointer hover:bg-[#efeff0] dark:hover:bg-slate-600 transition-colors group"
      >
        <label className="text-[14px] font-medium text-[#495057] dark:text-white block mb-0.5 cursor-pointer">
          {label}
        </label>
        <div className="flex justify-between items-center">
          <span className="text-[16px] font-normal text-[#71717A] dark:text-gray-400 work-sans">
            {selectedOption.label}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#828291] dark:text-gray-400 group-hover:text-[#343434] dark:group-hover:text-white transition-all ${isOpen ? "rotate-180" : ""
              }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-[12px] shadow-lg py-2 max-h-60 overflow-y-auto">
          {retentionOptions.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2 text-[14px] cursor-pointer transition-colors hover:bg-[#F3F4F7] dark:hover:bg-slate-700 ${value === option.value
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

// ────────────────────────────────────────────────────────────────────────────────

const SystemPreference: React.FC = () => {
  const [retention, setRetention] = useState({
    callLogRetentionDays: 365,
    callRecordingRetentionDays: 90,
    inactiveUserDataRetentionDays: 180,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const { data: auditLogs, isLoading: isAuditLoading } = useAuditLogs();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const { data } = await api.get("/company/my-company");
        if (data.data) {
          setRetention({
            callLogRetentionDays: data.data.callLogRetentionDays,
            callRecordingRetentionDays: data.data.callRecordingRetentionDays,
            inactiveUserDataRetentionDays:
              data.data.inactiveUserDataRetentionDays,
          });
        }
      } catch (err) {
        console.error("Failed to fetch company", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post("/company/create", retention);
      toast.success("System preferences saved successfully");
    } catch (err) {
      toast.error("Failed to save changes");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 work-sans md:px-8 md:py-[23px] rounded-[22px] shadow-sm w-full max-w-full mx-auto border border-gray-50 dark:border-slate-700">
      <h2 className="text-[18px] font-medium inter text-[#343434] dark:text-white mb-5">
        System Preferences
      </h2>

      {/* --- Data Retention Policy Section --- */}
      <div className="mb-10">
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-[#F4F4F5] dark:bg-slate-700 p-2 rounded-lg">
            <Database className="w-5 h-5 text-[#343434] dark:text-white" />
          </div>
          <h3 className="font-semibold text-[18px] inter text-[#34363B] dark:text-white">
            Data Retention Policy
          </h3>
        </div>

        <div className="space-y-1 relative">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-[#030213]" />
            </div>
          ) : (
            <>
              <DropdownField
                label="Call Log Retention"
                value={retention.callLogRetentionDays}
                onChange={(val) =>
                  setRetention({
                    ...retention,
                    callLogRetentionDays: val,
                  })
                }
              />
              <DropdownField
                label="Call Recordings Retention"
                value={retention.callRecordingRetentionDays}
                onChange={(val) =>
                  setRetention({
                    ...retention,
                    callRecordingRetentionDays: val,
                  })
                }
              />
              <DropdownField
                label="Inactive Users Data"
                value={retention.inactiveUserDataRetentionDays}
                onChange={(val) =>
                  setRetention({
                    ...retention,
                    inactiveUserDataRetentionDays: val,
                  })
                }
              />
            </>
          )}
        </div>

        {/* Save Button for Retention Policy */}
        {!isLoading && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#030213] dark:bg-white text-white dark:text-[#030213] px-8 py-2.5 rounded-[12px] text-[15px] font-semibold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        )}
      </div>

      <div className="h-px bg-gray-100 w-full mb-10" />

      {/* --- Audit Logs Section --- */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-[#F4F4F5] dark:bg-slate-700 p-2 rounded-lg">
            <FileText className="w-5 h-5 text-[#343434] dark:text-white" />
          </div>
          <h3 className="font-semibold text-[18px] inter text-[#343434] dark:text-white">
            Audit Logs
          </h3>
        </div>

        <p className="text-[16px] font-normal text-[#34363B] dark:text-gray-400 mb-5 max-w-full work-sans">
          System audit logs track all administrative actions and security events
        </p>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex flex-wrap items-center gap-3">
            <div className="border border-[#EBEDF0] dark:border-slate-600 px-[24px] py-[8px] rounded-[12px] text-[16px] font-medium text-[#0E1011] dark:text-white work-sans">
              Last 90 days available
            </div>
            <div className="bg-[#EBEDF0] dark:bg-slate-700 px-[24px] py-[8px] rounded-[12px] text-[16px] font-medium text-[#0E1011] dark:text-white work-sans">
              {isAuditLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                `${auditLogs?.length || 0} entries`
              )}
            </div>
          </div>

          <button 
            onClick={() => navigate("/super-admin/audit-logs")}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#343434] dark:text-white hover:gap-3 transition-all inter border border-[#EBEDF0] dark:border-slate-600 px-[24px] py-[8px] rounded-[12px] dark:hover:bg-slate-700 work-sans"
          >
            View Logs <MoveRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[16px] font-normal text-[#8D8D8D] dark:text-gray-500 mt-5 work-sans">
          Audit logs are automatically retained for 90 days and cannot be
          modified or deleted
        </p>
      </div>
    </div>
  );
};

export default SystemPreference;