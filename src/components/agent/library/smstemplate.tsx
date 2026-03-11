import { useState, useEffect } from "react";
import { HiOutlineSearch, HiPlus, HiX } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import {
  useSMSTemplate,
  type SMSTemplate as SMSTemplateData,
} from "@/hooks/useSMSTemplate";
import { toast } from "react-hot-toast";
import Loader from "@/components/common/Loader";

// =================================================================
// DATA TYPES AND INTERFACES
// =================================================================

interface SMSTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { templateName: string; content: string }) => void;
  templateData: SMSTemplateData | null;
  loading: boolean;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

// =================================================================
// DELETE CONFIRMATION MODAL
// =================================================================

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: DeleteModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1200] p-3">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm text-center p-8">
        <div className="mx-auto flex items-center justify-center w-fit">
          <span className="text-3xl text-red-600">
            <IoWarningOutline />
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-5">
          Delete Template?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Once deleted, this action cannot be undone. Are you sure?
        </p>
        <div className="mt-8 flex justify-center space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 w-full bg-gray-200 dark:bg-slate-700 dark:text-white text-gray-700 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-8 py-2.5 w-full bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// =================================================================
// ADD/EDIT SMS TEMPLATE MODAL
// =================================================================

const SMSTemplateModal = ({
  isOpen,
  onClose,
  onSave,
  templateData,
  loading,
}: SMSTemplateModalProps) => {
  const [templateName, setTemplateName] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (templateData && isOpen) {
      setTemplateName(templateData.templateName);
      setContent(templateData.content);
    } else {
      setTemplateName("");
      setContent("");
    }
  }, [templateData, isOpen]);

  const handleSave = () => {
    if (!templateName.trim()) {
      toast.error("Template Name is required.");
      return;
    }
    if (!content.trim()) {
      toast.error("Content is required.");
      return;
    }
    onSave({ templateName, content });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1100] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {templateData ? "Edit SMS Template" : "Add SMS Template"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <HiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-100 dark:bg-slate-900 px-3 py-2 flex flex-col gap-1 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus-within:ring-2 focus-within:ring-yellow-400 transition-all">
            <label className="block text-sm font-medium text-[#495057] dark:text-gray-300">
              Template Name
            </label>
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              className="w-full bg-transparent outline-none dark:text-white"
              placeholder="Enter template name"
            />
          </div>

          <div className="bg-gray-100 dark:bg-slate-900 px-3 py-2 flex flex-col gap-1 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus-within:ring-2 focus-within:ring-yellow-400 transition-all">
            <label className="block text-sm font-medium text-[#495057] dark:text-gray-300">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full bg-transparent outline-none resize-none dark:text-white"
              placeholder="Enter SMS content"
            />
          </div>
        </div>

        <div className="flex justify-center items-center p-5 border-t border-gray-200 dark:border-slate-700 space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 w-full bg-gray-200 dark:bg-slate-700 dark:text-white text-gray-700 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-2.5 w-full bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// =================================================================
// MAIN SMS TEMPLATE COMPONENT
// =================================================================

const SMSTemplate = () => {
  const {
    getSMSTemplates,
    createSMSTemplate,
    updateSMSTemplate,
    deleteSMSTemplate,
    loading,
  } = useSMSTemplate();
  const [smsTemplates, setSMSTemplates] = useState<SMSTemplateData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected template
  const [templateToEdit, setTemplateToEdit] = useState<SMSTemplateData | null>(
    null,
  );
  const [templateToDeleteId, setTemplateToDeleteId] = useState<string | null>(
    null,
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const fetchTemplates = async () => {
    const data = await getSMSTemplates();
    setSMSTemplates(data);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // Handlers
  const handleAddClick = () => {
    setTemplateToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (template: SMSTemplateData) => {
    setTemplateToEdit(template);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveTemplate = async (savedTemplate: {
    templateName: string;
    content: string;
  }) => {
    if (templateToEdit) {
      const updated = await updateSMSTemplate(templateToEdit.id, savedTemplate);
      if (updated) {
        toast.success("Template updated successfully");
        setIsEditModalOpen(false);
        fetchTemplates();
      }
    } else {
      const created = await createSMSTemplate(savedTemplate);
      if (created) {
        toast.success("Template created successfully");
        setIsEditModalOpen(false);
        fetchTemplates();
      }
    }
  };

  const openDeleteModal = (id: string) => {
    setTemplateToDeleteId(id);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTemplateToDeleteId(null);
  };

  const handleConfirmDelete = async () => {
    if (templateToDeleteId) {
      const success = await deleteSMSTemplate(templateToDeleteId);
      if (success) {
        toast.success("Template deleted successfully");
        fetchTemplates();
      }
    }
    closeDeleteModal();
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const updated = await updateSMSTemplate(id, { status: !currentStatus });
    if (updated) {
      setSMSTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: updated.status } : t)),
      );
      toast.success(`Template ${updated.status ? "activated" : "deactivated"}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  const filteredTemplates = smsTemplates.filter((t) =>
    t.templateName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <div className="relative w-full sm:w-[40%] py-[12px] px-[24px] border-[1.5px] border-[#D8DCE1] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-[1000000px]">
          <input
            type="text"
            placeholder="Search by template name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-[#495057] dark:text-white bg-transparent font-[400] text-[16px] placeholder:text-sm focus:outline-none"
          />
          <HiOutlineSearch className="absolute right-5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#495057] dark:text-gray-400" />
        </div>
        <button
          onClick={handleAddClick}
          className="bg-[#FFCA06] text-[16px] hover:bg-yellow-500 text-[#000] font-[500] py-[8px] pr-[24px] pl-[20px] rounded-[12px] flex items-center transition-all shadow-sm"
        >
          <HiPlus className="h-5 w-5 mr-2" />
          Add Template
        </button>
      </div>

      <div className="space-y-4">
        {filteredTemplates.length > 0
          ? filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-slate-800 p-[16px] rounded-[16px] shadow-sm border border-[#EBEDF0] dark:border-slate-700 grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto_auto] items-center gap-x-4 gap-y-3 transition-all hover:shadow-md"
              >
                {/* Name */}
                <div className="font-[500] text-[14px] text-[#0E1011] dark:text-white col-span-2 lg:col-span-1">
                  {template.templateName}
                </div>

                {/* Created By */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[#495057] dark:text-gray-400 text-[12px] font-[400]">
                    Created by
                  </span>
                  <span className="font-[500] text-[#2B3034] dark:text-white text-[14px] truncate">
                    {template.library?.user?.fullName || "System"}
                  </span>
                </div>

                {/* Created On */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[#495057] dark:text-gray-400 text-[12px] font-[400]">
                    Created on
                  </span>
                  <span className="font-[500] text-[#2B3034] dark:text-white text-[14px]">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Modified On */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[#495057] dark:text-gray-400 text-[12px] font-[400]">
                    Modified on
                  </span>
                  <span className="font-[500] text-[#2B3034] dark:text-white text-[14px]">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[#495057] dark:text-gray-400 text-[12px] font-[400]">
                    Status
                  </span>
                  <label
                    htmlFor={`toggle-${template.id}`}
                    className="flex items-center cursor-pointer select-none"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={`toggle-${template.id}`}
                        className="sr-only"
                        checked={template.status}
                        onChange={() =>
                          handleToggleStatus(template.id, !!template.status)
                        }
                      />
                      <div
                        className={`block w-[48px] h-[24px] rounded-[25.95px] transition-colors duration-300 ${
                          template.status
                            ? "bg-black dark:bg-yellow-400"
                            : "bg-gray-300 dark:bg-slate-700"
                        }`}
                      ></div>
                      <div
                        className={`dot absolute left-0.5 top-0.5 bg-white dark:bg-slate-900 w-[20px] h-[20px] rounded-[25.95px] transition-transform duration-300 ${
                          template.status ? "translate-x-6" : ""
                        }`}
                      ></div>
                    </div>
                  </label>
                </div>

                {/* Three Dots */}
                <div className="relative justify-self-end">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === template.id ? null : template.id,
                      )
                    }
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <BsThreeDots className="h-5 w-5" />
                  </button>
                  {openMenuId === template.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-lg shadow-xl z-50 border dark:border-slate-700 overflow-hidden">
                      <button
                        onClick={() => handleEditClick(template)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(template.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          : !loading && (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                No SMS templates found.
              </div>
            )}

        {loading && <Loader />}
      </div>

      {/* Modals */}
      <SMSTemplateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTemplate}
        templateData={templateToEdit}
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

export default SMSTemplate;
