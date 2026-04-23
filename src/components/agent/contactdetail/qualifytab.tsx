import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateContact, setCurrentContactFields } from '@/store/slices/contactSlice';
import { Check, ClipboardCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const QualifyTab = () => {
    const dispatch = useAppDispatch();
    const { currentContact } = useAppSelector((state) => state.contacts);

    const QUAL_FIELDS = [
        { label: "Permission", key: "permission" as const },
        { label: "Want", key: "want" as const },
        { label: "Why", key: "why" as const },
        { label: "Status Quo", key: "statusQuo" as const },
        { label: "Timeline", key: "timeline" as const },
        { label: "Agent", key: "agent" as const },
    ];

    const handleToggleField = async (key: string, currentValue: boolean) => {
        if (!currentContact?.id) return;
        dispatch(setCurrentContactFields({ [key]: !currentValue }));
        try {
            await dispatch(updateContact({ id: currentContact.id, payload: { [key]: !currentValue } })).unwrap();
            toast.success(`${key} updated`);
        } catch (err: any) {
            dispatch(setCurrentContactFields({ [key]: currentValue }));
            toast.error("Failed to update");
        }
    };

    if (!currentContact) return null;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-slate-700">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                    <ClipboardCheck size={20} className="text-emerald-600 dark:text-emerald-500" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Dominios</h3>
                    <p className="text-xs text-gray-500">Track key milestones and assignments</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                {QUAL_FIELDS.map(f => {
                    const val = (currentContact as any)[f.key] || false;
                    return (
                        <div 
                            key={f.key} 
                            onClick={() => handleToggleField(f.key, val)}
                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all cursor-pointer group ${
                                val 
                                ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-500 shadow-sm" 
                                : "bg-white dark:bg-slate-800/50 border-gray-100 dark:border-slate-700 hover:border-gray-300"
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-all ${
                                val ? "bg-emerald-500 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-400 group-hover:text-gray-600"
                            }`}>
                                <Check size={20} className={val ? "stroke-[3px]" : "stroke-[2px]"} />
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-widest text-center ${
                                val ? "text-emerald-700 dark:text-emerald-400" : "text-gray-500"
                            }`}>
                                {f.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QualifyTab;
