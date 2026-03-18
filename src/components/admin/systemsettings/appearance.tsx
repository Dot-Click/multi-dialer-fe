import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  getAppearance,
  createAppearance,
} from "../../../store/slices/appearanceSlice";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

// Toggle switch component
interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onChange,
  label,
}) => (
  <div className="flex items-center gap-3 py-2.5">
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${enabled ? "bg-black dark:bg-slate-900" : "bg-gray-300 dark:bg-slate-700"
        }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-slate-300 transition ${enabled ? "translate-x-6" : "translate-x-0.5"
          }`}
      />
    </button>
    <span className="text-[16px] font-[400] text-[#495057] dark:text-gray-400 inter">
      {label}
    </span>
  </div>
);

// ────────────────────────────────────────────────
// Main Appearance component
// ────────────────────────────────────────────────
const Appearance: React.FC = () => {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.appearance);

  // Separate boolean toggles from string values
  const [toggles, setToggles] = useState({
    calendar: true,
    hotlist: true,
    callingGroupsWorkspace: true,
    dialerHealth: true,
    callStatistics: true,
    foldersLists: false,
    recentActivity: true,
    bestTimeToCall: true,
    leadIntelligence: true,
    aiCoachingCallAnalysis: true,
    callOutcomeIntelligence: true,
    efficiencyAutomation: true,
    complianceRiskMonitoring: true,
    callingGroupsAiSidekick: true,
    agentImprovementScores: true,
    pipelineAccelerationIndex: true,
    lockGroups: true,
    birthdays: true,
    homeCloseDate: true,
  });

  const [timeZone, setTimeZone] = useState("Central Standard Time (CST)");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(getAppearance());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      // Spread only boolean fields
      setToggles((prev) => ({ ...prev, ...settings }));

      // Handle timeZone separately if it exists in settings
      if ("timeZone" in settings && typeof settings.timeZone === "string") {
        setTimeZone(settings.timeZone);
      }
    }
  }, [settings]);

  const handleToggleChange = (key: keyof typeof toggles, value: boolean) => {
    const updated = { ...toggles, [key]: value };
    setToggles(updated);

    // Save both toggles + current timeZone
    saveAppearance({ ...updated, timeZone });
  };

  

  const saveAppearance = async (payload: typeof toggles & { timeZone: string }) => {
    try {
      setIsSaving(true);
      
      // Do not send lockGroups and timeZone in API
      const { lockGroups, timeZone, ...apiPayload } = payload;
      
      await dispatch(createAppearance(apiPayload as any)).unwrap();
      toast.success("Appearance settings saved successfully");
    } catch (error) {
      console.error("Save failed", error);
      toast.error("Failed to save appearance settings");
    } finally {
      setIsSaving(false);
    }
  };

  const workspaceItems = [
    { key: "calendar", label: "Calendar" },
    { key: "hotlist", label: "Hotlist" },
    { key: "callingGroupsWorkspace", label: "Calling Groups" },
    { key: "dialerHealth", label: "Dialer Health" },
    { key: "callStatistics", label: "Call Statistics" },
    { key: "foldersLists", label: "Folders & Lists" },
    { key: "recentActivity", label: "Recent Activity" },
  ] as const;

  const aiItems = [
    { key: "bestTimeToCall", label: "Best Time to Call" },
    { key: "leadIntelligence", label: "Lead Intelligence" },
    { key: "aiCoachingCallAnalysis", label: "AI Coaching & Call Analysis" },
    { key: "callOutcomeIntelligence", label: "Call Outcome Intelligence" },
    { key: "efficiencyAutomation", label: "Efficiency & Automation" },
    { key: "complianceRiskMonitoring", label: "Compliance & Risk Monitoring" },
    { key: "callingGroupsAiSidekick", label: "Calling Groups" },
    { key: "agentImprovementScores", label: "Agent Improvement Score" },
    { key: "pipelineAccelerationIndex", label: "Pipeline Acceleration Index" },
  ] as const;

  

  return (
    <div className="flex flex-col gap-5 pb-6">
      {isSaving && <Loader />}

      <div className="bg-white dark:bg-slate-800 rounded-md shadow px-7 py-4 mt-6">
        <div className="flex justify-between mb-6">
          <h2 className="text-[24px] font-[500] dark:text-white work-sans">Appearance</h2>
        </div>

        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-[18px] font-[500] dark:text-gray-300 work-sans">
            Dashboard Sections Visibility
          </h1>
          <p className="text-[14px] font-[400] text-[#2B3034] dark:text-gray-400 work-sans">
            Customize which sections appear on your dashboard.
          </p>
          <p className="text-[14px] font-[400] text-[#2B3034] dark:text-gray-400 work-sans">
            Select the areas you want to display and hide those you don’t need to keep your workspace clean and focused.
          </p>
        </div>

        <h3 className="font-[500] text-[#495057] dark:text-gray-300 text-[14px] mt-6 mb-2">
          Workspace Sections
        </h3>
        {workspaceItems.map((item) => (
          <ToggleSwitch
            key={item.key}
            label={item.label}
            enabled={toggles[item.key]}
            onChange={(enabled) => handleToggleChange(item.key, enabled)}
          />
        ))}

        <h3 className="font-[500] text-[#495057] dark:text-gray-300 text-[14px] mt-6 mb-2">
          AI Saleslab Sections
        </h3>
        {aiItems.map((item) => (
          <ToggleSwitch
            key={item.key}
            label={item.label}
            enabled={toggles[item.key]}
            onChange={(enabled) => handleToggleChange(item.key, enabled)}
          />
        ))}

        {/*
        <div className="mb-6 flex flex-col mt-6 gap-1">
          <h1 className="text-[18px] text-[#000] dark:text-gray-300 font-[500] work-sans">
            Lock Groups
          </h1>
          <p className="text-[14px] font-[400] text-[#2B3034] dark:text-gray-400 work-sans">
            If enabled, groups will be displayed in alphanumeric order, regardless of your selection.
          </p>
        </div>
        <div className="mt-6">
          <label className="flex items-center text-[#495057] dark:text-gray-400 font-[400] inter text-[16px] gap-2">
            <input
              type="checkbox"
              checked={toggles.lockGroups}
              onChange={(e) => handleToggleChange("lockGroups", e.target.checked)}
              className="accent-black dark:accent-yellow-400 h-4 w-4"
            />
            Lock Groups
          </label>
        </div>

        <div className="flex gap-3 flex-col mt-6">
          <h1 className="text-[18px] font-[500] text-[#000000] dark:text-gray-300">
            Time Zone
          </h1>
          <div className="flex items-center gap-5">
            <label
              htmlFor="timeZone"
              className="text-[#495057] dark:text-gray-400 font-[500] text-[14px]"
            >
              Time Zone
            </label>
            <div className="relative w-72 min-w-[240px]">
              <select
                id="timeZone"
                value={timeZone}
                onChange={(e) => handleTimeZoneChange(e.target.value)}
                className={`
                  w-full appearance-none
                  rounded-lg border px-4 py-2.5 pr-10
                  text-sm font-medium
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-1
                  bg-white text-gray-900 border-gray-300
                  hover:border-gray-400 hover:shadow-sm
                  focus:border-[#FFCB05] focus:ring-[#FFCB0522]
                  dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600
                  dark:hover:border-slate-500 dark:hover:shadow-md
                  dark:focus:border-[#FFCB05] dark:focus:ring-[#FFCB0522]
                  cursor-pointer
                `}
              >
                {timeZones.map((tz) => (
                  <option
                    key={tz}
                    value={tz}
                    className="bg-white text-gray-900 dark:bg-slate-800 dark:text-gray-100"
                  >
                    {tz}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        */}
      </div>

      {/* <div className="bg-white dark:bg-slate-800 rounded-md shadow px-7 py-4 mt-6">
        <h3 className="font-[500] text-[#0F1216] dark:text-white text-[24px] work-sans mb-4">
          Theme Mode
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setTheme("light")}
            className={`p-3 border flex justify-center items-center gap-4 rounded-[16px] transition-all ${theme === "light" ? "border-[#FFCB05] bg-[#FFCB0514] shadow-sm" : "border-gray-200 dark:border-slate-700"
              }`}
          >
            <span>
              <Sun className="text-7xl" />
            </span>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-[14px] font-[500] text-start text-[#2B3034] dark:text-gray-300">
                Light Mode
              </h1>
              <p className="text-[#495057] dark:text-gray-400 text-[12px] font-[400]">
                Bright and clean interface for daytime use
              </p>
            </div>
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={`p-3 border flex justify-center items-center gap-4 rounded-[16px] transition-all ${theme === "dark" ? "border-[#FFCB05] bg-[#FFCB0514] shadow-sm" : "border-gray-200 dark:border-slate-700"
              }`}
          >
            <span>
              <Moon className="text-7xl" />
            </span>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-[14px] font-[500] text-start text-[#2B3034] dark:text-gray-300">
                Dark Mode
              </h1>
              <p className="text-[#495057] dark:text-gray-400 text-[12px] font-[400]">
                Reduced eye strain for low-light environments
              </p>
            </div>
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Appearance;