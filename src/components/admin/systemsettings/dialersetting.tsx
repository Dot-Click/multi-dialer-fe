import { useDialerSettings } from '@/hooks/useSystemSettings';
import { useEffect, useState } from 'react';
import type { ChangeEvent, ReactNode } from 'react';
import { FiHelpCircle, FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';

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

// Reusable component for each setting section
const SettingSection = ({
    title,
    description,
    titleAddon,
    children,
}: SettingSectionProps) => (
    <div className="py-6 border-b border-gray-200 dark:border-slate-700 last:border-b-0">
        <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
            {titleAddon}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{description}</p>
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
            className="h-4 w-4 border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-200 focus:ring-gray-500 cursor-pointer dark:bg-slate-700"
            style={{ borderRadius: '2px' }}
        />
        <label htmlFor={id} className="ml-3 text-sm font-normal text-gray-900 dark:text-gray-300 cursor-pointer">
            {label}
        </label>
    </div>
);

// Reusable Time Select component
interface TimeSelectProps {
    label: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
}

const TimeSelect = ({ label, value, onChange, disabled = false }: TimeSelectProps) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-normal text-gray-500 dark:text-gray-400">{label}:</label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-32 appearance-none bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md py-2 pl-3 pr-8 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 disabled:bg-gray-100 dark:disabled:bg-slate-900 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
                {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                        {`${i.toString().padStart(2, '0')}:00`}
                    </option>
                ))}
            </select>
            <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
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
    const { data: remoteSettings, isLoading, updateDialerSettings } = useDialerSettings();
    const [settings, setSettings] = useState<SettingsState>({
        useTimeShield: false,
        useAnswerTone: false,
        deleteDisconnected: false,
        deleteFax: false,
        useSessionTimer: false,
        startTime: '10:00',
        endTime: '18:00',
    });

    useEffect(() => {
        if (remoteSettings) {
            setSettings({
                useTimeShield: remoteSettings.useTimeShield,
                useAnswerTone: remoteSettings.useAnswerNotificationTone,
                deleteDisconnected: remoteSettings.deleteDisconnectedNumbers,
                deleteFax: remoteSettings.deleteFaxNumbers,
                useSessionTimer: remoteSettings.useCallSessionTimer,
                startTime: remoteSettings.timeShieldStartTime || '10:00',
                endTime: remoteSettings.timeShieldEndTime || '18:00',
            });
        }
    }, [remoteSettings]);

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, checked } = event.target;
        setSettings((prev) => ({ ...prev, [id]: checked }));
    };

    const handleTimeChange =
        (key: keyof SettingsState) => (event: ChangeEvent<HTMLSelectElement>) => {
            setSettings((prev) => ({ ...prev, [key]: event.target.value }));
        };

    const handleSave = () => {
        updateDialerSettings.mutate({
            useTimeShield: settings.useTimeShield,
            useAnswerNotificationTone: settings.useAnswerTone,
            deleteDisconnectedNumbers: settings.deleteDisconnected,
            deleteFaxNumbers: settings.deleteFax,
            useCallSessionTimer: settings.useSessionTimer,
            timeShieldStartTime: settings.startTime,
            timeShieldEndTime: settings.endTime,
        }, {
            onSuccess: () => {
                toast.success('Settings saved successfully');
            },
            onError: (err: any) => {
                toast.error(err.response?.data?.message || 'Failed to save settings');
            }
        });
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading Dialer Settings...</div>;

    return (
        <div className="bg-gray-50 dark:bg-slate-900 min-h-screen p-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm w-full">
                <div className="px-6 py-5">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dialer Settings</h1>
                        <button
                            onClick={handleSave}
                            disabled={updateDialerSettings.isPending}
                            className="px-6 py-2 bg-[#FFCA06] text-black font-semibold rounded-md hover:bg-[#e6b605] transition-colors disabled:opacity-50"
                        >
                            {updateDialerSettings.isPending ? 'Saving...' : 'Save Settings'}
                        </button>
                    </div>

                    {/* Time Shield Section */}
                    <SettingSection
                        title="Time Shield"
                        description="Time Shield prevents calls from being placed outside appropriate local hours. It checks each contact's time zone and ensures you only call within suitable times."
                        titleAddon={
                            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
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
                        <div className="flex items-start gap-6 pt-2 pl-7">
                            <TimeSelect
                                label="Start Time"
                                value={settings.startTime}
                                onChange={handleTimeChange('startTime')}
                                disabled={!settings.useTimeShield}
                            />
                            <TimeSelect
                                label="End Time"
                                value={settings.endTime}
                                onChange={handleTimeChange('endTime')}
                                disabled={!settings.useTimeShield}
                            />
                        </div>
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
        </div>
    );
};

export default DialerSetting;
