import React, { useState, useEffect, useCallback } from "react";
import { FiX, FiChevronDown, FiPlus } from "react-icons/fi";
import { FreezeCountdown, isCurrentlyFrozen } from "@/components/agent/common/FreezeCountdown";
import api from "@/lib/axios";
import { toast } from "react-hot-toast";
import AddRecordingModal from "@/components/modal/addrecordingmodal";
import { useRecordings, type RecordingItem } from "@/hooks/useRecordings";
import { useMediaCenter, type MediaCenterItem, type MediaType } from "@/hooks/useMediaCenter";
import { useCallSettings, useCallerIds, type CallerId } from "@/hooks/useSystemSettings";
import { useNavigate } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import { useScript, type ScriptData } from "@/hooks/useScript";
import { useAppSelector } from "@/store/hooks";

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

const filterAudioByType = (media: MediaCenterItem[], mediaType: MediaType): MediaCenterItem[] =>
  media.filter((item) => item.fileCategory === "audio" && item.mediaType === mediaType);

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
  const { getMediaCenterItems } = useMediaCenter();
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
  const [mediaCenterItems, setMediaCenterItems] = useState<MediaCenterItem[]>([]);
  const [callerIds, setCallerIds] = useState<CallerId[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  // Freeze status map: twillioNumber → { isFrozen, unfreezeAt, secondsRemaining }
  const [freezeStatus, setFreezeStatus] = useState<Record<string, { isFrozen: boolean; unfreezeAt: string | null; secondsRemaining: number }>>({});
  const pollFreezeRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const { getScripts } = useScript();
  const [scripts, setScripts] = useState<ScriptData[]>([]);
  const [selectedScript, setSelectedScript] = useState("");
  const [dialerMode, setDialerMode] = useState<"manual" | "power">("manual");
  const [pacing, setPacing] = useState(1); // Power Dialer: simultaneous calls
  const [amdEnabled, setAmdEnabled] = useState(false);

  const { data: session } = authClient.useSession();
  const appRole = useAppSelector((state) => state.auth.role);
  const role = appRole || session?.user?.role;

  const onHoldMedia = filterAudioByType(mediaCenterItems, "ON_HOLD");
  const voiceMailMedia = filterAudioByType(mediaCenterItems, "VOICE_MAIL");

  const isLegacyRecordingId = (id: string) => recordings.some((r) => r.id === id);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const loadSetting = (setting: any) => {
    setEditId(setting.id);
    setName(setting.label || "");
    if (setting.callerId) {
      setSelectedCallerIds(setting.callerId.split(",").map((s: string) => s.trim()));
    } else {
      setSelectedCallerIds([]);
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
    setAmdEnabled((setting as any).amdEnabled ?? false);
  };

  const getSelectedRecordingUrl = () => {
    if (!onHoldRecording1) return undefined;
    const media = mediaCenterItems.find((item) => item.id === onHoldRecording1);
    if (media?.fileUrl) return media.fileUrl;
    const rec = recordings.find((r) => r.id === onHoldRecording1);
    return rec ? ((rec as any).fileUrl || (rec as any).url) : undefined;
  };

  const getAnsweringMachineUrl = () => {
    if (!answeringMachineRecording) return undefined;
    const media = mediaCenterItems.find((item) => item.id === answeringMachineRecording);
    if (media?.fileUrl) return media.fileUrl;
    const rec = recordings.find((r) => r.id === answeringMachineRecording);
    return rec ? ((rec as any).fileUrl || (rec as any).url) : undefined;
  };

  const getBusyRecordingUrl = () => {
    if (!busyRecording) return undefined;
    const media = mediaCenterItems.find((item) => item.id === busyRecording);
    if (media?.fileUrl) return media.fileUrl;
    const rec = recordings.find((r) => r.id === busyRecording);
    return rec ? ((rec as any).fileUrl || (rec as any).url) : undefined;
  };

  // ── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isOpen) {
      getRecordings().then(setRecordings);
      getMediaCenterItems().then(setMediaCenterItems);
      getScripts().then(setScripts);
    }
  }, [isOpen]);

  useEffect(() => {
    if (callerIdsData) setCallerIds(callerIdsData as CallerId[]);
  }, [callerIdsData]);

  // ── Freeze status polling while modal is open ────────────────────────────
  const fetchFreezeStatus = useCallback(async (ids: CallerId[]) => {
    const numbers = ids.map((c) => c.twillioNumber).filter(Boolean) as string[];
    if (numbers.length === 0) return;
    try {
      const { data } = await api.get('/system-settings/caller-id/status', {
        params: { numbers: numbers.join(',') },
      });
      if (data.success) setFreezeStatus(data.data);
    } catch {
      // non-critical — UI degrades gracefully
    }
  }, []);

  useEffect(() => {
    if (!isOpen || callerIds.length === 0) return;
    fetchFreezeStatus(callerIds);
    pollFreezeRef.current = setInterval(() => fetchFreezeStatus(callerIds), 15_000);
    return () => {
      if (pollFreezeRef.current) clearInterval(pollFreezeRef.current);
    };
  }, [isOpen, callerIds, fetchFreezeStatus]);

  useEffect(() => {
    if (isOpen && existingSettings && existingSettings.length > 0 && !editId) {
      loadSetting(existingSettings[0]);
    }
  }, [isOpen, existingSettings, editId]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const resetForm = () => {
    setEditId(null);
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
    setSelectedScript("");
    setAmdEnabled(false);
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
        onHoldRecording1Id: onHoldRecording1 && isLegacyRecordingId(onHoldRecording1) ? onHoldRecording1 : undefined,
        onHoldRecording2Id: onHoldRecording2 && isLegacyRecordingId(onHoldRecording2) ? onHoldRecording2 : undefined,
        ivrRecordingId: ivrRecording && isLegacyRecordingId(ivrRecording) ? ivrRecording : undefined,
        answeringMachineRecordingId: answeringMachineRecording && isLegacyRecordingId(answeringMachineRecording) ? answeringMachineRecording : undefined,
        busyRecordingId: busyRecording && isLegacyRecordingId(busyRecording) ? busyRecording : undefined,
        callScriptId: selectedScript || undefined,
        dialerMode,
        amdEnabled,
      };

      console.log("[CreateCallSetting] Saving payload:", payload);

      if (editId) {
        console.log("[CreateCallSetting] Updating existing setting:", editId);
        await updateCallSettings.mutateAsync({ id: editId, data: payload as any });
        toast.success("Call Setting updated successfully!");
      } else {
        console.log("[CreateCallSetting] Creating new setting");
        await createCallSettings.mutateAsync(payload as any);
        toast.success("Call Setting created successfully!");
      }

      const destination = role === "ADMIN" ? "/admin/contact-info" : "/contact-info";
      console.log("[CreateCallSetting] Navigating to:", destination);
      console.log("[CreateCallSetting] Navigation state:", {
        contacts: selectedContacts,
        callerIds: selectedCallerIds,
        numberOfLines: parseInt(noOfLines),
        selectedScript: selectedScript || undefined,
        holdRecordingUrl: getSelectedRecordingUrl(),
        answeringMachineRecordingUrl: getAnsweringMachineUrl(),
        busyRecordingUrl: getBusyRecordingUrl(),
        dialerMode,
        pacing: dialerMode === "power" ? pacing : undefined,
      });

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

      console.log("[CreateCallSetting] Navigation called, closing modal");
      handleClose();
    } catch (err: any) {
      console.error("[CreateCallSetting] Error saving:", err);
      console.error("[CreateCallSetting] Error details:", {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
      });
      toast.error(err?.response?.data?.message || err?.message || "Failed to save Call Setting.");
    } finally {
      setIsLoading(false);
    }
  };

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
                <FieldWrapper label="Select Configuration">
                  <SelectInput
                    value={editId || "new"}
                    onChange={(val) => {
                      if (val === "new") {
                        resetForm();
                      } else {
                        const setting = existingSettings?.find(s => s.id === val);
                        if (setting) loadSetting(setting);
                      }
                    }}
                  >
                    <option value="new" className="dark:bg-slate-900">-- New Configuration --</option>
                    {existingSettings?.map((s: any) => (
                      <option key={s.id} value={s.id} className="dark:bg-slate-900">
                        {s.label}
                      </option>
                    ))}
                  </SelectInput>
                </FieldWrapper>

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
                  <FieldWrapper label="DIALS PER CALLER ID">
                    <SelectInput value={noOfLines} onChange={setNoOfLines}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={String(n)} className="dark:bg-slate-900">
                          {n} {n === 1 ? "Line" : "Lines"}
                        </option>
                      ))}
                    </SelectInput>
                  </FieldWrapper>

                  <FieldWrapper label={dialerMode === "power" ? "NUMBER OF LINES" : "Call Script"}>
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
                        {onHoldMedia.map((item) => (
                          <option key={item.id} value={item.id} className="dark:bg-slate-900">{item.templateName}</option>
                        ))}
                      </SelectInput>
                    </FieldWrapper>

                    <FieldWrapper label="Drop VM">
                      <SelectInput value={answeringMachineRecording} onChange={setAnsweringMachineRecording}>
                        <option value="" className="dark:bg-slate-900">None</option>
                        {voiceMailMedia.map((item) => (
                          <option key={item.id} value={item.id} className="dark:bg-slate-900">{item.templateName}</option>
                        ))}
                      </SelectInput>
                    </FieldWrapper>
                  </div>
                </div>

                {/* AMD Toggle */}
                <div className="bg-[#F3F4F8] dark:bg-slate-800 rounded-xl px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                        Skip on Machine
                      </p>
                      <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                        Voicemail Detection
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAmdEnabled(!amdEnabled)}
                      className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none ${
                        amdEnabled ? "bg-yellow-400" : "bg-gray-300 dark:bg-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          amdEnabled ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  {amdEnabled && !answeringMachineRecording && (
                    <p className="text-[10px] text-blue-500 dark:text-blue-400 mt-2">
                      Machine calls will be skipped automatically.
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: Caller IDs */}
              <div className="flex flex-col">
                <FieldWrapper label="Caller ID Rotation List">
                  <div className="space-y-0.5 h-[240px] overflow-y-auto custom-scrollbar pr-2 mt-1">
                    {callerIds.map((cid) => {
                      const number = cid.twillioNumber || cid.id;
                      const fs = freezeStatus[number];
                      // Client-side timestamp check so the row unfreezes the instant
                      // the countdown hits 0, without waiting for the next poll.
                      const backendFrozen = fs?.isFrozen ?? false;
                      const clientExpired = fs?.unfreezeAt ? !isCurrentlyFrozen(fs.unfreezeAt) : false;
                      const isFrozen = backendFrozen && !clientExpired;
                      const isSelected = selectedCallerIds.includes(number);

                      return (
                        <label
                          key={cid.id}
                          className={`flex items-center gap-2 p-2 rounded-lg transition-all group mb-0.5
                            ${isFrozen
                              ? 'bg-orange-50 dark:bg-orange-900/15 border border-orange-200 dark:border-orange-700/40 cursor-not-allowed opacity-75'
                              : isSelected
                                ? 'bg-yellow-50 dark:bg-yellow-900/10 border border-transparent cursor-pointer'
                                : 'hover:bg-gray-50 dark:hover:bg-slate-800/50 border border-transparent cursor-pointer'
                            }`}
                        >
                          {/* Checkbox — disabled for frozen numbers */}
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0
                            ${isFrozen
                              ? 'bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-600'
                              : isSelected
                                ? 'bg-yellow-500 border-yellow-500 shadow-sm'
                                : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                            }`}
                          >
                            {isSelected && !isFrozen && <FiPlus className="text-white rotate-45" size={12} />}
                            <input
                              type="checkbox"
                              checked={isSelected && !isFrozen}
                              disabled={isFrozen}
                              onChange={(e) => {
                                if (isFrozen) return;
                                setSelectedCallerIds(
                                  e.target.checked
                                    ? [...selectedCallerIds, number]
                                    : selectedCallerIds.filter((v) => v !== number)
                                );
                              }}
                              className="hidden"
                            />
                          </div>

                          {/* Label + number */}
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className={`text-[12px] font-bold truncate
                              ${isFrozen
                                ? 'text-orange-700 dark:text-orange-300'
                                : isSelected
                                  ? 'text-gray-900 dark:text-yellow-400'
                                  : 'text-gray-700 dark:text-gray-200'
                              }`}
                            >
                              {cid.label || number}
                            </span>
                            <span className={`text-[10px] ${isFrozen ? 'text-orange-400' : 'text-gray-400'}`}>
                              {cid.twillioNumber}
                            </span>
                          </div>

                          {/* Frozen badge + countdown */}
                          {isFrozen && (
                            <div className="flex flex-col items-end shrink-0 gap-0.5">
                              <span className="text-[9px] font-black uppercase tracking-wider text-orange-500 bg-orange-100 dark:bg-orange-900/40 px-1.5 py-0.5 rounded-full">
                                Frozen
                              </span>
                              <FreezeCountdown
                                unfreezeAt={fs?.unfreezeAt}
                                className="text-[9px] font-black tabular-nums text-orange-500"
                              />
                            </div>
                          )}
                        </label>
                      );
                    })}
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
