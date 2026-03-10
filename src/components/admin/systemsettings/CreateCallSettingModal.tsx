import React, { useState, useEffect } from "react";
import { FiX, FiChevronDown, FiPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import AddRecordingModal from "@/components/modal/addrecordingmodal";
import { useRecordings, type RecordingItem } from "@/hooks/useRecordings";
import { useCallSettings, useCallerIds, type CallerId } from "@/hooks/useSystemSettings";
import { useNavigate } from "react-router-dom";

// ── Reusable sub-components ──────────────────────────────────────────────────

const FieldWrapper = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="bg-[#F3F4F8] rounded-xl px-4 py-3">
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
            className="w-full bg-transparent appearance-none text-[13px] font-semibold text-gray-700 outline-none pr-6 cursor-pointer"
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
    const [callerId, setCallerId] = useState("");
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
            setCallerId(setting.callerId || "");
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
            setCallerId("");
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
        if (!callerId) {
            toast.error("Please select a Caller ID.");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                label: name.trim(),
                callerId,
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
                state: { contacts: selectedContacts }
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
                    className="bg-white w-full max-w-[520px] max-h-[92vh] rounded-[28px] shadow-2xl flex flex-col pointer-events-auto animate-in fade-in zoom-in duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100">
                        <h2 className="text-[18px] font-bold text-gray-800">
                            {editId ? "Update Call Setting" : "Create Call Setting"}
                        </h2>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="p-1.5 bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FiX size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">

                        {/* Name */}
                        <FieldWrapper label="Name">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Main Office Line"
                                className="w-full bg-transparent text-[13px] font-semibold text-gray-700 outline-none placeholder:text-gray-300"
                            />
                        </FieldWrapper>

                        {/* Caller ID */}
                        <FieldWrapper label="Caller ID">
                            <SelectInput value={callerId} onChange={setCallerId}>
                                <option value="">Select Caller ID</option>
                                {callerIds.map((cid) => (
                                    <option key={cid.id} value={cid.twillioNumber || cid.id}>
                                        {cid.label} {cid.twillioNumber ? `(${cid.twillioNumber})` : ""}
                                    </option>
                                ))}
                            </SelectInput>
                        </FieldWrapper>

                        {/* Number of Lines */}
                        <FieldWrapper label="Number of Lines">
                            <SelectInput value={noOfLines} onChange={setNoOfLines}>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((n) => (
                                    <option key={n} value={String(n)}>
                                        {n} {n === 1 ? "line" : "lines"}
                                    </option>
                                ))}
                            </SelectInput>
                        </FieldWrapper>

                        {/* Divider */}
                        <div className="flex items-center gap-3 pt-2">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                                Voice Recording Details
                            </span>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>

                        {/* Add Recording quick-action */}
                        <button
                            type="button"
                            onClick={() => setIsAddRecordingOpen(true)}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-[12px] font-bold text-gray-400 hover:border-yellow-400 hover:text-yellow-500 transition-colors"
                        >
                            <FiPlus size={14} />
                            Upload New Recording
                        </button>

                        {/* On-Hold 1 */}
                        <FieldWrapper label="On-Hold Recording 1">
                            <SelectInput value={onHoldRecording1} onChange={setOnHoldRecording1}>
                                <option value="">None</option>
                                {recordings.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </SelectInput>
                        </FieldWrapper>

                        {/* On-Hold 2 */}
                        <FieldWrapper label="On-Hold Recording 2">
                            <SelectInput value={onHoldRecording2} onChange={setOnHoldRecording2}>
                                <option value="">None</option>
                                {recordings.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </SelectInput>
                        </FieldWrapper>

                        {/* IVR */}
                        <FieldWrapper label="IVR Recording">
                            <SelectInput value={ivrRecording} onChange={setIvrRecording}>
                                <option value="">None</option>
                                {recordings.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </SelectInput>
                        </FieldWrapper>

                        {/* Answering Machine */}
                        <FieldWrapper label="Answering Machine Recording">
                            <SelectInput value={answeringMachineRecording} onChange={setAnsweringMachineRecording}>
                                <option value="">None</option>
                                {recordings.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name}
                                    </option>
                                ))}
                            </SelectInput>
                        </FieldWrapper>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-50 flex gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-[14px] font-bold py-3.5 rounded-2xl transition-all"
                        >
                            Cancel
                        </button>
                        <button onClick={
                            () => navigate("/contact-info", {
                                state: { contacts: selectedContacts }
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
