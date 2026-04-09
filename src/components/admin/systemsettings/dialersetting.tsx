import { useDialerSettings } from '@/hooks/useSystemSettings';
import { useEffect, useState } from 'react';
import { Loader2, Radio, BellRing, Info, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const DialerSetting = () => {
    const { data: dialerSettings, isLoading, updateDialerSettings } = useDialerSettings();
    const [voicemailMode, setVoicemailMode] = useState('auto');
    const [useAnswerTone, setUseAnswerTone] = useState(false);

    useEffect(() => {
        if (dialerSettings) {
            setVoicemailMode(dialerSettings.voicemailMode || 'auto');
            setUseAnswerTone(dialerSettings.useAnswerNotificationTone || false);
        }
    }, [dialerSettings]);

    const handleSave = () => {
        updateDialerSettings.mutate({
            voicemailMode,
            useAnswerNotificationTone: useAnswerTone,
        }, {
            onSuccess: () => {
                toast.success('Dialer settings updated successfully');
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dialer Settings</h1>
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
                {/* Voicemail Handling Card */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Radio className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Voicemail Handling</h2>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
                        Define how the dialer should interact when detecting a voicemail or answering machine.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label 
                            className={`relative flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all hover:border-yellow-400 group ${
                                voicemailMode === 'auto' 
                                ? 'border-yellow-400 bg-yellow-50/30 dark:bg-yellow-400/5' 
                                : 'border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[17px] font-bold ${voicemailMode === 'auto' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                    Auto Drop
                                </span>
                                <input 
                                    type="radio" 
                                    name="voicemailMode" 
                                    className="w-5 h-5 accent-yellow-400"
                                    checked={voicemailMode === 'auto'}
                                    onChange={() => setVoicemailMode('auto')}
                                />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                System automatically plays your pre-recorded message when a machine is detected.
                            </p>
                        </label>

                        <label 
                            className={`relative flex flex-col p-5 rounded-2xl border-2 cursor-pointer transition-all hover:border-yellow-400 group ${
                                voicemailMode === 'manual' 
                                ? 'border-yellow-400 bg-yellow-50/30 dark:bg-yellow-400/5' 
                                : 'border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[17px] font-bold ${voicemailMode === 'manual' ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                    Manual Drop
                                </span>
                                <input 
                                    type="radio" 
                                    name="voicemailMode" 
                                    className="w-5 h-5 accent-yellow-400"
                                    checked={voicemailMode === 'manual'}
                                    onChange={() => setVoicemailMode('manual')}
                                />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Give agents full control to manually drop voicemails or hang up.
                            </p>
                        </label>
                    </div>
                </div>

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
            </div>
        </div>
    );
};

export default DialerSetting;
