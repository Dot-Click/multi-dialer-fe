import { useState, useEffect, useCallback } from "react";
import type { FC, ReactNode } from "react";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import api from "@/lib/axios";
import { FreezeCountdown, isCurrentlyFrozen } from "@/components/agent/common/FreezeCountdown";
import { useMediaCenter, type MediaCenterItem, type MediaType } from "@/hooks/useMediaCenter";
import {
  useCallSettings,
  useCallerIds,
  useDialerSettings,
  type CallerId,
} from "@/hooks/useSystemSettings";
import { useScript, type ScriptData } from "@/hooks/useScript";
import { usePlanLimits } from "@/hooks/usePlanLimits";

// ── Shared field primitives (identical to CreateCallSettingModal) ──────────────

const FieldWrapper: FC<{ label: string; children: ReactNode }> = ({ label, children }) => (
  <div className="bg-[#F3F4F8] dark:bg-slate-800 rounded-xl px-4 py-3">
    <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
      {label}
    </label>
    {children}
  </div>
);

const SelectInput: FC<{ value: string; onChange: (v: string) => void; children: ReactNode }> = ({ value, onChange, children }) => (
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

// Matches the RecordingSlot enum from the Prisma schema: ON_HOLD | IVR | ANSWERING_MACHINE | VOICEMAIL | GENERAL
const filterAudioByType = (media: MediaCenterItem[], mediaType: MediaType): MediaCenterItem[] =>
  media.filter((item) => item.fileCategory === "audio" && item.mediaType === mediaType);

const AdminCreateCallSetting: FC = () => {
  const navigate = useNavigate();
  const { id: editId } = useParams<{ id: string }>();
  const isEditMode = !!editId;
  const { data: existingSettings, createCallSettings, updateCallSettings } = useCallSettings();
  const { data: callerIdsData } = useCallerIds();
  const { getMediaCenterItems } = useMediaCenter();
  const { getScripts } = useScript();

  const [name, setName] = useState("");
  const [selectedCallerIds, setSelectedCallerIds] = useState<string[]>([]);
  const [countryCode] = useState("US");
  const [noOfLines, setNoOfLines] = useState("1");
  const [onHoldRecording1, setOnHoldRecording1] = useState("");
  const [answeringMachineRecording, setAnsweringMachineRecording] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [mediaCenterItems, setMediaCenterItems] = useState<MediaCenterItem[]>([]);
  const [callerIds, setCallerIds] = useState<CallerId[]>([]);
  const [freezeStatus, setFreezeStatus] = useState<Record<string, { isFrozen: boolean; unfreezeAt: string | null; secondsRemaining: number }>>({});

  const [scripts, setScripts] = useState<ScriptData[]>([]);
  const [selectedScript, setSelectedScript] = useState("");
  const [dialerMode, setDialerMode] = useState<"manual" | "power">("manual");
  const [pacing, setPacing] = useState(1);
  const [amdEnabled, setAmdEnabled] = useState(false);

  const { data: planLimits } = usePlanLimits();
  const maxDialerLines = planLimits?.maxDialerLines ?? 10;
  useEffect(() => {
    if (pacing > maxDialerLines) setPacing(maxDialerLines);
  }, [maxDialerLines, pacing]);

  const { data: dialerSettings, updateDialerSettings } = useDialerSettings();
  const [answerTone, setAnswerTone] = useState(false);
  useEffect(() => {
    if (dialerSettings) setAnswerTone(!!dialerSettings.useAnswerNotificationTone);
  }, [dialerSettings?.useAnswerNotificationTone]);
  const toggleAnswerTone = () => {
    const next = !answerTone;
    setAnswerTone(next);
    updateDialerSettings.mutate({ useAnswerNotificationTone: next });
  };

  const onHoldMedia = filterAudioByType(mediaCenterItems, "ON_HOLD");
  const voiceMailMedia = filterAudioByType(mediaCenterItems, "VOICE_MAIL");

  useEffect(() => {
    getMediaCenterItems().then(setMediaCenterItems);
    getScripts().then(setScripts);
  }, []);

  useEffect(() => {
    if (callerIdsData) setCallerIds(callerIdsData as CallerId[]);
  }, [callerIdsData]);

  // ── Load existing setting when editing ──────────────────────────────────
  useEffect(() => {
    if (!isEditMode || !existingSettings) return;
    const setting = existingSettings.find((s: any) => s.id === editId);
    if (!setting) return;
    setName(setting.label || "");
    setSelectedCallerIds(setting.callerId ? setting.callerId.split(",").map((s: string) => s.trim()) : []);
    setNoOfLines(String(setting.numberOfLines || 1));
    setOnHoldRecording1(setting.onHoldRecording1Id || "");
    setAnsweringMachineRecording(setting.answeringMachineRecordingId || "");
    setSelectedScript(setting.callScriptId || "");
    setDialerMode((setting as any).dialerMode || "manual");
    setPacing((setting as any).pacing || 1);
    setAmdEnabled((setting as any).amdEnabled ?? false);
  }, [isEditMode, editId, existingSettings]);

  // ── Freeze status polling ────────────────────────────────────────────────
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
    if (callerIds.length === 0) return;
    fetchFreezeStatus(callerIds);
    const interval = setInterval(() => fetchFreezeStatus(callerIds), 15_000);
    return () => clearInterval(interval);
  }, [callerIds, fetchFreezeStatus]);

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
        answeringMachineRecordingId: answeringMachineRecording || undefined,
        callScriptId: selectedScript || undefined,
        dialerMode,
        pacing,
        amdEnabled,
      };

      if (isEditMode && editId) {
        await updateCallSettings.mutateAsync({ id: editId, data: payload as any });
        toast.success("Call Setting updated successfully!");
      } else {
        await createCallSettings.mutateAsync(payload as any);
        toast.success("Call Setting created successfully!");
      }
      navigate("/admin/system-settings");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to save Call Setting.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/system-settings");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-950 dark:text-white">{isEditMode ? "Edit Call Setting" : "Create Call Setting"}</h1>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-5 py-2.5 text-[13px] font-bold w-28 text-gray-700 dark:text-white bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-all shadow-sm"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-5 py-2.5 text-[13px] font-black w-28 text-gray-900 bg-[#FFCA06] hover:bg-[#FECD56] rounded-xl disabled:opacity-50 transition-all shadow-sm active:scale-95"
            >
              {isLoading ? "Saving..." : isEditMode ? "Update" : "Save"}
            </button>
          </div>
        </div>

        {/* Form — mirrors CreateCallSettingModal's field set exactly */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 rounded-[24px] shadow-sm space-y-6">
          {/* Dialer Mode */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <FieldWrapper label="Dials Per Caller ID">
                  <SelectInput value={noOfLines} onChange={setNoOfLines}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option key={n} value={String(n)} className="dark:bg-slate-900">
                        {n} {n === 1 ? "Line" : "Lines"}
                      </option>
                    ))}
                  </SelectInput>
                </FieldWrapper>

                <FieldWrapper label={dialerMode === "power" ? "Number of Lines" : "Call Script"}>
                  {dialerMode === "power" ? (
                    <SelectInput value={String(pacing)} onChange={(v) => setPacing(Number(v))}>
                      {Array.from({ length: maxDialerLines }, (_, i) => i + 1).map((n) => (
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

              {/* Answer Notification Tone Toggle */}
              <div className="bg-[#F3F4F8] dark:bg-slate-800 rounded-xl px-4 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
                      Answer Notification Tone
                    </p>
                    <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                      Ringtone on connect & disconnect
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleAnswerTone}
                    className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none ${
                      answerTone ? "bg-yellow-400" : "bg-gray-300 dark:bg-slate-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        answerTone ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Caller ID Rotation List */}
            <div className="flex flex-col gap-4">
              <FieldWrapper label="Caller ID Rotation List">
                <div className="space-y-0.5 h-[420px] overflow-y-auto custom-scrollbar pr-2 mt-1">
                  {callerIds.map((cid) => {
                    const number = cid.twillioNumber || cid.id;
                    const fs = freezeStatus[number];
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
      </div>
    </div>
  );
};

export default AdminCreateCallSetting;
