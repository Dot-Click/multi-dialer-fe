"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateContact } from "@/store/slices/contactSlice";
import toast from "react-hot-toast";
import {
  PhoneOff,
  PhoneMissed,
  PhoneIncoming,
  Ban,
  ThumbsDown,
  XCircle,
  CheckCircle2,
  Loader2,
  Check,
  Phone,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LeadCallStatus =
  | "PENDING"
  | "CALLING"
  | "CALLED"
  | "FAILED"
  | "BUSY"
  | "NO_ANSWER"
  | "HOT"
  | "WARM"
  | "COLD"
  | "CALL_BACK"
  | "DO_NOT_CALL"
  | "NOT_INTERESTED";

interface DispositionConfig {
  value: LeadCallStatus;
  label: string;
  icon: React.ElementType;
  idle: string;
  active: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const DISPOSITIONS: DispositionConfig[] = [
  {
    value: "CALLED",
    label: "Called",
    icon: CheckCircle2,
    idle: "border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950",
    active: "bg-emerald-500 border-emerald-500 text-white",
  },
  {
    value: "NO_ANSWER",
    label: "No Answer",
    icon: PhoneMissed,
    idle: "border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-950",
    active: "bg-violet-500 border-violet-500 text-white",
  },
  {
    value: "BUSY",
    label: "Busy",
    icon: PhoneOff,
    idle: "border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950",
    active: "bg-orange-500 border-orange-500 text-white",
  },
  {
    value: "CALL_BACK",
    label: "Call Back",
    icon: PhoneIncoming,
    idle: "border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-950",
    active: "bg-yellow-400 border-yellow-400 text-gray-900",
  },
  {
    value: "NOT_INTERESTED",
    label: "Not Interested",
    icon: ThumbsDown,
    idle: "border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-slate-600 dark:text-gray-400 dark:hover:bg-slate-700",
    active: "bg-gray-700 border-gray-700 text-white dark:bg-slate-500 dark:border-slate-500",
  },
  {
    value: "DO_NOT_CALL",
    label: "Do Not Call",
    icon: Ban,
    idle: "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950",
    active: "bg-red-500 border-red-500 text-white",
  },
  {
    value: "FAILED",
    label: "Failed",
    icon: XCircle,
    idle: "border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950",
    active: "bg-rose-500 border-rose-500 text-white",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ContactDisposition = () => {
  const dispatch = useAppDispatch();
  const { currentContact, isLoading } = useAppSelector((state) => state.contacts);

  const [selected, setSelected] = useState<LeadCallStatus | null>(null);
  // Tracks what's actually persisted so we can detect dirty state
  const [saved, setSaved] = useState<LeadCallStatus | null>(null);

  // Sync local state whenever the active contact changes (next/prev navigation)
  useEffect(() => {
    const d = (currentContact?.disposition as LeadCallStatus) ?? null;
    setSelected(d);
    setSaved(d);
  }, [currentContact?.id]);

  function handleSelect(value: LeadCallStatus) {
    // Clicking the active pill deselects it
    setSelected((prev) => (prev === value ? null : value));
  }

  async function handleSave() {
    if (!currentContact?.id) {
      toast.error("No contact loaded");
      return;
    }
    if (!selected) {
      toast.error("Pick a disposition first");
      return;
    }

    const result = await dispatch(
      updateContact({ id: currentContact.id, payload: { disposition: selected } })
    );

    if (updateContact.fulfilled.match(result)) {
      setSaved(selected);
      toast.success(`Disposition set to "${getLabel(selected)}"`);
    } else {
      toast.error((result.payload as string) ?? "Failed to save disposition");
    }
  }

  function getLabel(v: LeadCallStatus) {
    return DISPOSITIONS.find((d) => d.value === v)?.label ?? v;
  }

  const isDirty = selected !== saved;
  const isSaving = isLoading;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-5 w-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
            Dispositions
          </p>
        </div>

        {/* Shows what's currently saved in the DB */}
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">
            <Check className="w-3 h-3 text-emerald-500" />
            {getLabel(saved)}
          </span>
        )}
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {DISPOSITIONS.map(({ value, label, icon: Icon, idle, active }) => {
          const isActive = selected === value;
          return (
            <button
              key={value}
              onClick={() => handleSelect(value)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-sm rounded-full border font-medium transition-all duration-150 active:scale-95 ${
                isActive ? active : idle
              }`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {isDirty && selected
            ? `Selected: ${getLabel(selected)}`
            : !selected
            ? "No disposition selected"
            : "Up to date"}
        </p>

        <button
          onClick={handleSave}
          disabled={isSaving || !selected || !isDirty}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
            isSaving || !selected || !isDirty
              ? "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-[#FFCA06] hover:bg-[#f0bc00] text-gray-900 shadow-sm hover:shadow active:scale-95"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              Save
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ContactDisposition;