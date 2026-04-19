import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { mergeContacts } from "@/store/slices/contactSlice";
import toast from "react-hot-toast";
import { FiCheck, FiX, FiFolder, FiList } from "react-icons/fi";

const MergeDuplicateModal = ({
  isOpen,
  onClose,
  contacts,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  contacts: any[];
  onSuccess?: () => void;
}) => {
  const [masterId, setMasterId] = useState<string>(contacts[0]?.id || "");
  const [targetFolderId, setTargetFolderId] = useState<string>("");
  const [targetListId, setTargetListId] = useState<string>("");
  const [isMerging, setIsMerging] = useState(false);

  const dispatch = useAppDispatch();
  const { folders, lists } = useAppSelector((state) => state.contacts);

  if (!isOpen) return null;

  const handleMerge = async () => {
    if (!masterId) {
      toast.error("Please select a primary contact");
      return;
    }
    if (!targetFolderId && !targetListId) {
      toast.error("Please select a destination Folder or Calling List");
      return;
    }

    setIsMerging(true);
    const duplicateIds = contacts
      .map((c) => c.id)
      .filter((id) => id !== masterId);

    const res = await dispatch(mergeContacts({
      masterId,
      duplicateIds,
      targetFolderId,
      targetListId
    }));

    if (mergeContacts.fulfilled.match(res)) {
      toast.success("Contacts merged and moved successfully!");
      onSuccess?.();
      onClose();
    } else {
      toast.error("Failed to merge contacts");
    }
    setIsMerging(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Merge & Move Duplicates</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Resolve conflicts and choose a new destination.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <FiX className="text-gray-400" size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Primary Record Selection */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">1. Select Primary Record</h3>
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <label
                    key={contact.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50
                      ${masterId === contact.id ? "border-[#FFCA06] bg-[#FFCA06]/5" : "border-gray-100 dark:border-slate-800"}
                    `}
                  >
                    <input
                      type="radio"
                      name="masterContact"
                      value={contact.id}
                      checked={masterId === contact.id}
                      onChange={() => setMasterId(contact.id)}
                      className="mt-1 w-4 h-4 text-[#FFCA06] focus:ring-[#FFCA06]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 dark:text-white truncate">{contact.fullName || contact.name}</div>
                      <div className="text-[11px] text-gray-500 truncate">{contact.locationContext || "No location info"}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Right: Destination Selection */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">2. Destination (Mandatory)</h3>

                {/* Folder Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <FiFolder className="text-[#FFCA06]" /> Target Folder
                  </label>
                  <select
                    value={targetFolderId}
                    onChange={(e) => setTargetFolderId(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#FFCA06] outline-none transition-all"
                  >
                    <option value="">Select Destination Folder...</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                {/* List Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <FiList className="text-[#FFCA06]" /> Target Calling List
                  </label>
                  <select
                    value={targetListId}
                    onChange={(e) => setTargetListId(e.target.value)}
                    className="w-full p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-[#FFCA06] outline-none transition-all"
                  >
                    <option value="">Select Destination List...</option>
                    {lists.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20 text-[12px] text-amber-700 dark:text-amber-400 leading-relaxed">
                <strong>Attention:</strong> This will exclusively move the merged contact to the selected folder and list. All previous location memberships will be removed.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50/50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleMerge}
            disabled={isMerging}
            className={`px-8 py-2 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2
              ${isMerging ? "bg-gray-300 cursor-not-allowed" : "bg-[#FFCA06] hover:bg-[#ffcf29] text-[#2B3034] hover:shadow-lg active:scale-95"}
            `}
          >
            {isMerging ? (
              <div className="w-4 h-4 border-2 border-[#2B3034]/20 border-t-[#2B3034] rounded-full animate-spin"></div>
            ) : (
              <FiCheck />
            )}
            {isMerging ? "Merging..." : "Confirm Merge & Move"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MergeDuplicateModal;
