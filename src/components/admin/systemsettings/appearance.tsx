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

// ────────────────────────────────
// Main Appearance component
//
// Booleans only. The Appearance model is a pure feature-toggle row — the
// timeZone, lockGroups, birthdays and homeCloseDate columns were dropped
// from it (see slingvo-be#28), so anything sent for them is discarded by the
// API without an error. The company timezone lives on the Compliance & DNC
// page (TimeZoneSetting.tsx), which is the one control that actually writes
// it.
// ────────────────────────────────
const Appearance: React.FC = () => {
  const dispatch = useAppDispatch();
  const { settings } = useAppSelector((state) => state.appearance);

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
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(getAppearance());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setToggles((prev) => ({ ...prev, ...settings }));
    }
  }, [settings]);

  const handleToggleChange = (key: keyof typeof toggles, value: boolean) => {
    const updated = { ...toggles, [key]: value };
    setToggles(updated);
    saveAppearance(updated);
  };

  const saveAppearance = async (payload: typeof toggles) => {
    try {
      setIsSaving(true);
      await dispatch(createAppearance(payload as any)).unwrap();
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
