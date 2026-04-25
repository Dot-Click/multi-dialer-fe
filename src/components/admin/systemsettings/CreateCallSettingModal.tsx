import React, { useState, useEffect } from "react";
import { FiX, FiChevronDown, FiPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import AddRecordingModal from "@/components/modal/addrecordingmodal";
import { useRecordings, type RecordingItem } from "@/hooks/useRecordings";
import { useCallSettings, useCallerIds, type CallerId } from "@/hooks/useSystemSettings";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { useScript, type ScriptData } from "@/hooks/useScript";

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

// ── Recording slot filter helper ─────────────────────────────────────────────
// Matches the RecordingSlot enum from the Prisma schema:
// ON_HOLD | IVR | ANSWERING_MACHINE | VOICEMAIL | GENERAL

const filterBySlot = (recordings: RecordingItem[], slot: string): RecordingItem[] =>
  recordings.filter((r) => (r as any).slot === slot);

// ── Modal ────────────────────────────────────────────────────────────────────

interface CreateCallSettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedContacts: any[];
}

const CreateCallSettingModal: React.FC<CreateCallSettingModalProps> = ({
  isOpen,
  onClose,
  selectedContacts,
}) => {
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
  const [busyRecording, setBusyRecording] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddRecordingOpen, setIsAddRecordingOpen] = useState(false);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [callerIds, setCallerIds] = useState<CallerId[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  const { getScripts } = useScript();
  const [scripts, setScripts] = useState<ScriptData[]>([]);
  const [selectedScript, setSelectedScript] = useState("");
  const [dialerMode, setDialerMode] = useState<"manual" | "power">("manual");
  const [pacing, setPacing] = useState(1); // Power Dialer: simultaneous calls

  const { data: session } = authClient.useSession();
  const role = session?.user.role;

  // ── Slot-filtered recording lists ─────────────────────────────────────────
  // Each dropdown only shows recordings uploaded with the matching slot type.
  // Falls back to showing all recordings if none are tagged with that slot,
  // so the UI is never empty due to a misconfigured upload.

  const onHoldRecordings    = filterBySlot(recordings, "ON_HOLD");
  const answeringMachineRecs = filterBySlot(recordings, "ANSWERING_MACHINE");
  // const busyRecs            = filterBySlot(recordings, "IVR"); // Use IVR or fallback

  const fallbackRecordings  = (filtered: RecordingItem[]) =>
    filtered.length > 0 ? filtered : recordings;

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getSelectedRecordingUrl = () => {
    if (!onHoldRecording1) return undefined;
    const rec = recordings.find((r) => r.id === onHoldRecording1);
    return rec ? ((rec as any).fileUrl || (rec as any).url) : undefined;
  };

  const getAnsweringMachineUrl = () => {
    if (!answeringMachineRecording) return undefined;
    const rec = recordings.find((r) => r.id === answeringMachineRecording);
    return rec ? ((rec as any).fileUrl || (rec as any).url) : undefined;
  };

  const getBusyRecordingUrl = () => {
    if (!busyRecording) return undefined;
    const rec = recordings.find((r) => r.id === busyRecording);
    return rec ? ((rec as any).fileUrl || (rec as any).url) : undefined;
  };

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      getRecordings().then(setRecordings);
      getScripts().then(setScripts);
    }
  }, [isOpen]);

  useEffect(() => {
    if (callerIdsData) setCallerIds(callerIdsData as CallerId[]);
  }, [callerIdsData]);

  useEffect(() => {
    if (isOpen && existingSettings && existingSettings.length > 0) {
      const setting = existingSettings[0];
      setEditId(setting.id);
      setName(setting.label || "");
      if (setting.callerId) {
        setSelectedCallerIds(setting.callerId.split(",").map((s: string) => s.trim()));
      }
      setCountryCode(setting.countryCode || "US");
      setNoOfLines(String(setting.numberOfLines || 1));
      setOnHoldRecording1(setting.onHoldRecording1Id || "");
      setOnHoldRecording2(setting.onHoldRecording2Id || "");
      setIvrRecording(setting.ivrRecordingId || "");
      setAnsweringMachineRecording(setting.answeringMachineRecordingId || "");
      setBusyRecording((setting as any).busyRecordingId || "");
      setSelectedScript(setting.callScriptId || "");
      setDialerMode((setting as any).dialerMode || "manual");
      setPacing((setting as any).pacing || 1);
    }
  }, [isOpen, existingSettings]);

  // ── Handlers ───────────────────────────────────────────────────────────────

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
      setBusyRecording("");
      setDialerMode("manual");
      setPacing(1);
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
        callerId: selectedCallerIds.join(","),
        countryCode,
        numberOfLines: parseInt(noOfLines),
        onHoldRecording1Id: onHoldRecording1 || undefined,
        onHoldRecording2Id: onHoldRecording2 || undefined,
        ivrRecordingId: ivrRecording || undefined,
        answeringMachineRecordingId: answeringMachineRecording || undefined,
        busyRecordingId: busyRecording || undefined,
        callScriptId: selectedScript || undefined,
        dialerMode,
      };

      if (editId) {
        await updateCallSettings.mutateAsync({ id: editId, data: payload as any });
        toast.success("Call Setting updated successfully!");
      } else {
        await createCallSettings.mutateAsync(payload as any);
        toast.success("Call Setting created successfully!");
      }

      const destination = role === "ADMIN" ? "/admin/contact-info" : "/contact-info";
      navigate(destination, {
        state: {
          contacts: selectedContacts,
          callerIds: selectedCallerIds,
          numberOfLines: parseInt(noOfLines),
          selectedScript: selectedScript || undefined,
          holdRecordingUrl: getSelectedRecordingUrl(),
          answeringMachineRecordingUrl: getAnsweringMachineUrl(),
          busyRecordingUrl: getBusyRecordingUrl(),
          dialerMode,
          pacing: dialerMode === "power" ? pacing : undefined,
        },
      });

      handleClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to save Call Setting.");
    } finally {
      setIsLoading(false);
    }
  };

  console.log(recordings)

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-9999 bg-black/30 backdrop-blur-[2px]" onClick={handleClose} />

      {/* Modal */}
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white dark:bg-slate-900 w-full max-w-[800px] rounded-[24px] shadow-2xl flex flex-col pointer-events-auto overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100 dark:border-slate-800">
            <h2 className="text-[18px] font-bold text-gray-900 dark:text-white">
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
          <div className="p-6 space-y-6">
            
            {/* Dialer Mode (TOP) - Compact */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDialerMode("manual")}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${dialerMode === "manual"
                    ? "border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10 shadow-sm"
                    : "border-gray-100 dark:border-slate-800 hover:border-gray-200"
                  }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${dialerMode === "manual" ? "bg-yellow-500" : "bg-gray-300"}`} />
                <div className="flex flex-col items-start">
                  <span className={`text-[13px] font-bold ${dialerMode === "manual" ? "text-gray-900 dark:text-yellow-400" : "text-gray-500"}`}>Manual Dialer</span>
                  <span className="text-[10px] text-gray-400">Step-by-step dialing</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setDialerMode("power")}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${dialerMode === "power"
                    ? "border-yellow-400 bg-yellow-50/50 dark:bg-yellow-900/10 shadow-sm"
                    : "border-gray-100 dark:border-slate-800 hover:border-gray-200"
                  }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${dialerMode === "power" ? "bg-yellow-500" : "bg-gray-300"}`} />
                <div className="flex flex-col items-start">
                  <span className={`text-[13px] font-bold ${dialerMode === "power" ? "text-gray-900 dark:text-yellow-400" : "text-gray-500"}`}>Power Dialer</span>
                  <span className="text-[10px] text-gray-400">Automatic progression</span>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* LEFT COLUMN: Basic Settings */}
              <div className="space-y-4">
                <FieldWrapper label="Configuration Name">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sales Q1"
                    className="w-full bg-transparent text-[12px] font-bold text-gray-800 dark:text-white outline-none"
                  />
                </FieldWrapper>

                <div className="grid grid-cols-2 gap-3">
                  <FieldWrapper label="Threshold">
                    <SelectInput value={noOfLines} onChange={setNoOfLines}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={String(n)} className="dark:bg-slate-900">
                          {n} {n === 1 ? "Line" : "Lines"}
                        </option>
                      ))}
                    </SelectInput>
                  </FieldWrapper>

                  <FieldWrapper label={dialerMode === "power" ? "Pacing" : "Call Script"}>
                    {dialerMode === "power" ? (
                      <SelectInput value={String(pacing)} onChange={(v) => setPacing(Number(v))}>
                        {[1, 2, 3, 4, 5, 10].map((n) => (
                          <option key={n} value={n} className="dark:bg-slate-900">
                            {n}x Speed
                          </option>
                        ))}
                      </SelectInput>
                    ) : (
                      <SelectInput value={selectedScript} onChange={setSelectedScript}>
                        <option value="" className="dark:bg-slate-900">None</option>
                        {scripts.map((s) => (
                          <option key={s.id} value={s.id} className="dark:bg-slate-900">
                            {s.scriptName}
                          </option>
                        ))}
                      </SelectInput>
                    )}
                  </FieldWrapper>
                </div>

                {/* Additional Row for Script if Power Mode is on */}
                {dialerMode === "power" && (
                  <FieldWrapper label="Call Script">
                    <SelectInput value={selectedScript} onChange={setSelectedScript}>
                      <option value="" className="dark:bg-slate-900">None</option>
                      {scripts.map((s) => (
                        <option key={s.id} value={s.id} className="dark:bg-slate-900">
                          {s.scriptName}
                        </option>
                      ))}
                    </SelectInput>
                  </FieldWrapper>
                )}

                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Audio Slots</span>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-slate-800" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <FieldWrapper label="On-Hold">
                      <SelectInput value={onHoldRecording1} onChange={setOnHoldRecording1}>
                        <option value="" className="dark:bg-slate-900">None</option>
                        {fallbackRecordings(onHoldRecordings).map((r) => (
                          <option key={r.id} value={r.id} className="dark:bg-slate-900">{r.name}</option>
                        ))}
                      </SelectInput>
                    </FieldWrapper>

                    <FieldWrapper label="Drop VM">
                      <SelectInput value={answeringMachineRecording} onChange={setAnsweringMachineRecording}>
                        <option value="" className="dark:bg-slate-900">None</option>
                        {fallbackRecordings(answeringMachineRecs).map((r) => (
                          <option key={r.id} value={r.id} className="dark:bg-slate-900">{r.name}</option>
                        ))}
                      </SelectInput>
                    </FieldWrapper>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Caller IDs */}
              <div className="flex flex-col">
                <FieldWrapper label="Caller ID Rotation List">
                  <div className="space-y-0.5 h-[240px] overflow-y-auto custom-scrollbar pr-2 mt-1">
                    {callerIds.map((cid) => (
                      <label key={cid.id} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all group mb-0.5 ${selectedCallerIds.includes(cid.twillioNumber || cid.id) ? "bg-yellow-50 dark:bg-yellow-900/10" : "hover:bg-gray-50 dark:hover:bg-slate-800/50"}`}>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedCallerIds.includes(cid.twillioNumber || cid.id) ? "bg-yellow-500 border-yellow-500 shadow-sm" : "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800"}`}>
                          {selectedCallerIds.includes(cid.twillioNumber || cid.id) && <FiPlus className="text-white rotate-45" size={12} />}
                          <input type="checkbox" checked={selectedCallerIds.includes(cid.twillioNumber || cid.id)} onChange={(e) => {
                              const id = cid.twillioNumber || cid.id;
                              setSelectedCallerIds(e.target.checked ? [...selectedCallerIds, id] : selectedCallerIds.filter((v) => v !== id));
                            }} className="hidden" />
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-[12px] font-bold ${selectedCallerIds.includes(cid.twillioNumber || cid.id) ? "text-gray-900 dark:text-yellow-400" : "text-gray-700 dark:text-gray-200"}`}>
                            {cid.label}
                          </span>
                          <span className="text-[10px] text-gray-400">{cid.twillioNumber}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </FieldWrapper>
              </div>
            </div>
          </div>

          {/* Footer - Compact */}
          <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-800 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-white text-[13px] font-bold py-2.5 rounded-xl transition-all shadow-sm"
            >
              Discard
            </button>
            {/* <button
              onClick={() =>
                navigate(role === "ADMIN" ? "/admin/contact-info" : "/contact-info", {
                  state: {
                    contacts: selectedContacts,
                    callerIds: selectedCallerIds,
                    numberOfLines: parseInt(noOfLines),
                    selectedScript: selectedScript || undefined,
                    holdRecordingUrl: getSelectedRecordingUrl(),
                    answeringMachineRecordingUrl: getAnsweringMachineUrl(),
                    busyRecordingUrl: getBusyRecordingUrl(),
                    dialerMode,
                    pacing: dialerMode === "power" ? pacing : undefined,
                  },
                })
              }
              className="flex-1 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-800 dark:text-white text-[13px] font-bold py-2.5 rounded-xl transition-all"
            >
              Skip & Start
            </button> */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-[#FFCA06] hover:bg-[#FECD56] text-gray-900 text-[13px] font-black py-2.5 rounded-xl shadow-sm transition-all active:scale-95"
            >
              {isLoading ? "Saving..." : "Save & Start"}
            </button>
          </div>
        </div>
      </div>

      {/* Add Recording sub-modal */}
      {isAddRecordingOpen && (
        <AddRecordingModal
          onClose={() => setIsAddRecordingOpen(false)}
          onSuccess={async () => {
            const updated = await getRecordings();
            setRecordings(updated);
          }}
        />
      )}
    </>
  );
};

export default CreateCallSettingModal;