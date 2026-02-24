import { useState, useEffect } from "react";
import { HiOutlineSearch, HiPlus, HiX } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import { useScript, type ScriptData } from "@/hooks/useScript";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

// =================================================================
// DATA TYPES AND INTERFACES
// =================================================================

interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { scriptName: string; scriptText: string }) => void;
  scriptData: ScriptData | null;
  loading?: boolean;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

// =================================================================
// DELETE CONFIRMATION MODAL COMPONENT
// =================================================================

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, loading }: DeleteModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-1200 p-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm text-center p-8">
        <div className="mx-auto flex items-center justify-center w-fit">
          <span className="text-3xl text-red-600"><IoWarningOutline /></span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mt-5">Delete Script?</h3>
        <p className="text-sm text-gray-500 mt-2">
          Once deleted, this action cannot be undone. Are you sure?
        </p>
        <div className="mt-8 flex justify-center space-x-3">
          <button onClick={onClose} disabled={loading} className="px-6 py-2.5 w-full bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="px-8 py-2.5 w-full bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50">
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// =================================================================
// EDIT/ADD SCRIPT MODAL COMPONENT
// =================================================================

const ScriptModal = ({ isOpen, onClose, onSave, scriptData, loading }: ScriptModalProps) => {
  const [scriptName, setScriptName] = useState("");
  const [scriptText, setScriptText] = useState("");

  useEffect(() => {
    if (scriptData && isOpen) {
      setScriptName(scriptData.scriptName);
      setScriptText(scriptData.scriptText);
    } else {
      setScriptName("");
      setScriptText("");
    }
  }, [scriptData, isOpen]);

  const handleSave = () => {
    if (!scriptName.trim()) {
      toast.error("Script name is required.");
      return;
    }
    if (!scriptText.trim()) {
      toast.error("Script text is required.");
      return;
    }
    onSave({ scriptName, scriptText });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-1100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{scriptData ? "Edit Script" : "Create Call Script "}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><HiX className="h-6 w-6 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-gray-100 px-3 py-2 flex flex-col gap-1 border border-gray-200 rounded-lg text-sm focus-within:ring-2 focus-within:ring-yellow-400">
            <label className="block text-sm font-medium text-[#495057]">Script Name</label>
            <input type="text" value={scriptName} onChange={(e) => setScriptName(e.target.value)} className="w-full bg-transparent outline-none" placeholder="Enter script name" />
          </div>
          <div className="bg-gray-100 px-3 py-2 flex flex-col gap-1 border border-gray-200 rounded-lg text-sm focus-within:ring-2 focus-within:ring-yellow-400">
            <label className="block text-sm font-medium text-[#495057]">Script text</label>
            <textarea value={scriptText} onChange={(e) => setScriptText(e.target.value)} rows={8} className="w-full bg-transparent outline-none resize-none" placeholder="Enter script text" />
          </div>
        </div>
        <div className="flex justify-center items-center p-5 border-t border-gray-200 space-x-3">
          <button onClick={onClose} disabled={loading} className="px-6 py-2.5 w-full bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="px-8 py-2.5 w-full bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};


// =================================================================
// MAIN SCRIPT COMPONENT
// =================================================================

const Script = () => {
  const [scripts, setScripts] = useState<ScriptData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { getScripts, createScript, updateScript, deleteScript, loading } = useScript();

  // States for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // States to manage data
  const [scriptToEdit, setScriptToEdit] = useState<ScriptData | null>(null);
  const [scriptToDeleteId, setScriptToDeleteId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchScripts = async () => {
    const data = await getScripts();
    setScripts(data);
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  // --- Handlers for Add/Edit Modal ---
  const handleAddClick = () => {
    setScriptToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (script: ScriptData) => {
    setScriptToEdit(script);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveScript = async (savedScript: { scriptName: string, scriptText: string }) => {
    try {
      if (scriptToEdit) {
        await updateScript(scriptToEdit.id, savedScript);
        toast.success("Script updated successfully");
      } else {
        await createScript(savedScript);
        toast.success("Script created successfully");
      }
      setIsEditModalOpen(false);
      fetchScripts();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  // --- Handlers for Delete Modal ---
  const openDeleteModal = (id: string) => {
    setScriptToDeleteId(id);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setScriptToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (scriptToDeleteId) {
      const success = await deleteScript(scriptToDeleteId);
      if (success) {
        toast.success("Script deleted successfully");
        fetchScripts();
      } else {
        toast.error("Failed to delete script");
      }
    }
    closeDeleteModal();
  };

  // --- Other Handlers ---
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateScript(id, { status: !currentStatus });
      toast.success(`Script ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      fetchScripts();
    } catch (error: any) {
      toast.error(error.message || "Failed to toggle status");
    }
  };

  const filteredScripts = scripts.filter(s =>
    s.scriptName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      {/* Search + Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <div className="relative w-full sm:w-[40%] py-[12px] px-[24px] border-[1.5px] border-[#D8DCE1] bg-white rounded-[1000000px]">
          <input
            type="text"
            placeholder="Search by script name"
            className="w-full text-[#495057] font-normal text-[16px] placeholder:text-sm text-sm focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <HiOutlineSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#495057]" />
        </div>
        <button onClick={handleAddClick} className="bg-[#FFCA06] text-[16px] hover:bg-yellow-500 text-[#000000] font-medium py-[8px] pr-[24px] pl-[20px] rounded-[12px] flex items-center transition-all">
          <HiPlus className="h-5 w-5 mr-2" />
          Add Script
        </button>
      </div>

      {/* Script cards */}
      <div className="space-y-4">
        {loading && scripts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Loading scripts...</div>
        ) : filteredScripts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No scripts found</div>
        ) : (
          filteredScripts.map((script) => (
            <div
              key={script.id}
              className="bg-white p-[16px] rounded-[16px] shadow-sm border border-[#EBEDF0] grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto_auto] items-center gap-x-4 gap-y-3 transition-all"
            >
              {/* Script Name */}
              <div className="font-medium text-[14px] text-[#0E1011] col-span-2 lg:col-span-1">
                {script.scriptName}
              </div>

              {/* Created By */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[#495057] text-[12px] font-normal">
                  Created by
                </span>
                <span className="font-medium text-[#2B3034] text-[14px] truncate">
                  {script.library?.user?.fullName || "System"}
                </span>
              </div>

              {/* Created On */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[#495057] text-[12px] font-normal">
                  Created on
                </span> 
                <span className="font-medium text-[#2B3034] text-[14px]">
                  {dayjs(script.createdAt).format("DD/MM/YYYY")}
                </span>
              </div>

              {/* Modified On */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[#495057] text-[12px] font-normal">
                  Modified on
                </span>
                <span className="font-medium text-[#2B3034] text-[14px]">
                  {dayjs(script.updatedAt).format("DD/MM/YYYY")}
                </span>
              </div>

              {/* STATUS COLUMN */}
              <div className="flex flex-col gap-1.5 mr-20">
                <span className="text-[#495057] text-[12px] font-normal">
                  Status
                </span>
                <div className="flex items-center">
                  {/* Toggle */}
                  <label
                    htmlFor={`toggle-${script.id}`}
                    className="flex items-center cursor-pointer select-none"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={`toggle-${script.id}`}
                        className="sr-only"
                        checked={script.status}
                        onChange={() => handleToggleStatus(script.id, script.status)}
                      />
                      <div
                        className={`block w-[48px] h-[24px] rounded-[25.95px] transition-colors duration-300 ${script.status ? "bg-black" : "bg-gray-300"
                          }`}
                      ></div>
                      <div
                        className={`dot absolute left-0.5 top-0.5 bg-white w-[20px] h-[20px] rounded-[25.95px] transition-transform duration-300 ${script.status ? "translate-x-6" : ""
                          }`}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* THREE DOTS - ALWAYS AT THE END */}
              <div className="relative justify-self-end">
                <button
                  onClick={() =>
                    setOpenMenuId(openMenuId === script.id ? null : script.id)
                  }
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <BsThreeDots className="h-5 w-5" />
                </button>

                {openMenuId === script.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-10 border">
                    <button
                      onClick={() => handleEditClick(script)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(script.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <ScriptModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveScript}
        scriptData={scriptToEdit}
        loading={loading}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={loading}
      />
    </div>
  );
};

export default Script;