import { useDialerSettings } from '@/hooks/useSystemSettings';
import { useEffect, useState } from 'react';
import { Loader2, BellRing, Info, Save, PhoneOff } from 'lucide-react';
import toast from 'react-hot-toast';



const DialerSetting = () => {
    const { data: dialerSettings, isLoading, updateDialerSettings } = useDialerSettings();
    const [useAnswerTone, setUseAnswerTone] = useState(false);
    const [amdEnabled, setAmdEnabled] = useState(false);

    useEffect(() => {
        if (dialerSettings) {
            setUseAnswerTone(dialerSettings.useAnswerNotificationTone || false);
            setAmdEnabled(dialerSettings.amdEnabled ?? false);
        }
    }, [dialerSettings]);

    const handleSave = () => {
        updateDialerSettings.mutate({
            useAnswerNotificationTone: useAnswerTone,
            amdEnabled,
        }, {
            onSuccess: () => {
                toast.success('Call settings updated successfully');
            },
            onError: (err: any) => {
                toast.error(err.response?.data?.message || 'Failed to update settings');
            }
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Call Settings</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure global behavior for the system dialer</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={updateDialerSettings.isPending}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 active:scale-95"
                >
                    {updateDialerSettings.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>Save Changes</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Answer Notification Card */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <BellRing className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Answer Notification Tone</h2>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    <Info className="w-4 h-4" />
                                    <span>Helpful for agents who are multitasking</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setUseAnswerTone(!useAnswerTone)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                                useAnswerTone ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-slate-700'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                                    useAnswerTone ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mt-6 max-w-2xl">
                        When enabled, a discrete beep will sound for the agent the moment a system detects a live person on the line.
                    </p>
                </div>

                {/* Voicemail Detection Card */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <PhoneOff className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Voicemail Detection (Skip on Machine)</h2>
                                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    <Info className="w-4 h-4" />
                                    <span>Applies to both power dialer and manual calls</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setAmdEnabled(!amdEnabled)}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 ${
                                amdEnabled ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-slate-700'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-md ${
                                    amdEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mt-6 max-w-2xl">
                        When enabled, calls answered by a machine will be skipped and the dialer will move to the next contact.
                    </p>

                    {amdEnabled && !dialerSettings?.answeringMachineRecordingId && (
                        <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
                            <Info className="w-4 h-4 mt-0.5 shrink-0" />
                            <span>Voicemail drop is disabled. Machine-answered calls will be skipped automatically.</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DialerSetting;
