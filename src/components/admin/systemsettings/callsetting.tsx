import { useEffect, useRef, useState } from 'react';
import { FiPlus, FiSearch, FiMoreHorizontal, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { BiSortAlt2 } from 'react-icons/bi';
import { useCallSettings } from '@/hooks/useSystemSettings';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// ✅ Interfaces for type safety
interface ToggleSwitchProps {
    enabled: boolean;
    setEnabled: (val: boolean) => void;
}

// ✅ Toggle Switch Component
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, setEnabled }) => (
    <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${enabled ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-slate-600'
            }`}
    >
        <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-1'
                }`}
        />
    </button>
);

// ✅ Row action menu — Edit / Delete
const RowActionsMenu: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="text-gray-500 dark:text-gray-400 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full"
            >
                <FiMoreHorizontal size={20} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-10">
                    <button
                        onClick={() => { setOpen(false); onEdit(); }}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <FiEdit2 size={14} /> Edit
                    </button>
                    <button
                        onClick={() => { setOpen(false); onDelete(); }}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <FiTrash2 size={14} /> Delete
                    </button>
                </div>
            )}
        </div>
    );
};

// ✅ Card Component — single responsive layout (grid collapses to a stacked
// card on small screens instead of duplicating the JSX per breakpoint).
const NumberCard: React.FC<{ data: any }> = ({ data }) => {
    const navigate = useNavigate();
    const { updateCallSettings, deleteCallSettings } = useCallSettings();
    const [isAutoPause, setIsAutoPause] = useState<boolean>(data.enableAutoPause);

    const handleToggleAutoPause = (enabled: boolean) => {
        setIsAutoPause(enabled);
        updateCallSettings.mutate({
            id: data.id,
            data: { enableAutoPause: enabled }
        });
    };

    const handleEdit = () => {
        navigate(`/admin/create-setting/${data.id}`);
    };

    const handleDelete = () => {
        if (!window.confirm(`Delete "${data.label || 'this setting'}"? This cannot be undone.`)) return;
        deleteCallSettings.mutate(data.id, {
            onSuccess: () => toast.success('Call Setting deleted.'),
            onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || 'Failed to delete setting.'),
        });
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-4 transition hover:shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_1fr_1fr_auto_auto] gap-4 items-center text-sm">
                {/* Name + caller ID(s) */}
                <div className="min-w-0 sm:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-2 mb-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 dark:text-white truncate">{data.label || 'Unnamed'}</h3>
                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 shrink-0">
                            Healthy
                        </span>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs truncate">{data.callerId || 'No ID'}</p>
                </div>

                <div className="min-w-0">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Country</p>
                    <p className="font-medium text-gray-800 dark:text-gray-300 truncate">{data.countryCode || 'N/A'}</p>
                </div>

                <div className="min-w-0">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Added on</p>
                    <p className="font-medium text-gray-800 dark:text-gray-300 whitespace-nowrap">{new Date(data.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Auto Pause</p>
                    <ToggleSwitch enabled={isAutoPause} setEnabled={handleToggleAutoPause} />
                </div>

                <div className="flex justify-end sm:col-span-2 lg:col-span-1">
                    <RowActionsMenu onEdit={handleEdit} onDelete={handleDelete} />
                </div>
            </div>
        </div>
    );
};

// ✅ Main Component
const CallSetting: React.FC = () => {
    const { data: callSettings, isLoading, isError, error } = useCallSettings();

    if (isLoading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading Dialer Settings...</div>;
    if (isError) return <div className="p-8 text-center text-red-500 dark:text-red-400">Error: {(error as any)?.message || 'Failed to fetch settings'}</div>;

    return (
        <div className="bg-white dark:bg-slate-900 min-h-screen px-4 py-5 rounded-lg">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dialer Setting</h1>
                    <Link
                        to="/admin/create-setting"
                        className="w-full sm:w-auto bg-[#FFCA06] hover:bg-[#FECD56] text-gray-900 font-bold py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all active:scale-95 shadow-sm"
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
                    <button className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"><BiSortAlt2 size={18} /> Sort by</button>
                </div>
                <div className="space-y-4">
                    {callSettings?.length === 0 ? (
                        <div className="text-center py-10 border border-dashed border-gray-300 dark:border-slate-700 rounded-xl"><p className="text-gray-500 dark:text-gray-400">No Dialer Settings found.</p></div>
                    ) : (
                        callSettings?.map((setting: any) => <NumberCard key={setting.id} data={setting} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default CallSetting;
