import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addContactNote } from "@/store/slices/contactSlice";
import { Send, StickyNote, MessageSquarePlus } from "lucide-react";
import toast from "react-hot-toast";

const Notes = () => {
    const dispatch = useAppDispatch();
    const { currentContact } = useAppSelector((state) => state.contacts);
    const [newNote, setNewNote] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const handleAddNote = async () => {
        if (!currentContact || !newNote.trim()) return;

        setIsAdding(true);
        try {
            await dispatch(addContactNote({ id: currentContact.id, note: newNote.trim() })).unwrap();
            setNewNote("");
            toast.success("Note added successfully");
        } catch (error: any) {
            toast.error("Failed to add note: " + error);
        } finally {
            setIsAdding(false);
        }
    };

    const notes = currentContact?.notes || [];

    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-2">
            {/* Header/Input Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-4 transition-all focus-within:shadow-md focus-within:border-[#FFCA06]">
                <div className="flex items-start gap-3">
                    <div className="mt-1 shrink-0">
                        <MessageSquarePlus className="w-5 h-5 text-[#FFCA06]" />
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-700 dark:text-gray-200 placeholder:text-gray-400 resize-none min-h-[80px] outline-none"
                            placeholder="Add a new note for this contact..."
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.ctrlKey) {
                                    handleAddNote();
                                }
                            }}
                        />
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50 dark:border-slate-700">
                            <span className="text-[10px] text-gray-400">Ctrl + Enter to quick add</span>
                            <button
                                onClick={handleAddNote}
                                disabled={isAdding || !newNote.trim()}
                                className="flex items-center gap-2 bg-[#0E1011] dark:bg-[#FFCA06] hover:bg-gray-800 dark:hover:bg-[#e6b605] disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-[#2B3034] px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                            >
                                {isAdding ? "Adding..." : "Add Note"}
                                <Send className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes History List */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <StickyNote className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Note History ({notes.length})</h3>
                </div>

                {notes.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                        <p className="text-gray-400 text-sm">No notes captured for this contact yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {[...notes].reverse().map((note, index) => (
                            <div 
                                key={index} 
                                className="group bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-[#FFCA06] dark:hover:border-[#FFCA06] transition-all shadow-sm hover:shadow-md animate-in fade-in slide-in-from-bottom-2"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#FFCA06]" />
                                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">Note #{notes.length - index}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {note}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notes;