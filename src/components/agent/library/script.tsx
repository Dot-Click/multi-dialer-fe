import { useState, useEffect } from "react";
import { HiOutlineSearch, HiPlus, HiX } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";

// =================================================================
// DATA TYPES AND INTERFACES
// =================================================================

interface ScriptData {
  id: number;
  name: string;
  text: string;
  createdBy: string;
  createdOn: string;
  modifiedOn: string;
  status: boolean;
}

interface ScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; text: string }) => void;
  scriptData: ScriptData | null;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// =================================================================
// DELETE CONFIRMATION MODAL COMPONENT
// =================================================================

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1200] p-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm text-center p-8">
        <div className="mx-auto flex items-center justify-center w-fit">
          <span className="text-3xl text-red-600"><IoWarningOutline /></span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mt-5">Delete Template?</h3>
        <p className="text-sm text-gray-500 mt-2">
          Once deleted, this action cannot be undone. Are you sure?
        </p>
        <div className="mt-8 flex justify-center space-x-3">
          <button onClick={onClose} className="px-6 py-2.5 w-full bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-8 py-2.5 w-full bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// =================================================================
// EDIT/ADD SCRIPT MODAL COMPONENT
// =================================================================

const ScriptModal = ({ isOpen, onClose, onSave, scriptData }: ScriptModalProps) => {
  // ... (Is component mein koi badlav nahi hai) ...
  const [scriptName, setScriptName] = useState("");
  const [scriptText, setScriptText] = useState("");
  useEffect(() => {
    if (scriptData && isOpen) {
      setScriptName(scriptData.name);
      setScriptText(scriptData.text);
    } else {
      setScriptName("");
      setScriptText("");
    }
  }, [scriptData, isOpen]);
  const handleSave = () => {
    if (!scriptName.trim()) {
      alert("Script name is required.");
      return;
    }
    onSave({ name: scriptName, text: scriptText });
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1100] p-4">
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
          <button onClick={onClose} className="px-6 py-2.5 w-full bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-8 py-2.5 w-full bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-colors">Save</button>
        </div>
      </div>
    </div>
  );
};


// =================================================================
// MAIN SCRIPT COMPONENT
// =================================================================

const Script = () => {
  const [scripts, setScripts] = useState<ScriptData[]>([
    { id: 1, name: "Script #1", text: "Bodega plaid ethical plant hell plaid hoodie kickstarter gochujang swag. Pour-over letterpress bespoke brunch selfies tofu kinfolk post-ironic gatekeep mug. Heard yuccie cronut pok yes bespoke semiotics. Vice tonx farm-to-table poke succulents. Readymade yuccie occupy pin I'm +1 ennui cliche af. \n\nPut shabby a twee yes fashion bodega kombucha toast hell.", createdBy: "John Lee", createdOn: "09/09/2025", modifiedOn: "09/09/2025", status: true },
    { id: 2, name: "Script #2", text: "This is the second script text.", createdBy: "Brooklyn Simmons", createdOn: "08/09/2025", modifiedOn: "08/09/2025", status: true },
    { id: 3, name: "Script #3", text: "And this is the third one for testing.", createdBy: "Devon Lane", createdOn: "07/09/2025", modifiedOn: "07/09/2025", status: false },
  ]);

  // States for modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // States to manage data
  const [scriptToEdit, setScriptToEdit] = useState<ScriptData | null>(null);
  const [scriptToDeleteId, setScriptToDeleteId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

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

  const handleSaveScript = (savedScript: { name: string, text: string }) => {
    if (scriptToEdit) {
      setScripts(prev => prev.map(s => s.id === scriptToEdit.id ? { ...s, ...savedScript, modifiedOn: new Date().toLocaleDateString('en-GB') } : s));
    } else {
      const newScript: ScriptData = { id: Date.now(), ...savedScript, createdBy: "Current User", createdOn: new Date().toLocaleDateString('en-GB'), modifiedOn: new Date().toLocaleDateString('en-GB'), status: true };
      setScripts(prev => [...prev, newScript]);
    }
    setIsEditModalOpen(false);
  };

  // --- Handlers for Delete Modal ---
  const openDeleteModal = (id: number) => {
    setScriptToDeleteId(id);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null); // Menu ko band kar dein
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setScriptToDeleteId(null);
  };

  const handleConfirmDelete = () => {
    if (scriptToDeleteId !== null) {
      setScripts(prev => prev.filter(script => script.id !== scriptToDeleteId));
    }
    closeDeleteModal();
  };

  // --- Other Handlers ---
  const handleToggleStatus = (id: number) => {
    setScripts(prev => prev.map(script => script.id === id ? { ...script, status: !script.status } : script));
  };

  return (
    <div className="">
      {/* Search + Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <div className="relative w-full sm:w-[40%] py-[12px] px-[24px] border-[1.5px] border-[#D8DCE1] bg-white rounded-[1000000px]">
          <input type="text" placeholder="Search by script name" className="w-full text-[#495057]   font-[400] text-[16px]   placeholder:text-sm text-sm focus:outline-none" />
          <HiOutlineSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#495057]" />
        </div>
        <button onClick={handleAddClick} className="bg-[#FFCA06] text-[16px] hover:bg-yellow-500 text-[#000000] font-[500] py-[8px] pr-[24px]  pl-[20px] rounded-[12px] flex items-center transition-all">
          <HiPlus className="h-5 w-5 mr-2" />
          Add Script
        </button>
      </div>

      {/* Script cards */}
      <div className="space-y-4">
        {scripts.map((script) => (
          <div
            key={script.id}
            className="bg-white p-[16px] rounded-[16px] shadow-sm border border-[#EBEDF0] grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto_auto] items-center gap-x-4 gap-y-3 transition-all"
          >
            {/* Script Name */}
            <div className="font-[500] text-[14px] text-[#0E1011] col-span-2 lg:col-span-1">
              {script.name}
            </div>

            {/* Created By */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[#495057] text-[12px] font-[400]">
                Created by
              </span>
              <span className="font-[500] text-[#2B3034] text-[14px] truncate">
                {script.createdBy}
              </span>
            </div>

            {/* Created On */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[#495057] text-[12px] font-[400]">
                Created on
              </span>
              <span className="font-[500] text-[#2B3034] text-[14px]">
                {script.createdOn}
              </span>
            </div>

            {/* Modified On */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[#495057] text-[12px] font-[400]">
                Modified on
              </span>
              <span className="font-[500] text-[#2B3034] text-[14px]">
                {script.modifiedOn}
              </span>
            </div>

            {/* STATUS COLUMN */}
            <div className="flex flex-col gap-1.5 mr-20">
              <span className="text-[#495057] text-[12px] font-[400]">
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
                      onChange={() => handleToggleStatus(script.id)}
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

        ))}
      </div>

      {/* Modals ko yahan render kiya ja raha hai */}
      <ScriptModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveScript}
        scriptData={scriptToEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Script;