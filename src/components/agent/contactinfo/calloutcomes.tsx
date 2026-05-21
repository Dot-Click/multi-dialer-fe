import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateContact } from "@/store/slices/contactSlice";
import { fetchDispositions, applyDisposition } from "@/store/slices/dispositionSlice";
import { fetchFolders } from "@/store/slices/contactStructureSlice";
import { Phone, User, Check, Loader2, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { ICON_MAP, COLOR_ACTIVE, COLOR_IDLE } from "../contactdetail/detail";

interface CallOutcomesProps {
    onNext?: () => void;
}

const SMART_VALUES = ["CONTACT", "NO_ANSWER", "BAD_NUMBER", "VOICEMAIL", "DNC_CONTACT", "DNC_NUMBER"];

const CallOutcomes = ({}: CallOutcomesProps) => {
    const dispatch = useAppDispatch();
    const { currentContact } = useAppSelector((state) => state.contacts);
    const { dispositions } = useAppSelector(s => s.dispositions);
    const { folders } = useAppSelector(s => s.contactStructure);

    const [selectedDisp, setSelectedDisp] = useState<string | null>(null);
    const [_, setSavedDisp] = useState<string | null>(null);
    const [savingDisp, setSavingDisp] = useState(false);

    // Folder popover state
    const [pendingDisp, setPendingDisp] = useState<{ id: string; label: string; value: string; targetFolderId: string | null | undefined } | null>(null);
    const [confirmFolderId, setConfirmFolderId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchDispositions());
        dispatch(fetchFolders());
    }, [dispatch]);

    useEffect(() => {
        if (currentContact) {
            const d = currentContact.disposition ?? null;
            setSelectedDisp(d);
            setSavedDisp(d);
        }
    }, [currentContact]);

    const activeDispositions = dispositions.filter(d => d.isActive);
    const smartItems = activeDispositions.filter(d => SMART_VALUES.includes(d.value.toUpperCase()));

    async function applyImmediate(id: string, label: string, value: string) {
        if (!currentContact?.id) return;
        setSelectedDisp(value);
        setSavingDisp(true);
        try {
            await dispatch(updateContact({ id: currentContact.id, payload: { disposition: value } })).unwrap();
            await dispatch(applyDisposition({ contactId: currentContact.id, dispositionId: id, source: "CALL" }));
            setSavedDisp(value);
            toast.success(`Disposition set: ${label}`);
        } catch (err: any) {
            toast.error("Failed to update disposition: " + err);
        } finally {
            setSavingDisp(false);
        }
    }

    function handleClick(d: typeof activeDispositions[number]) {
        if (!currentContact?.id) return;
        if (!d.targetFolderId) {
            // No folder → apply immediately
            applyImmediate(d.id, d.label, d.value);
        } else {
            // Has target folder → show confirm row
            setPendingDisp({ id: d.id, label: d.label, value: d.value, targetFolderId: d.targetFolderId });
            setConfirmFolderId(d.targetFolderId);
        }
    }

    async function handleConfirmApply() {
        if (!currentContact?.id || !pendingDisp) return;
        setSavingDisp(true);
        try {
            await dispatch(updateContact({ id: currentContact.id, payload: { disposition: pendingDisp.value } })).unwrap();
            await dispatch(applyDisposition({
                contactId: currentContact.id,
                dispositionId: pendingDisp.id,
                overrideFolderId: confirmFolderId || undefined,
                source: "CALL"
            }));
            setSelectedDisp(pendingDisp.value);
            setSavedDisp(pendingDisp.value);
            const folderName = folders?.find(f => f.id === confirmFolderId)?.name;
            toast.success(`Disposition: ${pendingDisp.label}${folderName ? ` - Moved to ${folderName}` : ""}`);
        } catch (err: any) {
            toast.error("Failed: " + err);
        } finally {
            setSavingDisp(false);
            setPendingDisp(null);
            setConfirmFolderId(null);
        }
    }

    if (!currentContact) return null;

    return (
        <div className="flex flex-col gap-3 p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 w-full">
            <div className="flex items-center gap-2 px-2 py-1 border-b border-gray-50 dark:border-slate-700/50 mb-1">
                <Phone size={12} className="text-gray-400 dark:text-gray-500" />
                <h1 className='text-[10px] font-black uppercase tracking-widest text-gray-400'>Outcomes</h1>
            </div>

            <div className="grid grid-cols-2 gap-1.5 px-1">
                {smartItems.map(d => {
                    const Icon = ICON_MAP[d.icon] ?? User;
                    const isPending = pendingDisp?.value === d.value;
                    const isActive = selectedDisp === d.value;
                    return (
                        <button
                            key={d.id}
                            onClick={() => handleClick(d)}
                            disabled={savingDisp}
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[9px] rounded-full border font-black tracking-wide transition-all duration-150 active:scale-95 ${isActive || isPending
                                ? (COLOR_ACTIVE[d.color] || COLOR_ACTIVE.red)
                                : (COLOR_IDLE[d.color] || COLOR_IDLE.red)
                                }`}
                        >
                            <Icon className="w-3 h-3 shrink-0" />
                            <span className="truncate">{d.label.toUpperCase()}</span>
                        </button>
                    );
                })}
            </div>

            {/* Folder Confirmation Row */}
            {pendingDisp && (
                <div className="flex flex-col gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
                    <div className="flex items-center gap-1.5 text-[10px] text-blue-700 dark:text-blue-300 font-semibold">
                        <Tag className="w-3 h-3 shrink-0" />
                        Move to: <span className="font-bold">{folders?.find(f => f.id === confirmFolderId)?.name || "(none)"}</span>
                    </div>
                    <select
                        value={confirmFolderId || ""}
                        onChange={e => setConfirmFolderId(e.target.value || null)}
                        className="h-7 px-2 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-slate-800 text-xs text-gray-700 dark:text-gray-200 focus:outline-none"
                    >
                        <option value="">No folder</option>
                        {folders?.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                    <div className="flex gap-1.5 justify-end">
                        <button
                            onClick={() => { setPendingDisp(null); setConfirmFolderId(null); }}
                            className="px-3 py-1 text-[10px] rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-500 uppercase font-black"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmApply}
                            disabled={savingDisp}
                            className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-black rounded-lg bg-blue-600 hover:bg-blue-700 text-white uppercase"
                        >
                            {savingDisp ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Check className="w-3 h-3" /> Confirm</>}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CallOutcomes;
