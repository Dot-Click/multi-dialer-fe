import { useState } from 'react';
import { FiPlus, FiSearch, FiMoreHorizontal } from 'react-icons/fi';
import { BiSortAlt2 } from 'react-icons/bi';
import { useCallSettings } from '@/hooks/useSystemSettings';
import { Link } from 'react-router-dom';

// ✅ Interfaces for type safety
interface ToggleSwitchProps {
    enabled: boolean;
    setEnabled: (val: boolean) => void;
}

// ✅ Toggle Switch Component
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, setEnabled }) => (
    <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-11 rounded-full transition-all duration-200 ${enabled ? 'bg-gray-800' : 'bg-gray-300 dark:bg-slate-700'
            }`}
    >
        <span
            className={`inline-block h-5 w-5 bg-white dark:bg-slate-200 rounded-full shadow transform transition duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
        />
    </button>
);

// ✅ Card Component
const NumberCard: React.FC<{ data: any }> = ({ data }) => {
    const { updateCallSettings } = useCallSettings();
    const [isAutoPause, setIsAutoPause] = useState<boolean>(data.enableAutoPause);

    const handleToggleAutoPause = (enabled: boolean) => {
        setIsAutoPause(enabled);
        updateCallSettings.mutate({
            id: data.id,
            data: { enableAutoPause: enabled }
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 transition hover:shadow-md">
            <div className="hidden lg:grid grid-cols-6 gap-6 items-center text-sm">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white">{data.label || 'Unnamed'}</h3>
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800`}>
                            Healthy
                        </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{data.callerId || 'No ID'}</p>
                </div>
                <div><p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Country</p><p className="font-medium text-gray-800 dark:text-gray-300">{data.countryCode || 'N/A'}</p></div>
                <div><p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Added on</p><p className="font-medium text-gray-800 dark:text-gray-300">{new Date(data.createdAt).toLocaleDateString()}</p></div>
                <div><p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Auto Pause</p><li className="list-none"><ToggleSwitch enabled={isAutoPause} setEnabled={handleToggleAutoPause} /></li></div>
                <div className="col-span-2 flex justify-end"><button className="text-gray-500 dark:text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"><FiMoreHorizontal size={20} /></button></div>
            </div>
            <div className="lg:hidden flex flex-col gap-4 text-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800 dark:text-white">{data.label}</h3>
                            <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">Healthy</span>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">{data.callerId}</p>
                    </div>
                    <button className="text-gray-500 dark:text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"><FiMoreHorizontal size={20} /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Country</p><p className="font-medium dark:text-gray-300">{data.countryCode}</p></div>
                    <div><p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Added on</p><p className="font-medium dark:text-gray-300">{new Date(data.createdAt).toLocaleDateString()}</p></div>
                    <div><p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Auto Pause</p><ToggleSwitch enabled={isAutoPause} setEnabled={handleToggleAutoPause} /></div>
                </div>
            </div>
        </div>
    );
};

// ✅ Main Component
const CallSetting: React.FC = () => {
    const { data: callSettings, isLoading, isError, error } = useCallSettings();

    if (isLoading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading Call Settings...</div>;
    if (isError) return <div className="p-8 text-center text-red-500 dark:text-red-400">Error: {(error as any)?.message || 'Failed to fetch settings'}</div>;

    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen px-4 py-5 rounded-lg">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Call Settings</h1>
                    <Link
                        to="/admin/create-setting"
                        className="w-full sm:w-auto bg-yellow-400 text-black font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-yellow-500 transition"
                    >
                        <FiPlus size={18} />
                        Add Setting
                    </Link>
                </header>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full sm:w-auto sm:grow max-w-sm">
                        <input type="text" placeholder="Search by phone number" className="w-full pl-4 pr-11 py-2.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm dark:text-white dark:placeholder-gray-500" />
                        <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                    </div>
                    <button className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors pointer-cursor"><BiSortAlt2 size={18} /> Sort by</button>
                </div>
                <div className="space-y-6">
                    {callSettings?.length === 0 ? (
                        <div className="text-center py-10 border border-dashed border-gray-300 dark:border-slate-700 rounded-xl"><p className="text-gray-500 dark:text-gray-400">No Call Settings found.</p></div>
                    ) : (
                        callSettings?.map((setting: any) => <NumberCard key={setting.id} data={setting} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default CallSetting;
