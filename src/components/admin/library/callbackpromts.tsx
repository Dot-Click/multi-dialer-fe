import { useState, useEffect } from "react";
import { HiOutlineSearch, HiPlus, HiX } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import { useCallbackPrompt, type CallbackPrompt, type RecordingType } from "@/hooks/useCallbackPrompt";
import { toast } from "react-hot-toast";

// ======================================================
// TYPES
// ======================================================

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { templateName: string; recordingType: RecordingType }) => void;
  recordingData: CallbackPrompt | null;
  loading: boolean;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

// ======================================================
// DELETE MODAL
// ======================================================
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loading }: DeleteModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1200] p-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm text-center p-8">
        <div className="mx-auto flex items-center justify-center w-fit">
          <IoWarningOutline className="text-3xl text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mt-5">Delete Prompt?</h3>
        <p className="text-sm text-gray-500 mt-2">
          Once deleted, this action cannot be undone. Are you sure?
        </p>
        <div className="mt-8 flex justify-center space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 w-full bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-8 py-2.5 w-full bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// ADD/EDIT MODAL
// ======================================================
const RecordingModal = ({ isOpen, onClose, onSave, recordingData, loading }: RecordingModalProps) => {
  const [templateName, setTemplateName] = useState("");
  const [recordingType, setRecordingType] = useState<RecordingType>("VOICE_MAIL");

  useEffect(() => {
    if (recordingData && isOpen) {
      setTemplateName(recordingData.templateName);
      setRecordingType(recordingData.recordingType);
    } else {
      setTemplateName("");
      setRecordingType("VOICE_MAIL");
    }
  }, [recordingData, isOpen]);

  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error("Template Name is required");
      return;
    }
    onSave({ templateName, recordingType });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {recordingData ? "Edit Callback Prompt" : "Add Callback Prompt"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <HiX className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="bg-gray-100 p-3 flex flex-col gap-1 rounded-lg focus-within:ring-2 focus-within:ring-yellow-400">
            <label className="text-xs font-medium text-gray-600">Template Name</label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full bg-transparent outline-none text-sm"
              placeholder="e.g. Standard Voice Mail"
            />
          </div>

          <div className="bg-gray-100 p-3 flex flex-col gap-1 rounded-lg focus-within:ring-2 focus-within:ring-yellow-400">
            <label className="text-xs font-medium text-gray-600">Type of Recording</label>
            <select
              value={recordingType}
              onChange={(e) => setRecordingType(e.target.value as RecordingType)}
              className="w-full bg-transparent outline-none text-sm cursor-pointer"
            >
              <option value="VOICE_MAIL">Voice Mail</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="EMAIL_VIDEO">Email Video</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center items-center p-5 border-t border-gray-200 space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 w-full bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-2.5 w-full bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ======================================================
// MAIN COMPONENT
// ======================================================
const CallBackPromts = () => {
  const { getCallbackPrompts, createCallbackPrompt, updateCallbackPrompt, deleteCallbackPrompt, loading } = useCallbackPrompt();
  const [prompts, setPrompts] = useState<CallbackPrompt[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [promptToEdit, setPromptToEdit] = useState<CallbackPrompt | null>(null);
  const [promptToDeleteId, setPromptToDeleteId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchPrompts = async () => {
    const data = await getCallbackPrompts();
    setPrompts(data);
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const handleAdd = () => {
    setPromptToEdit(null);
    setIsModalOpen(true);
  };

  const handleSave = async (data: { templateName: string; recordingType: RecordingType }) => {
    let result;
    if (promptToEdit) {
      result = await updateCallbackPrompt(promptToEdit.id, data);
    } else {
      // createdBy is required by backend schema. For now we use "Admin" or similar.
      // Ideally this should come from auth state.
      result = await createCallbackPrompt({ ...data, createdBy: "Admin" });
    }

    if (result) {
      toast.success(`Prompt ${promptToEdit ? "updated" : "created"} successfully`);
      fetchPrompts();
      setIsModalOpen(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setPromptToDeleteId(id);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (promptToDeleteId) {
      const success = await deleteCallbackPrompt(promptToDeleteId);
      if (success) {
        toast.success("Prompt deleted successfully");
        fetchPrompts();
      }
    }
    setIsDeleteModalOpen(false);
  };

  const filteredPrompts = prompts.filter((p) =>
    p.templateName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-[#F7F7F7] min-h-[60vh] p-6 rounded-2xl">
      {/* Search + Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div className="relative w-full sm:w-[40%]">
          <input
            type="text"
            placeholder="Search by prompt name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full bg-white placeholder:text-sm text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <HiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={handleAdd}
          className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
        >
          <HiPlus className="h-5 w-5 mr-2" />
          Add Prompt
        </button>
      </div>

      {/* Warning if no prompts */}
      {!loading && filteredPrompts.length === 0 && (
        <div className="text-center py-10 text-gray-500">No prompts found.</div>
      )}

      {/* Prompts List */}
      <div className="space-y-3">
        {filteredPrompts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:shadow-md transition border border-gray-100"
          >
            <div className="font-medium text-gray-900 w-full sm:w-1/4 truncate">{p.templateName}</div>
            <div className="w-full sm:w-3/4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <span className="text-gray-500 text-xs block truncate uppercase tracking-wider font-semibold">Type of recording</span>
                <span className="font-medium text-gray-900">{p.recordingType.replace(/_/g, " ")}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block truncate uppercase tracking-wider font-semibold">Created by</span>
                <span className="font-medium text-gray-900 truncate">{p.library?.user?.fullName || p.createdBy}</span>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-4">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs block truncate uppercase tracking-wider font-semibold">Created on</span>
                  <span className="font-medium text-gray-900 whitespace-nowrap">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="relative flex-shrink-0">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <BsThreeDots className="h-5 w-5" />
                  </button>
                  {openMenuId === p.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-20 overflow-hidden">
                      <button
                        onClick={() => {
                          setPromptToEdit(p);
                          setIsModalOpen(true);
                          setOpenMenuId(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(p.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <RecordingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        recordingData={promptToEdit}
        loading={loading}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </div>
  );
};

export default CallBackPromts;
