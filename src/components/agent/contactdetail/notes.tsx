import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateContact } from "@/store/slices/contactSlice";
import { FileText, StickyNote } from "lucide-react";
import toast from "react-hot-toast";

// ─── Reusable inline-save textarea ───────────────────────────────────────────

interface InlineTextareaProps {
  label: string;
  icon: React.ElementType;
  hint: string;
  value: string;
  placeholder: string;
  onSave: (value: string) => Promise<void>;
}

function InlineTextarea({ label, icon: Icon, hint, value: initialValue, placeholder, onSave }: InlineTextareaProps) {
  const [draft, setDraft] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  // Sync when contact changes (navigation)
  useEffect(() => { setDraft(initialValue); }, [initialValue]);

  const dirty = draft !== initialValue;

  async function handleSave() {
    if (!dirty) return;
    setSaving(true);
    try {
      await onSave(draft);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-[#FFCA06] shrink-0" />
        <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-300">{label}</span>
        <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500 italic">{hint}</span>
      </div>
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full bg-transparent border border-gray-100 dark:border-slate-600 rounded-xl p-3 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#FFCA06] dark:focus:border-[#FFCA06] resize-y leading-relaxed transition-colors select-text"
      />
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-gray-400">Click Save to persist changes</span>
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="flex items-center gap-2 bg-[#0E1011] dark:bg-[#FFCA06] hover:bg-gray-800 dark:hover:bg-[#e6b605] disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-[#2B3034] px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}

// ─── Notes tab ────────────────────────────────────────────────────────────────
// Two fields only:
//   1. Description  — populated by imports / CRMs (CSV "notes" column maps here)
//   2. Notes        — agent-only, never imported (stored in agentRemarks field)

const Notes = () => {
  const dispatch = useAppDispatch();
  const { currentContact } = useAppSelector((state) => state.contacts);

  if (!currentContact) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-2">

      {/* 1. Description — imported */}
      <InlineTextarea
        label="Description"
        icon={FileText}
        hint="Populated by imports — never write manually"
        value={currentContact.description ?? ""}
        placeholder="Contact description pulled in from import or external CRM…"
        onSave={async (val) => {
          await dispatch(updateContact({ id: currentContact.id, payload: { description: val } })).unwrap();
          toast.success("Description saved");
        }}
      />

      {/* 2. Notes — agent-only, never imported */}
      <InlineTextarea
        label="Notes"
        icon={StickyNote}
        hint="Agent-only — never imported"
        value={currentContact.agentRemarks ?? ""}
        placeholder="Your notes about this contact…"
        onSave={async (val) => {
          await dispatch(updateContact({ id: currentContact.id, payload: { agentRemarks: val } })).unwrap();
          toast.success("Notes saved");
        }}
      />

    </div>
  );
};

export default Notes;
