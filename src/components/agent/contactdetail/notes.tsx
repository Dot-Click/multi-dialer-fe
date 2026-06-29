import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addContactNote } from "@/store/slices/contactSlice";
import { StickyNote, Pencil } from "lucide-react";
import toast from "react-hot-toast";

const Notes = () => {
  const dispatch = useAppDispatch();
  const { currentContact } = useAppSelector((state) => state.contacts);

  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  if (!currentContact) return null;

  const notes: string[] = currentContact.notes ?? [];

  async function handleSave() {
    if (!draft.trim() || !currentContact) return;
    setSaving(true);
    try {
      await dispatch(addContactNote({ id: currentContact.id, note: draft.trim() })).unwrap();
      setDraft("");
      toast.success("Note added");
    } catch {
      toast.error("Failed to save note");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl mx-auto py-2">

      {/* Left — write a new note */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Pencil className="w-4 h-4 text-[#FFCA06] shrink-0" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-300">Write a note</span>
          <span className="ml-auto text-[10px] text-gray-400 dark:text-gray-500 italic">Agent-only — never imported</span>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Your notes about this contact…"
          rows={8}
          className="w-full flex-1 bg-transparent border border-gray-100 dark:border-slate-600 rounded-xl p-3 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-[#FFCA06] dark:focus:border-[#FFCA06] resize-y leading-relaxed transition-colors select-text"
        />
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-gray-400">Each save adds a new note</span>
          <button
            onClick={handleSave}
            disabled={saving || !draft.trim()}
            className="flex items-center gap-2 bg-[#0E1011] dark:bg-[#FFCA06] hover:bg-gray-800 dark:hover:bg-[#e6b605] disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-[#2B3034] px-4 py-1.5 rounded-xl text-xs font-bold transition-all"
          >
            {saving ? "Saving…" : "Add Note"}
          </button>
        </div>
      </div>

      {/* Right — all saved notes */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-4 flex flex-col gap-3 overflow-y-auto max-h-[480px]">
        <div className="flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-[#FFCA06] shrink-0" />
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-300">
            Saved notes {notes.length > 0 && `(${notes.length})`}
          </span>
        </div>
        {notes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {[...notes].reverse().map((note, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-slate-700 rounded-xl p-3 text-sm text-gray-800 dark:text-white whitespace-pre-wrap leading-relaxed"
              >
                {note}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <span className="text-xs text-gray-400 dark:text-gray-500 italic">No notes saved yet.</span>
          </div>
        )}
      </div>

    </div>
  );
};

export default Notes;
