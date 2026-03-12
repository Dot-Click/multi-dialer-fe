import React, { useState, useEffect } from "react";
import { FiX, FiChevronDown, FiPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import AddRecordingModal from "@/components/modal/addrecordingmodal";
import { useRecordings, type RecordingItem } from "@/hooks/useRecordings";
import { useCallSettings, useCallerIds, type CallerId } from "@/hooks/useSystemSettings";
import { useNavigate } from "react-router-dom";

// ── Reusable sub-components ──────────────────────────────────────────────────

const FieldWrapper = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="bg-[#F3F4F8] dark:bg-slate-800 rounded-xl px-4 py-3">
        <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
            {label}
        </label>
        {children}
    </div>
);

const SelectInput = ({
    value,
    onChange,
    children,
}: {
    value: string;
    onChange: (v: string) => void;
    children: React.ReactNode;
}) => (
    <div className="relative">
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent appearance-none text-[13px] font-semibold text-gray-700 dark:text-white outline-none pr-6 cursor-pointer"
        >
            {children}
        </select>
        <FiChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
    </div>
);

// ── Modal ────────────────────────────────────────────────────────────────────

interface CreateCallSettingModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedContacts: any[];
}

const CreateCallSettingModal: React.FC<CreateCallSettingModalProps> = ({ isOpen, onClose, selectedContacts }) => {
    const { data: existingSettings, createCallSettings, updateCallSettings } = useCallSettings();
    const { data: callerIdsData } = useCallerIds();
    const { getRecordings } = useRecordings();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [selectedCallerIds, setSelectedCallerIds] = useState<string[]>([]);
    const [countryCode, setCountryCode] = useState("US");
    const [noOfLines, setNoOfLines] = useState("1");
    const [onHoldRecording1, setOnHoldRecording1] = useState("");
    const [onHoldRecording2, setOnHoldRecording2] = useState("");
    const [ivrRecording, setIvrRecording] = useState("");
    const [answeringMachineRecording, setAnsweringMachineRecording] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAddRecordingOpen, setIsAddRecordingOpen] = useState(false);
    const [recordings, setRecordings] = useState<RecordingItem[]>([]);
    const [callerIds, setCallerIds] = useState<CallerId[]>([]);
    const [editId, setEditId] = useState<string | null>(null);

    // Initial fetch of recordings
    useEffect(() => {
        if (isOpen) {
            getRecordings().then(setRecordings);
        }
    }, [isOpen]);

    // Update local callerIds when data changes
    useEffect(() => {
        if (callerIdsData) setCallerIds(callerIdsData as CallerId[]);
    }, [callerIdsData]);

    // Pre-populate if settings already exist
    useEffect(() => {
        if (isOpen && existingSettings && existingSettings.length > 0) {
            const setting = existingSettings[0];
            setEditId(setting.id);
            setName(setting.label || "");
            // If callerId is stored as comma-separated string in DB
            if (setting.callerId) {
                setSelectedCallerIds(setting.callerId.split(",").map((s: string) => s.trim()));
            }
            setCountryCode(setting.countryCode || "US");
            setNoOfLines(String(setting.numberOfLines || 1));
            setOnHoldRecording1(setting.onHoldRecording1Id || "");
            setOnHoldRecording2(setting.onHoldRecording2Id || "");
            setIvrRecording(setting.ivrRecordingId || "");
            setAnsweringMachineRecording(setting.answeringMachineRecordingId || "");
        }
    }, [isOpen, existingSettings]);

    const resetForm = () => {
        if (!editId) {
            setName("");
            setSelectedCallerIds([]);
            setCountryCode("US");
            setNoOfLines("1");
            setOnHoldRecording1("");
            setOnHoldRecording2("");
            setIvrRecording("");
            setAnsweringMachineRecording("");
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };


    const handleSave = async () => {
        if (!name.trim()) {
            toast.error("Please enter a name for this setting.");
            return;
        }
        if (selectedCallerIds.length === 0) {
            toast.error("Please select at least one Caller ID.");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                label: name.trim(),
                callerId: selectedCallerIds.join(","), // Store as comma-separated
                countryCode,
                numberOfLines: parseInt(noOfLines),
                onHoldRecording1Id: onHoldRecording1 || undefined,
                onHoldRecording2Id: onHoldRecording2 || undefined,
                ivrRecordingId: ivrRecording || undefined,
                answeringMachineRecordingId: answeringMachineRecording || undefined,
            };

            if (editId) {
                await updateCallSettings.mutateAsync({ id: editId, data: payload as any });
                toast.success("Call Setting updated successfully!");
            } else {
                await createCallSettings.mutateAsync(payload as any);
                toast.success("Call Setting created successfully!");
            }


            navigate("/admin/contact-info", {
                state: { 
                    contacts: selectedContacts,
                    callerIds: selectedCallerIds,
                    numberOfLines: parseInt(noOfLines)
                }
            });


            handleClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || err?.message || "Failed to save Call Setting.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-9999 bg-black/30 backdrop-blur-[2px]"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white dark:bg-slate-900 w-full max-w-[520px] max-h-[92vh] rounded-[28px] shadow-2xl flex flex-col pointer-events-auto animate-in fade-in zoom-in duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100 dark:border-slate-800">
                        <h2 className="text-[18px] font-bold text-gray-800 dark:text-white">
                            {editId ? "Update Call Setting" : "Create Call Setting"}
                        </h2>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-1.5 bg-gray-100 dark:bg-slate-800 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FiX size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">

                        {/* Name */}
                        <FieldWrapper label="Name">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Main Office Line"
                                className="w-full bg-transparent text-[13px] font-semibold text-gray-700 dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600"
                            />
                        </FieldWrapper>

                        {/* Caller IDs (Multi-Select) */}
                        <FieldWrapper label="Caller IDs (Rotation List)">
                            <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar pr-1 mt-1">
                                {callerIds.length === 0 && <p className="text-[12px] text-gray-400 dark:text-gray-500 italic">No Caller IDs available</p>}
                                {callerIds.map((cid) => (
                                    <label key={cid.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-lg cursor-pointer transition-colors group">
                                        <input
                                            type="checkbox"
                                            checked={selectedCallerIds.includes(cid.twillioNumber || cid.id)}
                                            onChange={(e) => {
                                                const id = cid.twillioNumber || cid.id;
                                                if (e.target.checked) {
                                                    setSelectedCallerIds([...selectedCallerIds, id]);
                                                } else {
                                                    setSelectedCallerIds(selectedCallerIds.filter(v => v !== id));
                                                }
                                            }}
                                            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-yellow-500 focus:ring-yellow-500 cursor-pointer"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                                                {cid.label}
                                            </span>
                                            {cid.twillioNumber && (
                                                <span className="text-[11px] text-gray-400 dark:text-gray-500">{cid.twillioNumber}</span>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </FieldWrapper>

                        {/* Number of Lines */}
                        <FieldWrapper label="Max Calls per Caller ID (Rotation Threshold)">
                            <SelectInput value={noOfLines} onChange={setNoOfLines}>
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <option key={n} value={String(n)} className="dark:bg-slate-900">
                                        {n} {n === 1 ? "call" : "calls"} per ID
                                    </option>
                                ))}
                            </SelectInput>
                        </FieldWrapper>

                        {/* Divider */}
                        <div className="flex items-center gap-3 pt-2">
                            <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800" />
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Voice Recording Details
                            </span>
                            <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800" />
                        </div>

                        {/* Add Recording quick-action */}
                        <button
                            type="button"
                            onClick={() => setIsAddRecordingOpen(true)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-800 text-[12px] font-bold text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors"
                        >
                            <FiPlus size={14} />
                            Upload New Recording
                        </button>

                        {/* On-Hold 1 */}
                        <FieldWrapper label="On-Hold Recording 1">
                            <SelectInput value={onHoldRecording1} onChange={setOnHoldRecording1}>
                                <option value="" className="dark:bg-slate-900">None</option>
                                {recordings.map((r) => (
                                    <option key={r.id} value={r.id} className="dark:bg-slate-900">
                                        {r.name}
                                    </option>
                                ))}
                            </SelectInput>
                        </FieldWrapper>

                        {/* On-Hold 2 */}
                        <FieldWrapper label="On-Hold Recording 2">
                            <SelectInput value={onHoldRecording2} onChange={setOnHoldRecording2}>
                                <option value="" className="dark:bg-slate-900">None</option>
                                {recordings.map((r) => (
                                    <option key={r.id} value={r.id} className="dark:bg-slate-900">
                                        {r.name}
                                    </option>
                                ))}
                            </SelectInput>
                        </FieldWrapper>

                        {/* IVR */}
                        <FieldWrapper label="IVR Recording">
                            <SelectInput value={ivrRecording} onChange={setIvrRecording}>
                                <option value="" className="dark:bg-slate-900">None</option>
                                {recordings.map((r) => (
                                    <option key={r.id} value={r.id} className="dark:bg-slate-900">
                                        {r.name}
                                    </option>
                                ))}
                            </SelectInput>
                        </FieldWrapper>

                        {/* Answering Machine */}
                        <FieldWrapper label="Answering Machine Recording">
                            <SelectInput value={answeringMachineRecording} onChange={setAnsweringMachineRecording}>
                                <option value="" className="dark:bg-slate-900">None</option>
                                {recordings.map((r) => (
                                    <option key={r.id} value={r.id} className="dark:bg-slate-900">
                                        {r.name}
                                    </option>
                                ))}
                            </SelectInput>
                        </FieldWrapper>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-50 dark:border-slate-800 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-800 dark:text-white text-[14px] font-bold py-3.5 rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button onClick={
                            () => navigate("/contact-info", {
                                state: { 
                                    contacts: selectedContacts,
                                    callerIds: selectedCallerIds,
                                    numberOfLines: parseInt(noOfLines)
                                }
                            })
                        } className="bg-[#FECD56] hover:bg-[#F0D500] px-4 text-gray-900 text-[14px] font-extrabold py-3.5 rounded-2xl shadow-sm transition-all ">
                            Proceed without saving
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex-1 bg-[#FECD56] hover:bg-[#F0D500] text-gray-900 text-[14px] font-extrabold py-3.5 rounded-2xl shadow-sm transition-all disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : editId ? "Update Setting" : "Save Setting"}
                        </button>
                    </div>
                </div>
            </div >

            {/* Add Recording sub-modal */}
            {
                isAddRecordingOpen && (
                    <AddRecordingModal
                        onClose={() => setIsAddRecordingOpen(false)}
                        onSuccess={async () => {
                            const updated = await getRecordings();
                            setRecordings(updated);
                        }}
                    />
                )
            }
        </>
    );
};

export default CreateCallSettingModal;
