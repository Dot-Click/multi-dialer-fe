import { useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { FiHelpCircle, FiChevronDown } from 'react-icons/fi';

// Types for components
interface SettingSectionProps {
  title: string;
  description: string;
  titleAddon?: ReactNode;
  children: ReactNode;
}

interface CustomCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface TimeSelectProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

// Reusable component for each setting section
const SettingSection = ({
  title,
  description,
  titleAddon,
  children,
}: SettingSectionProps) => (
  <div className="py-6 border-b border-gray-200 last:border-b-0">
    <div className="flex items-center gap-2 mb-1">
      <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      {titleAddon}
    </div>
    <p className="text-sm text-gray-500 mb-4 max-w-2xl">{description}</p>
    <div className="space-y-3">{children}</div>
  </div>
);

// Reusable Checkbox component
const CustomCheckbox = ({ id, label, checked, onChange }: CustomCheckboxProps) => (
  <div className="flex items-center">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded border-gray-300 text-gray-800 focus:ring-gray-500"
    />
    <label htmlFor={id} className="ml-3 text-sm text-gray-700">
      {label}
    </label>
  </div>
);

// Reusable Time Select component
const TimeSelect = ({ label, value, onChange }: TimeSelectProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs text-gray-500">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-32 appearance-none bg-gray-100 rounded-md py-2 px-3 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        {Array.from({ length: 24 }, (_, i) => (
          <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
            {`${i.toString().padStart(2, '0')}:00`}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  </div>
);

interface SettingsState {
  useTimeShield: boolean;
  useAnswerTone: boolean;
  deleteDisconnected: boolean;
  deleteFax: boolean;
  useSessionTimer: boolean;
  startTime: string;
  endTime: string;
}

// Main DialerSetting Component
const DialerSetting = () => {
  const [settings, setSettings] = useState<SettingsState>({
    useTimeShield: false,
    useAnswerTone: false,
    deleteDisconnected: false,
    deleteFax: false,
    useSessionTimer: false,
    startTime: '10:00',
    endTime: '18:00',
  });

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = event.target;
    setSettings((prev) => ({ ...prev, [id]: checked }));
  };

  const handleTimeChange =
    (key: keyof SettingsState) => (event: ChangeEvent<HTMLSelectElement>) => {
      setSettings((prev) => ({ ...prev, [key]: event.target.value }));
    };

  return (
    <div className="bg-white rounded-lg px-4 py-5 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Dialer Settings</h1>

        {/* Time Shield Section */}
        <SettingSection
          title="Time Shield"
          description="Time Shield prevents calls from being placed outside appropriate local hours. It checks each contact's time zone and ensures you only call within suitable times."
          titleAddon={
            <button className="text-gray-400 hover:text-gray-600">
              <FiHelpCircle size={16} />
            </button>
          }
        >
          <CustomCheckbox
            id="useTimeShield"
            label="Use Time Shield"
            checked={settings.useTimeShield}
            onChange={handleCheckboxChange}
          />
          {settings.useTimeShield && (
            <div className="flex items-center gap-4 pt-2 pl-7">
              <TimeSelect
                label="Start Time"
                value={settings.startTime}
                onChange={handleTimeChange('startTime')}
              />
              <TimeSelect
                label="End Time"
                value={settings.endTime}
                onChange={handleTimeChange('endTime')}
              />
            </div>
          )}
        </SettingSection>

        {/* Answer Notification Tone Section */}
        <SettingSection
          title="Answer Notification Tone"
          description="Plays a short sound when a live person answers. This lets you respond immediately and avoids any delay in your greeting — helpful when multitasking."
        >
          <CustomCheckbox
            id="useAnswerTone"
            label="Use Answer Notification Tone"
            checked={settings.useAnswerTone}
            onChange={handleCheckboxChange}
          />
        </SettingSection>

        {/* Auto-Remove Numbers Section */}
        <SettingSection
          title="Auto-Remove Disconnected or Fax Numbers"
          description="Enable this option to automatically delete numbers that are detected as disconnected or fax lines. This helps keep your contact list clean and up to date."
        >
          <CustomCheckbox
            id="deleteDisconnected"
            label="Delete disconnected numbers"
            checked={settings.deleteDisconnected}
            onChange={handleCheckboxChange}
          />
          <CustomCheckbox
            id="deleteFax"
            label="Delete fax numbers"
            checked={settings.deleteFax}
            onChange={handleCheckboxChange}
          />
        </SettingSection>

        {/* Call Session Timer Section */}
        <SettingSection
          title="Call Session Timer"
          description="Lets you set a time limit for your calling session. Helps you stay on schedule and manage your work time more efficiently."
        >
          <CustomCheckbox
            id="useSessionTimer"
            label="Use Call Session Timer"
            checked={settings.useSessionTimer}
            onChange={handleCheckboxChange}
          />
        </SettingSection>
      </div>
    </div>
  );
};

export default DialerSetting;
