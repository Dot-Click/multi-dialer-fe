import { useMiscFields } from "@/hooks/useSystemSettings";
import { Loader2, ChevronDown, FileText } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateContact } from "@/store/slices/contactSlice";
import toast from "react-hot-toast";

// ─── Field priority order (by fieldName, case-insensitive) ───────────────────
const PRIORITY_NAMES: string[] = [
  "listing status",
  "listing price",
  "days on market",
  "bedrooms",
  "bathrooms",
  "square footage",
  "year built",
];

function sortByPriority(fields: any[]): any[] {
  return [...fields].sort((a, b) => {
    const aName = (a.fieldName ?? "").toLowerCase().trim();
    const bName = (b.fieldName ?? "").toLowerCase().trim();
    // Birthday always last
    const aBirthday = aName.includes("birthday") || aName.includes("birth date");
    const bBirthday = bName.includes("birthday") || bName.includes("birth date");
    if (aBirthday && !bBirthday) return 1;
    if (!aBirthday && bBirthday) return -1;
    const aIdx = PRIORITY_NAMES.findIndex((n) => aName.includes(n));
    const bIdx = PRIORITY_NAMES.findIndex((n) => bName.includes(n));
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return 0;
  });
}

// ─── Expand popup — shown next to an input when value is long ────────────────
const TRUNCATE_AT = 28;

function ExpandPopup({ value, fieldName }: { value: string; fieldName: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        title="View full value"
        className="flex items-center gap-0.5 text-[10px] font-bold text-[#FFCA06] uppercase tracking-wider hover:text-yellow-500 transition-colors"
      >
        more <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute z-50 right-0 top-full mt-1 w-72 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl shadow-xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
            {fieldName}
          </p>
          <p className="text-sm text-gray-800 dark:text-white leading-relaxed whitespace-pre-wrap select-text break-words">
            {value}
          </p>
          <p className="mt-3 text-[10px] text-gray-400 italic">Click outside to close</p>
        </div>
      )}
    </div>
  );
}

// ─── Description / Agent Remarks inline fields ────────────────────────────────

interface ContactTextFieldProps {
  label: string;
  icon: React.ElementType;
  hint: string;
  value: string;
  placeholder: string;
  onSave: (val: string) => Promise<void>;
}

function ContactTextField({ label, icon: Icon, hint, value: initial, placeholder, onSave }: ContactTextFieldProps) {
  const [draft, setDraft] = useState(initial);
  const [saving, setSaving] = useState(false);

  // sync if contact switches
  useEffect(() => { setDraft(initial); }, [initial]);

  const dirty = draft !== initial;

  async function handleSave() {
    if (!dirty) return;
    setSaving(true);
    try { await onSave(draft); } finally { setSaving(false); }
  }

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-[#FFCA06]" />
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 select-none">
          {label}
        </label>
        <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500 italic">{hint}</span>
      </div>
      <div className="border-b border-gray-200 dark:border-slate-600 pb-1 flex items-end gap-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="flex-1 text-sm font-medium text-gray-900 dark:text-white outline-none py-0.5 bg-transparent placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-y leading-relaxed focus:border-b focus:border-[#FFCA06] select-text"
        />
        {dirty && (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="shrink-0 mb-1 text-[10px] font-bold text-[#FFCA06] hover:text-yellow-500 disabled:opacity-50 uppercase tracking-wider transition-colors"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main Misc / Profile component ───────────────────────────────────────────

const Misc = () => {
  const dispatch = useAppDispatch();
  const { currentContact } = useAppSelector((state) => state.contacts);
  const { data: miscFields, isLoading, isError } = useMiscFields();
  const [values, setValues] = useState<Record<string, any>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (currentContact?.miscValues) {
      setValues(currentContact.miscValues as Record<string, any>);
    }
  }, [currentContact]);

  const handleChange = (fieldId: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSave = async () => {
    if (!currentContact) return;
    setIsUpdating(true);
    try {
      await dispatch(updateContact({ id: currentContact.id, payload: { miscValues: values } })).unwrap();
      toast.success("Profile details saved");
    } catch (error: any) {
      toast.error("Failed to save: " + error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500 w-full">
        Failed to load profile fields.
      </div>
    );
  }

  const fields = sortByPriority(miscFields || []);
  const half = Math.ceil(fields.length / 2);
  const leftFields = fields.slice(0, half);
  const rightFields = fields.slice(half);

  // Render a single misc field — input is ALWAYS editable; expand popup appears
  // alongside the input only when the saved value is long (not replacing it).
  const renderField = (field: any) => {
    const value = values[field.id] ?? "";
    const strValue = String(value);
    const isLong = strValue.length > TRUNCATE_AT;

    return (
      <div key={field.id} className="flex flex-col gap-1 w-full">
        <label className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 select-none">
          {field.fieldName}
        </label>

        <div className="border-b border-gray-200 dark:border-slate-600 pb-1 flex items-center gap-1">
          {field.type === "dropdown" ? (
            <select
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="flex-1 text-sm font-semibold text-gray-900 dark:text-white outline-none py-0.5 bg-transparent focus:border-b focus:border-[#FFCA06] cursor-pointer"
            >
              <option value="" className="dark:bg-slate-800 dark:text-white">Select…</option>
              {field.options?.map((opt: string) => (
                <option key={opt} value={opt} className="dark:bg-slate-800 dark:text-white">{opt}</option>
              ))}
            </select>
          ) : (
            // Text / counter / date — always an editable input
            <input
              type={
                field.type === "counter" ? "number"
                : field.type === "date" ? "date"
                : "text"
              }
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder="—"
              className="flex-1 text-sm font-semibold text-gray-900 dark:text-white outline-none py-0.5 bg-transparent placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-b focus:border-[#FFCA06]"
            />
          )}

          {/* Only show expand popup for text fields with long values */}
          {field.type !== "dropdown" && field.type !== "counter" && field.type !== "date" && isLong && (
            <ExpandPopup value={strValue} fieldName={field.fieldName} />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-8">

      {/* ── Description (top of Profile — imported field) ────────────────── */}
      {currentContact && (
        <div className="w-full pb-6 border-b border-gray-100 dark:border-slate-700">
          <ContactTextField
            label="Description"
            icon={FileText}
            hint="From imports / CRM"
            value={currentContact.description ?? ""}
            placeholder="Contact description from import or external CRM…"
            onSave={async (val) => {
              await dispatch(updateContact({ id: currentContact.id, payload: { description: val } })).unwrap();
              toast.success("Description saved");
            }}
          />
        </div>
      )}

      {/* ── Custom misc fields ────────────────────────────────────────────── */}
      {fields.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-6">No custom profile fields configured.</p>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
          <div className="flex flex-col gap-5">{leftFields.map(renderField)}</div>
          <div className="flex flex-col gap-5">{rightFields.map(renderField)}</div>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="bg-[#0E1011] dark:bg-[#FFCA06] text-white dark:text-[#2B3034] px-8 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 dark:hover:bg-[#ffd633] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default Misc;
