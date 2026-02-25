import { useNotificationSettings } from '@/hooks/useSystemSettings';
import React, { useEffect, useState } from 'react';
// import { FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, label }) => (
    <div className="flex items-center gap-3 py-2 cursor-pointer group" onClick={() => onChange(!enabled)}>
        <button
            type="button"
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 focus:outline-none ${enabled ? 'bg-black' : 'bg-[#E5E7EB]'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-1'
                    }`}
            />
        </button>
        <span className="text-[14px] font-medium text-[#0E1011]">{label}</span>
    </div>
);

const Notifications: React.FC = () => {
    const { data: remoteSettings, isLoading, updateNotificationSettings } = useNotificationSettings();
    const [appointmentReminderEnabled, setAppointmentReminderEnabled] = useState(false);
    const [appointmentReminderEmail, setAppointmentReminderEmail] = useState('');

    const [callActivityReportEnabled, setCallActivityReportEnabled] = useState(false);
    const [sessionSummaryReportEnabled, setSessionSummaryReportEnabled] = useState(false);
    const [includeAgentsNoActivityEnabled, setIncludeAgentsNoActivityEnabled] = useState(false);
    const [dailyReportEmail, setDailyReportEmail] = useState('');

    const [appointmentNotificationsEnabled, setAppointmentNotificationsEnabled] = useState(false);
    const [complianceAlertsEnabled, setComplianceAlertsEnabled] = useState(false);

    useEffect(() => {
        if (remoteSettings) {
            setAppointmentReminderEnabled(remoteSettings.enableAppointmentReminders);
            setAppointmentReminderEmail(remoteSettings.appointmentReminderEmail || '');
            setCallActivityReportEnabled(remoteSettings.enableCallActivityReport);
            setSessionSummaryReportEnabled(remoteSettings.enableSessionSummaryReport);
            setIncludeAgentsNoActivityEnabled(remoteSettings.includeAgentsWithNoActivity);
            setDailyReportEmail(remoteSettings.dailyCallReportEmail || '');
            setAppointmentNotificationsEnabled(remoteSettings.enableAppointmentNotifications);
            setComplianceAlertsEnabled(remoteSettings.enableComplianceAlerts);
        }
    }, [remoteSettings]);

    const handleSave = () => {
        updateNotificationSettings.mutate({
            enableAppointmentReminders: appointmentReminderEnabled,
            appointmentReminderEmail,
            enableCallActivityReport: callActivityReportEnabled,
            enableSessionSummaryReport: sessionSummaryReportEnabled,
            includeAgentsWithNoActivity: includeAgentsNoActivityEnabled,
            dailyCallReportEmail: dailyReportEmail,
            enableAppointmentNotifications: appointmentNotificationsEnabled,
            enableComplianceAlerts: complianceAlertsEnabled
        }, {
            onSuccess: () => {
                toast.success('Notification settings saved');
            },
            onError: (err: any) => {
                toast.error(err.response?.data?.message || 'Failed to save settings');
            }
        });
    };

    if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Notification Settings...</div>;

    return (
        <div className="w-full max-w-5xl mx-auto bg-white p-4 md:p-10 font-sans text-[#0E1011]">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Notification Settings</h1>
                <button
                    onClick={handleSave}
                    disabled={updateNotificationSettings.isPending}
                    className="bg-[#FFCA06] text-[#0E1011] text-[13px] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#e6b605] transition-colors disabled:opacity-50"
                >
                    {updateNotificationSettings.isPending ? 'Saving...' : 'Save All Changes'}
                </button>
            </div>

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
                                placeholder="email@example.com"
                                value={dailyReportEmail}
                                onChange={(e) => setDailyReportEmail(e.target.value)}
                                className="bg-transparent outline-none text-[13px] w-full"
                            />
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
