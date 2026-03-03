import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import { FiUploadCloud, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { LuChevronDown } from "react-icons/lu";
import {
  useContact,
  type ContactList,
  type ContactGroup,
} from "@/hooks/useContact";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

interface ImportContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ImportContactModal: React.FC<ImportContactModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const {
    getContactLists,
    getContactGroups,
    importContactsCSV,
    loading: hookLoading,
  } = useContact();

  const [lists, setLists] = useState<ContactList[]>([]);
  const [groups, setGroups] = useState<ContactGroup[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [selectedList, setSelectedList] = useState<ContactList | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<ContactGroup | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState("");
  const [keepOld, setKeepOld] = useState(false);

  // UI state
  const [listDropdownOpen, setListDropdownOpen] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [allLists, allGroups] = await Promise.all([
            getContactLists(),
            getContactGroups(),
          ]);
          setLists(allLists);
          setGroups(allGroups);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          toast.error("Failed to load lists and groups");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      // Reset form when closing
      setSelectedList(null);
      setSelectedGroup(null);
      setFile(null);
      setType("");
      setKeepOld(false);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type !== "text/csv" &&
        !selectedFile.name.endsWith(".csv")
      ) {
        toast.error("Please upload a CSV file");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (
        droppedFile.type !== "text/csv" &&
        !droppedFile.name.endsWith(".csv")
      ) {
        toast.error("Please upload a CSV file");
        return;
      }
      setFile(droppedFile);
    }
  };

  const handleSubmit = async () => {
    if (!selectedList && !selectedGroup) {
      toast.error("Please select either a List or a Group");
      return;
    }
    if (selectedList && selectedGroup) {
      toast.error("Selection rule: Select either a List OR a Group, not both");
      return;
    }
    if (!file) {
      toast.error("Please upload a CSV file");
      return;
    }
    if (!type.trim()) {
      toast.error("Type field is required");
      return;
    }

    // Prepare data for submission
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    formData.append("keepOld", String(keepOld));
    if (selectedList) formData.append("contactListId", selectedList.id);
    if (selectedGroup) formData.append("contactGroupId", selectedGroup.id);

    // Create a plain object for logging
    const submissionLog = {
      type,
      keepOld,
      contactListId: selectedList?.id || null,
      contactGroupId: selectedGroup?.id || null,
      fileName: file.name,
    };

    console.log("JSON Payload to Backend:", submissionLog);

    try {
      await importContactsCSV(formData);
      toast.success("Imported successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Import failed:", error);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {hookLoading && <Loader />}
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-3"
        onClick={onClose}
      >
        <div
          className="bg-white w-full max-w-[460px] rounded-[24px] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-white">
            <h2 className="text-[18px] font-semibold text-gray-900">
              Import Contacts
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            >
              <IoClose size={22} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-3">
              {/* List Dropdown */}
              <div className="space-y-1 relative">
                <label className="text-[12px] font-[400] text-gray-700 ml-1">
                  Select List
                </label>
                <button
                  disabled={!!selectedGroup || loading}
                  onClick={() => setListDropdownOpen(!listDropdownOpen)}
                  className={`w-full flex items-center justify-between px-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-[12px] text-[14px] transition-all
                  ${!!selectedGroup ? "opacity-50 cursor-not-allowed" : "hover:border-gray-300 active:ring-2 active:ring-gray-100"}
                  ${selectedList ? "text-gray-900 font-[400]" : "text-gray-500"}`}
                >
                  <span className="truncate">
                    {selectedList ? selectedList.name : "Choose List"}
                  </span>
                  <LuChevronDown
                    className={`transition-transform duration-200 ${listDropdownOpen ? "rotate-180" : ""}`}
                    size={16}
                  />
                </button>

                {listDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-100 shadow-xl rounded-[12px] overflow-hidden py-1 max-h-[180px] overflow-y-auto">
                    <div
                      className="px-4 py-1.5 hover:bg-gray-50 cursor-pointer text-[13px] text-gray-500 italic"
                      onClick={() => {
                        setSelectedList(null);
                        setListDropdownOpen(false);
                      }}
                    >
                      None
                    </div>
                    {lists.map((list) => (
                      <div
                        key={list.id}
                        className="px-4 py-1.5 hover:bg-gray-50 cursor-pointer text-[13px] text-gray-700"
                        onClick={() => {
                          setSelectedList(list);
                          setListDropdownOpen(false);
                        }}
                      >
                        {list.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Group Dropdown */}
              <div className="space-y-1 relative">
                <label className="text-[12px] font-[400] text-gray-700 ml-1">
                  Select Group
                </label>
                <button
                  disabled={!!selectedList || loading}
                  onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                  className={`w-full flex items-center justify-between px-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-[12px] text-[14px] transition-all
                  ${!!selectedList ? "opacity-50 cursor-not-allowed" : "hover:border-gray-300 active:ring-2 active:ring-gray-100"}
                  ${selectedGroup ? "text-gray-900 font-[400]" : "text-gray-500"}`}
                >
                  <span className="truncate">
                    {selectedGroup ? selectedGroup.name : "Choose Group"}
                  </span>
                  <LuChevronDown
                    className={`transition-transform duration-200 ${groupDropdownOpen ? "rotate-180" : ""}`}
                    size={16}
                  />
                </button>

                {groupDropdownOpen && (
                  <div className="absolute z-10 w-full bg-white border border-gray-100 shadow-xl rounded-[12px] overflow-hidden py-1 max-h-[180px] overflow-y-auto">
                    <div
                      className="px-4 py-1.5 hover:bg-gray-50 cursor-pointer text-[13px] text-gray-500 italic"
                      onClick={() => {
                        setSelectedGroup(null);
                        setGroupDropdownOpen(false);
                      }}
                    >
                      None
                    </div>
                    {groups.map((group) => (
                      <div
                        key={group.id}
                        className="px-4 py-1.5 hover:bg-gray-50 cursor-pointer text-[13px] text-gray-700"
                        onClick={() => {
                          setSelectedGroup(group);
                          setGroupDropdownOpen(false);
                        }}
                      >
                        {group.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* File Upload Box */}
            <div className="space-y-1">
              <label className="text-[12px] font-medium text-gray-700 ml-1">
                Upload CSV File
              </label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-[16px] p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all
                ${file ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-[#F8F9FA] hover:border-blue-300 hover:bg-blue-50/10"}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".csv"
                />
                {file ? (
                  <>
                    <div className="p-2 bg-green-100 rounded-full text-green-600">
                      <FiCheckCircle size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-semibold text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-[11px] text-red-500 font-medium hover:underline"
                    >
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-blue-50 rounded-full text-blue-500">
                      <FiUploadCloud size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-[13px] font-medium text-gray-900">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-[11px] text-gray-500">
                        CSV files only
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Type Input */}
            <div className="space-y-1">
              <label className="text-[12px] font-medium text-gray-700 ml-1">
                Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                placeholder="Enter value"
                className="w-full px-4 py-2 bg-[#F8F9FA] border border-gray-200 rounded-[12px] text-[14px] outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Keep Old Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer group pb-1">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={keepOld}
                  onChange={(e) => setKeepOld(e.target.checked)}
                  className="peer h-4.5 w-4.5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:bg-[#FFCA06] checked:border-[#FFCA06]"
                />
                <svg
                  className="absolute h-3 w-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-[13px] text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                Keep Old (Handle Duplicates)
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-[12px] hover:bg-gray-50 transition-colors text-[14px]"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2.5 bg-[#FFCA06] text-black font-semibold rounded-[12px] hover:bg-[#eab700] transition-colors shadow-sm text-[14px]"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default ImportContactModal;
