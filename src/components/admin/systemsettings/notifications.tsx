// import React, { useState } from 'react';
// import { FiCheck } from 'react-icons/fi';

// interface ToggleSwitchProps {
//   enabled: boolean;
//   onChange: (enabled: boolean) => void;
//   label: string;
// }

// const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label }) => (
//   <div className="flex items-center gap-3 py-2.5">
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
//     <span className="text-sm  font-medium text-gray-900">{label}</span>
//   </div>
// );

// const Notifications: React.FC = () => {
//   // Appointment Reminder Emails state
//   const [appointmentReminderEnabled, setAppointmentReminderEnabled] = useState(false);
//   const [appointmentReminderEmail, setAppointmentReminderEmail] = useState('');
//   const [appointmentReminderSaved, setAppointmentReminderSaved] = useState(false);

//   // Daily Call Reports state
//   const [callActivityReportEnabled, setCallActivityReportEnabled] = useState(false);
//   const [sessionSummaryReportEnabled, setSessionSummaryReportEnabled] = useState(false);
//   const [includeAgentsNoActivityEnabled, setIncludeAgentsNoActivityEnabled] = useState(false);
//   const [dailyReportsEmail, setDailyReportsEmail] = useState('email@example.com');
//   const [dailyReportsSaved, setDailyReportsSaved] = useState(true);

//   // In-App Notifications state
//   const [appointmentNotificationsEnabled, setAppointmentNotificationsEnabled] = useState(false);
//   const [complianceAlertsEnabled, setComplianceAlertsEnabled] = useState(false);

//   const handleSaveAppointmentReminder = () => {
//     setAppointmentReminderSaved(true);
//     setTimeout(() => setAppointmentReminderSaved(false), 3000);
//   };

//   const handleSaveDailyReports = () => {
//     setDailyReportsSaved(true);
//     setTimeout(() => setDailyReportsSaved(false), 3000);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8 mt-6">
//       {/* <h2 className="text-xl font-bold text-gray-900 mb-6">Notifications</h2> */}

//       {/* Email Notifications Section */}
//       <div className="mb-8">
//         <h3 className="text-lg font-bold text-gray-900 mb-6">Email Notifications</h3>

//         {/* Appointment Reminder Emails */}
//         <div className="mb-8">
//           <h4 className="text-base font-semibold text-gray-900 mb-2">Appointment Reminder Emails</h4>
//           <p className="text-sm text-gray-600 mb-4 leading-relaxed">
//             Sends an email notification one hour before any scheduled appointment or follow-up call. Helps you stay on time and never miss a planned conversation.
//           </p>
          
//           <div className="mb-4">
//             <ToggleSwitch
//               label="Enable"
//               enabled={appointmentReminderEnabled}
//               onChange={setAppointmentReminderEnabled}
//             />
//           </div>

//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
//             <label className="text-sm font-medium text-gray-900 whitespace-nowrap">Send to</label>
//             <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
//               <input
//                 type="email"
//                 value={appointmentReminderEmail}
//                 onChange={(e) => setAppointmentReminderEmail(e.target.value)}
//                 placeholder="Enter email"
//                 className="flex-1 w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-white"
//               />
//               <button
//                 type="button"
//                 onClick={handleSaveAppointmentReminder}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors whitespace-nowrap"
//               >
//                 Save
//               </button>
//             </div>
//           </div>

//           {appointmentReminderSaved && (
//             <div className="mt-3 flex items-center gap-2 text-green-600">
//               <FiCheck size={18} />
//               <span className="text-sm">Changes saved</span>
//             </div>
//           )}
//         </div>

//         {/* Daily Call Reports */}
//         <div>
//           <h4 className="text-base font-semibold text-gray-900 mb-2">Daily Call Reports</h4>
//           <p className="text-sm text-gray-600 mb-4 leading-relaxed">
//             Receive a daily summary of your team's calling activity by email. Choose which reports to include, where to send them, and whether to show agents with no activity. Emails are delivered the following day at 8:00 AM.
//           </p>

//           <div className="mb-4 space-y-0.5">
//             <ToggleSwitch
//               label="Enable Call Activity Report"
//               enabled={callActivityReportEnabled}
//               onChange={setCallActivityReportEnabled}
//             />
//             <ToggleSwitch
//               label="Enable Session Summary Report"
//               enabled={sessionSummaryReportEnabled}
//               onChange={setSessionSummaryReportEnabled}
//             />
//             <ToggleSwitch
//               label="Enable Include Agents with No Activity"
//               enabled={includeAgentsNoActivityEnabled}
//               onChange={setIncludeAgentsNoActivityEnabled}
//             />
//           </div>

//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
//             <label className="text-sm font-medium text-gray-900 whitespace-nowrap">Send to</label>
//             <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
//               <input
//                 type="email"
//                 value={dailyReportsEmail}
//                 onChange={(e) => setDailyReportsEmail(e.target.value)}
//                 className="flex-1 w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-white"
//               />
//               <button
//                 type="button"
//                 onClick={handleSaveDailyReports}
//                 className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors whitespace-nowrap"
//               >
//                 Save
//               </button>
//             </div>
//           </div>

//           {dailyReportsSaved && (
//             <div className="mt-3 flex items-center gap-2 text-green-600">
//               <FiCheck size={18} />
//               <span className="text-sm">Changes saved</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* In-App Notifications Section */}
//       <div>
//         <h3 className="text-lg font-bold text-gray-900 mb-6">In-App Notifications</h3>

//         {/* Appointment Notifications */}
//         <div className="mb-8">
//           <h4 className="text-base font-semibold text-gray-900 mb-2">Appointment Notifications</h4>
//           <p className="text-sm text-gray-600 mb-4 leading-relaxed">
//             If enabled, you'll receive notifications for each appointment scheduled for today.
//           </p>
//           <ToggleSwitch
//             label="Enable"
//             enabled={appointmentNotificationsEnabled}
//             onChange={setAppointmentNotificationsEnabled}
//           />
//         </div>

//         {/* Compliance Alerts */}
//         <div>
//           <h4 className="text-base font-semibold text-gray-900 mb-2">Compliance Alerts</h4>
//           <p className="text-sm text-gray-600 mb-4 leading-relaxed">
//             Receive notifications for compliance-related issues such as DNC (Do Not Call) restrictions or call errors.
//           </p>
//           <ToggleSwitch
//             label="Enable"
//             enabled={complianceAlertsEnabled}
//             onChange={setComplianceAlertsEnabled}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Notifications;




import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label }) => (
  <div className="flex items-center gap-3 py-2 cursor-pointer group" onClick={() => onChange(!enabled)}>
    <button
      type="button"
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-black' : 'bg-[#E5E7EB]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
    <span className="text-[14px] font-medium text-[#0E1011]">{label}</span>
  </div>
);

const Notifications: React.FC = () => {
  const [appointmentReminderEnabled, setAppointmentReminderEnabled] = useState(false);
  const [appointmentReminderEmail, setAppointmentReminderEmail] = useState('');
  
  const [callActivityReportEnabled, setCallActivityReportEnabled] = useState(false);
  const [sessionSummaryReportEnabled, setSessionSummaryReportEnabled] = useState(false);
  const [includeAgentsNoActivityEnabled, setIncludeAgentsNoActivityEnabled] = useState(false);
  
  const [appointmentNotificationsEnabled, setAppointmentNotificationsEnabled] = useState(false);
  const [complianceAlertsEnabled, setComplianceAlertsEnabled] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto bg-white p-4 md:p-10 font-sans text-[#0E1011]">
      
      {/* Email Notifications Section */}
      <section className="mb-12">
        <h2 className="text-[18px] font-bold mb-8">Email Notifications</h2>

        {/* Appointment Reminder Emails */}
        <div className="mb-10">
          <h3 className="text-[15px] font-bold mb-1">Appointment Reminder Emails</h3>
          <p className="text-[13px] text-[#848C94] leading-relaxed max-w-2xl mb-4">
            Sends an email notification one hour before any scheduled appointment or follow-up call. 
            Helps you stay on time and never miss a planned conversation.
          </p>
          <ToggleSwitch label="Enable" enabled={appointmentReminderEnabled} onChange={setAppointmentReminderEnabled} />
          
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-4 border-b border-[#E5E7EB] pb-1 min-w-[280px] group focus-within:border-black transition-colors">
              <label className="text-[13px] font-bold whitespace-nowrap">Send to</label>
              <input
                type="email"
                placeholder="Enter email"
                className="bg-transparent outline-none text-[13px] w-full"
                value={appointmentReminderEmail}
                onChange={(e) => setAppointmentReminderEmail(e.target.value)}
              />
            </div>
            <button className="bg-[#F3F4F6] text-[#0E1011] text-[13px] font-semibold px-5 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              Save
            </button>
          </div>
        </div>

        {/* Daily Call Reports */}
        <div className="mb-10 pt-4">
          <h3 className="text-[15px] font-bold mb-1">Daily Call Reports</h3>
          <p className="text-[13px] text-[#848C94] leading-relaxed max-w-2xl mb-4">
            Receive a daily summary of your team's calling activity by email. Choose which reports to include, 
            where to send them, and whether to show agents with no activity. Emails are delivered the following day at 8:00 AM.
          </p>
          
          <div className="space-y-1">
            <ToggleSwitch label="Enable Call Activity Report" enabled={callActivityReportEnabled} onChange={setCallActivityReportEnabled} />
            <ToggleSwitch label="Enable Session Summary Report" enabled={sessionSummaryReportEnabled} onChange={setSessionSummaryReportEnabled} />
            <ToggleSwitch label="Enable Include Agents with No Activity" enabled={includeAgentsNoActivityEnabled} onChange={setIncludeAgentsNoActivityEnabled} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center gap-4 border-b border-[#E5E7EB] pb-1 min-w-[280px]">
              <label className="text-[13px] font-bold whitespace-nowrap">Send to</label>
              <input
                type="email"
                defaultValue="email@example.com"
                className="bg-transparent outline-none text-[13px] w-full"
              />
            </div>
            <div className="flex items-center gap-2 text-[#10B981]">
              <FiCheck className="stroke-[3px]" size={16} />
              <span className="text-[13px] font-medium">Changes saved</span>
            </div>
          </div>
        </div>
      </section>

      {/* In-App Notifications Section */}
      <section className="border-t border-gray-100 pt-10">
        <h2 className="text-[18px] font-bold mb-8">In-App Notifications</h2>

        {/* Appointment Notifications */}
        <div className="mb-10">
          <h3 className="text-[15px] font-bold mb-1">Appointment Notifications</h3>
          <p className="text-[13px] text-[#848C94] leading-relaxed max-w-2xl mb-4">
            If enabled, you'll receive notifications for each appointment scheduled for today.
          </p>
          <ToggleSwitch label="Enable" enabled={appointmentNotificationsEnabled} onChange={setAppointmentNotificationsEnabled} />
        </div>

        {/* Compliance Alerts */}
        <div className="mb-10">
          <h3 className="text-[15px] font-bold mb-1">Compliance Alerts</h3>
          <p className="text-[13px] text-[#848C94] leading-relaxed max-w-2xl mb-4">
            Receive notifications for compliance-related issues such as DNC (Do Not Call) restrictions or call errors.
          </p>
          <ToggleSwitch label="Enable" enabled={complianceAlertsEnabled} onChange={setComplianceAlertsEnabled} />
        </div>
      </section>
    </div>
  );
};

export default Notifications;