// import React, { useState } from 'react';

// interface ToggleSwitchProps {
//   enabled: boolean;
//   onChange: (enabled: boolean) => void;
//   label: string;
// }

// const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label }) => (
//   <div className="flex items-center gap-3 py-2.5">
//     {/* Switch on the LEFT side */}
//     <button
//       type="button"
//       onClick={() => onChange(!enabled)}
//       className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 flex-shrink-0 ${
//         enabled ? 'bg-black' : 'bg-gray-300'
//       }`}
//     >
//       <span
//         className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
//           enabled ? 'translate-x-6' : 'translate-x-0.5'
//         }`}
//       />
//     </button>
//     {/* Label on the RIGHT side */}
//     <span className="text-sm font-medium text-gray-900">{label}</span>
//   </div>
// );

// const Appearance: React.FC = () => {
//   const [workspaceSections, setWorkspaceSections] = useState({
//     calendar: true,
//     hotlist: true,
//     callingGroups: true,
//     dialerHealth: true,
//     callStatistics: true,
//     foldersLists: false,
//     recentActivity: true,
//   });

//   const [aiSaleslabSections, setAiSaleslabSections] = useState({
//     bestTimeToCall: true,
//     leadIntelligence: true,
//     aiCoaching: true,
//     callOutcomeIntelligence: true,
//     efficiencyAutomation: true,
//     complianceRiskMonitoring: true,
//     callingGroups: true,
//     agentImprovementScore: true,
//     pipelineAccelerationIndex: true,
//   });

//   const [lockGroups, setLockGroups] = useState(true);
//   const [showBirthdays, setShowBirthdays] = useState(true);
//   const [showHomeCloseDate, setShowHomeCloseDate] = useState(true);
//   const [timeZone, setTimeZone] = useState('Central Standard Time (CST)');

//   const workspaceItems = [
//     { key: 'calendar', label: 'Calendar' },
//     { key: 'hotlist', label: 'Hotlist' },
//     { key: 'callingGroups', label: 'Calling Groups' },
//     { key: 'dialerHealth', label: 'Dialer Health' },
//     { key: 'callStatistics', label: 'Call Statistics' },
//     { key: 'foldersLists', label: 'Folders & Lists' },
//     { key: 'recentActivity', label: 'Recent Activity' },
//   ];

//   const aiSaleslabItems = [
//     { key: 'bestTimeToCall', label: 'Best Time to Call' },
//     { key: 'leadIntelligence', label: 'Lead Intelligence' },
//     { key: 'aiCoaching', label: 'AI Coaching & Call Analysis' },
//     { key: 'callOutcomeIntelligence', label: 'Call Outcome Intelligence' },
//     { key: 'efficiencyAutomation', label: 'Efficiency & Automation' },
//     { key: 'complianceRiskMonitoring', label: 'Compliance & Risk Monitoring' },
//     { key: 'callingGroups', label: 'Calling Groups' },
//     { key: 'agentImprovementScore', label: 'Agent Improvement Score' },
//     { key: 'pipelineAccelerationIndex', label: 'Pipeline Acceleration Index' },
//   ];

//   const timeZones = [
//     'Central Standard Time (CST)',
//     'Eastern Standard Time (EST)',
//     'Pacific Standard Time (PST)',
//     'Mountain Standard Time (MST)',
//     'Alaska Standard Time (AKST)',
//     'Hawaii-Aleutian Standard Time (HST)',
//   ];

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mt-6">
//       <h2 className="text-xl font-bold text-gray-900 mb-6">Appearance</h2>

//       {/* Dashboard Sections */}
//       <div className="mb-8">
//         <h3 className="text-lg font-bold text-gray-900 mb-2">Dashboard Sections Visibility</h3>
//         <p className="text-sm text-gray-600 mb-6 leading-relaxed">
//           Customize which sections appear on your dashboard. Select the areas you want to display and hide those you don’t need to keep your workspace clean and focused.
//         </p>

//         {/* Workspace sections */}
//         <div className="mb-6">
//           <h4 className="text-base font-semibold text-gray-900 mb-4">Workspace sections</h4>
//           <div className="space-y-0.5">
//             {workspaceItems.map((item) => (
//               <ToggleSwitch
//                 key={item.key}
//                 label={item.label}
//                 enabled={workspaceSections[item.key as keyof typeof workspaceSections]}
//                 onChange={(enabled) =>
//                   setWorkspaceSections((prev) => ({ ...prev, [item.key]: enabled }))
//                 }
//               />
//             ))}
//           </div>
//         </div>

//         {/* AI Saleslab sections */}
//         <div>
//           <h4 className="text-base font-semibold text-gray-900 mb-4">AI Saleslab sections</h4>
//           <div className="space-y-0.5">
//             {aiSaleslabItems.map((item) => (
//               <ToggleSwitch
//                 key={item.key}
//                 label={item.label}
//                 enabled={aiSaleslabSections[item.key as keyof typeof aiSaleslabSections]}
//                 onChange={(enabled) =>
//                   setAiSaleslabSections((prev) => ({ ...prev, [item.key]: enabled }))
//                 }
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Lock Groups */}
//       <div className="mb-8">
//         <h3 className="text-lg font-bold text-gray-900 mb-2">Lock Groups</h3>
//         <p className="text-sm text-gray-600 mb-4 leading-relaxed">
//           If enabled, groups will be displayed in alphanumeric order, regardless of your selection.
//         </p>
//         <label className="flex items-center gap-3 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={lockGroups}
//             onChange={(e) => setLockGroups(e.target.checked)}
//             className="h-5 w-5 accent-black focus:ring-black border-gray-300 rounded cursor-pointer"
//           />
//           <span className="text-sm font-medium text-gray-900">Show Lock Groups</span>
//         </label>
//       </div>

//       {/* Show Birthdays */}
//       <div className="mb-8">
//         <h3 className="text-lg font-bold text-gray-900 mb-2">Show Birthdays</h3>
//         <p className="text-sm text-gray-600 mb-4 leading-relaxed">
//           If enabled, the Contact Details page will include a birthday field.
//         </p>
//         <label className="flex items-center gap-3 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={showBirthdays}
//             onChange={(e) => setShowBirthdays(e.target.checked)}
//             className="h-5 w-5 accent-black focus:ring-black border-gray-300 rounded cursor-pointer"
//           />
//           <span className="text-sm font-medium text-gray-900">Show Birthdays</span>
//         </label>
//       </div>

//       {/* Show Home Close Date */}
//       <div className="mb-8">
//         <h3 className="text-lg font-bold text-gray-900 mb-2">Show Home Close Date</h3>
//         <p className="text-sm text-gray-600 mb-4 leading-relaxed">
//           If enabled, the Contact Details page will include home close date fields.
//         </p>
//         <label className="flex items-center gap-3 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={showHomeCloseDate}
//             onChange={(e) => setShowHomeCloseDate(e.target.checked)}
//             className="h-5 w-5 accent-black focus:ring-black border-gray-300 rounded cursor-pointer"
//           />
//           <span className="text-sm font-medium text-gray-900">Show Home Close Date</span>
//         </label>
//       </div>

//       {/* Time Zone */}
//       <div>
//         <h3 className="text-lg font-bold text-gray-900 mb-2">Time Zone</h3>
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-900">Select Time Zone</label>
//           <div className="relative w-full sm:w-80">
//             <select
//               value={timeZone}
//               onChange={(e) => setTimeZone(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-white appearance-none pr-10"
//             >
//               {timeZones.map((tz) => (
//                 <option key={tz} value={tz}>
//                   {tz}
//                 </option>
//               ))}
//             </select>
//             <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
//               <svg
//                 className="w-5 h-5 text-gray-500"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M19 9l-7 7-7-7"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Appearance;



import React, { useState } from 'react';
import {Moon,Sun} from "lucide-react";

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label }) => (
  <div className="flex items-center gap-3 py-2.5">
    {/* Switch on the LEFT side */}
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 flex-shrink-0 ${
        enabled ? 'bg-black' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-0.5'
        }`}
      />
    </button>
    {/* Label on the RIGHT side */}
    <span className="text-sm font-medium text-gray-900">{label}</span>
  </div>
);

const Appearance: React.FC = () => {
  const [workspaceSections, setWorkspaceSections] = useState({
    calendar: true,
    hotlist: true,
    callingGroups: true,
    dialerHealth: true,
    callStatistics: true,
    foldersLists: false,
    recentActivity: true,
  });

  const [aiSaleslabSections, setAiSaleslabSections] = useState({
    bestTimeToCall: true,
    leadIntelligence: true,
    aiCoaching: true,
    callOutcomeIntelligence: true,
    efficiencyAutomation: true,
    complianceRiskMonitoring: true,
    callingGroups: true,
    agentImprovementScore: true,
    pipelineAccelerationIndex: true,
  });

  const [lockGroups, setLockGroups] = useState(true);
  const [showBirthdays, setShowBirthdays] = useState(true);
  const [showHomeCloseDate, setShowHomeCloseDate] = useState(true);
  const [timeZone, setTimeZone] = useState('Central Standard Time (CST)');

    // NEW STATE FOR THEME
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const workspaceItems = [
    { key: 'calendar', label: 'Calendar' },
    { key: 'hotlist', label: 'Hotlist' },
    { key: 'callingGroups', label: 'Calling Groups' },
    { key: 'dialerHealth', label: 'Dialer Health' },
    { key: 'callStatistics', label: 'Call Statistics' },
    { key: 'foldersLists', label: 'Folders & Lists' },
    { key: 'recentActivity', label: 'Recent Activity' },
  ];

  const aiSaleslabItems = [
    { key: 'bestTimeToCall', label: 'Best Time to Call' },
    { key: 'leadIntelligence', label: 'Lead Intelligence' },
    { key: 'aiCoaching', label: 'AI Coaching & Call Analysis' },
    { key: 'callOutcomeIntelligence', label: 'Call Outcome Intelligence' },
    { key: 'efficiencyAutomation', label: 'Efficiency & Automation' },
    { key: 'complianceRiskMonitoring', label: 'Compliance & Risk Monitoring' },
    { key: 'callingGroups', label: 'Calling Groups' },
    { key: 'agentImprovementScore', label: 'Agent Improvement Score' },
    { key: 'pipelineAccelerationIndex', label: 'Pipeline Acceleration Index' },
  ];

  const timeZones = [
    'Central Standard Time (CST)',
    'Eastern Standard Time (EST)',
    'Pacific Standard Time (PST)',
    'Mountain Standard Time (MST)',
    'Alaska Standard Time (AKST)',
    'Hawaii-Aleutian Standard Time (HST)',
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mt-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Appearance</h2>

      {/* Dashboard Sections */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Dashboard Sections Visibility</h3>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Customize which sections appear on your dashboard. Select the areas you want to display and hide those you don’t need to keep your workspace clean and focused.
        </p>

        {/* Workspace sections */}
        <div className="mb-6">
          <h4 className="text-base font-semibold text-gray-900 mb-4">Workspace sections</h4>
          <div className="space-y-0.5">
            {workspaceItems.map((item) => (
              <ToggleSwitch
                key={item.key}
                label={item.label}
                enabled={workspaceSections[item.key as keyof typeof workspaceSections]}
                onChange={(enabled) =>
                  setWorkspaceSections((prev) => ({ ...prev, [item.key]: enabled }))
                }
              />
            ))}
          </div>
        </div>

        {/* AI Saleslab sections */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 mb-4">AI Saleslab sections</h4>
          <div className="space-y-0.5">
            {aiSaleslabItems.map((item) => (
              <ToggleSwitch
                key={item.key}
                label={item.label}
                enabled={aiSaleslabSections[item.key as keyof typeof aiSaleslabSections]}
                onChange={(enabled) =>
                  setAiSaleslabSections((prev) => ({ ...prev, [item.key]: enabled }))
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lock Groups */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Lock Groups</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          If enabled, groups will be displayed in alphanumeric order, regardless of your selection.
        </p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={lockGroups}
            onChange={(e) => setLockGroups(e.target.checked)}
            className="h-5 w-5 accent-black focus:ring-black border-gray-300 rounded cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-900">Show Lock Groups</span>
        </label>
      </div>

      {/* Show Birthdays */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Show Birthdays</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          If enabled, the Contact Details page will include a birthday field.
        </p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showBirthdays}
            onChange={(e) => setShowBirthdays(e.target.checked)}
            className="h-5 w-5 accent-black focus:ring-black border-gray-300 rounded cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-900">Show Birthdays</span>
        </label>
      </div>

      {/* Show Home Close Date */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Show Home Close Date</h3>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          If enabled, the Contact Details page will include home close date fields.
        </p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showHomeCloseDate}
            onChange={(e) => setShowHomeCloseDate(e.target.checked)}
            className="h-5 w-5 accent-black focus:ring-black border-gray-300 rounded cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-900">Show Home Close Date</span>
        </label>
      </div>

      {/* Time Zone */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Time Zone</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-900">Select Time Zone</label>
          <div className="relative w-full sm:w-80">
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-white appearance-none pr-10"
            >
              {timeZones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      {/* ============================================================ */}
      {/* NEW THEME MODE SECTION - DITTO SAME AS UI DESIGN */}
      {/* ============================================================ */}
      <div className="border-t border-gray-100 pt-10">
        <h3 className="text-[18px] font-bold text-[#0E1011] mb-6">Theme Mode</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Light Mode Card */}
          <button
            onClick={() => setTheme('light')}
            className={`flex items-start gap-4 p-5 rounded-2xl border transition-all text-left ${
              theme === 'light' 
              ? 'bg-[#FEFCE8] border-[#FDE006] shadow-sm' 
              : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-50">
              <Sun size={24} className="text-gray-700" />
            </div>
            <div>
              <h4 className="text-[15px] font-semibold text-[#0E1011]">Light Mode</h4>
              <p className="text-[12px] text-[#848C94] mt-1">
                Bright and clean interface for daytime use
              </p>
            </div>
          </button>

          {/* Dark Mode Card */}
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-start gap-4 p-5 rounded-2xl border transition-all text-left ${
              theme === 'dark' 
              ? 'bg-[#FEFCE8] border-[#FDE006] shadow-sm' 
              : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-50">
              <Moon size={24} className="text-gray-700" />
            </div>
            <div>
              <h4 className="text-[15px] font-semibold text-[#0E1011]">Dark Mode</h4>
              <p className="text-[12px] text-[#848C94] mt-1">
                Reduced eye strain for low-light environments
              </p>
            </div>
          </button>
        </div>
      </div>
      {/* ============================================================ */}
    </div>
  );
};

export default Appearance;
