import { useState } from 'react';
import { Check } from 'lucide-react';
import emailIcon from '@/assets/emailIcon.png';
import bellIcon from '@/assets/bellIcon.png';

/* ---------- Types ---------- */

type ToggleKey =
  | 'failedPayment'
  | 'renewalReminders'
  | 'maintenanceNotices'
  | 'criticalErrors';

type EmailKey =
  | 'dailySummary'
  | 'weeklyReport'
  | 'newUser'
  | 'subscriptionChanges'
  | 'securityAlerts';

type ToggleProps = {
  active: boolean;
  onClick: () => void;
};

type CustomCheckboxProps = {
  active: boolean;
  onClick: () => void;
  label: string;
};

/* ---------- Component ---------- */

const NotificationSetting = () => {
  // State for Toggles
  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    failedPayment: true,
    renewalReminders: true,
    maintenanceNotices: false,
    criticalErrors: true,
  });

  // State for Checkboxes
  const [emails, setEmails] = useState<Record<EmailKey, boolean>>({
    dailySummary: true,
    weeklyReport: true,
    newUser: false,
    subscriptionChanges: true,
    securityAlerts: true,
  });

  const handleToggle = (key: ToggleKey) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckbox = (key: EmailKey) => {
    setEmails((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Custom Toggle Component
  const Toggle = ({ active, onClick }: ToggleProps) => (
    <button
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        active ? 'bg-[#030213]' : 'bg-[#DADBDB]'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
          active ? 'translate-x-[22px]' : 'translate-x-[2px]'
        }`}
      />
    </button>
  );

  // Custom Checkbox Component
  const CustomCheckbox = ({
    active,
    onClick,
    label,
  }: CustomCheckboxProps) => (
    <div
      className="flex items-center gap-5 cursor-pointer group"
      onClick={onClick}
    >
      <div
        className={`w-5 h-5 rounded-[2px] flex items-center justify-center transition-all border ${
          active
            ? 'bg-[#2B3034] border-[#333]'
            : 'bg-white border-gray-300'
        }`}
      >
        {active && (
          <Check className="text-white w-3.5 h-3.5" strokeWidth={2} />
        )}
      </div>
      <span className="text-[14px] work-sans font-[400] text-[#495057] group-hover:text-gray-800 transition-colors">
        {label}
      </span>
    </div>
  );

  return (
    <div className="bg-white p-4 work-sans md:px-8 md:py-[23px] rounded-[22px] shadow-sm w-full max-w-full mx-auto">
      <h2 className="text-[18px] font-[500] inter text-[#343434] mb-8">
        Notifications Settings
      </h2>

      {/* --- System Alerts Section --- */}
      <div className="mb-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-[#F4F4F5] p-1.5 rounded-lg">
            <img
              src={bellIcon}
              alt="bellIcon"
              className="h-[21.5] object-contain"
            />
          </div>
          <h3 className="font-[600] text-[18px] inter text-[#343434]">
            System Alerts
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-[500] text-[#34363B]">
                Failed Payment Alerts
              </h4>
              <p className="text-xs md:text-[16px] font-[400] text-[#828291]">
                Notify when customer payments fail
              </p>
            </div>
            <Toggle
              active={toggles.failedPayment}
              onClick={() => handleToggle('failedPayment')}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-[500] text-[#34363B]">
                Upcoming Renewal Reminders
              </h4>
              <p className="text-xs md:text-[16px] font-[400] text-[#828291]">
                Notify about scheduled maintenance
              </p>
            </div>
            <Toggle
              active={toggles.renewalReminders}
              onClick={() => handleToggle('renewalReminders')}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-[500] text-[#34363B]">
                Show Maintenance Notices
              </h4>
              <p className="text-xs md:text-[16px] font-[400] text-[#828291]">
                Notify about scheduled maintenance
              </p>
            </div>
            <Toggle
              active={toggles.maintenanceNotices}
              onClick={() => handleToggle('maintenanceNotices')}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-[500] text-[#34363B]">
                Critical Error Alerts
              </h4>
              <p className="text-xs md:text-[16px] font-[400] text-[#828291]">
                Immediate notification for system errors
              </p>
            </div>
            <Toggle
              active={toggles.criticalErrors}
              onClick={() => handleToggle('criticalErrors')}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1px] bg-gray-100 w-full mb-8" />

      {/* --- Email Notification Preferences Section --- */}
      <div>
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-[#F4F4F5] p-1.5 rounded-lg">
            <img
              src={emailIcon}
              alt="emailIcon"
              className="h-[21.5] object-contain"
            />
          </div>
          <h3 className="font-[600] text-[18px] inter text-[#34363B]">
            Email Notification Preferences
          </h3>
        </div>

        <div className="space-y-3.5 ml-3">
          <CustomCheckbox
            label="Daily activity summary"
            active={emails.dailySummary}
            onClick={() => handleCheckbox('dailySummary')}
          />
          <CustomCheckbox
            label="Weekly performance report"
            active={emails.weeklyReport}
            onClick={() => handleCheckbox('weeklyReport')}
          />
          <CustomCheckbox
            label="New user signups"
            active={emails.newUser}
            onClick={() => handleCheckbox('newUser')}
          />
          <CustomCheckbox
            label="Subscription changes and cancellations"
            active={emails.subscriptionChanges}
            onClick={() => handleCheckbox('subscriptionChanges')}
          />
          <CustomCheckbox
            label="Security and login alerts"
            active={emails.securityAlerts}
            onClick={() => handleCheckbox('securityAlerts')}
          />
        </div>
      </div>
    </div>
  );
};

export default NotificationSetting;
