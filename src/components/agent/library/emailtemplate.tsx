import { useState, useEffect } from "react";
import { HiOutlineSearch, HiPlus, HiX } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import Signature from "@/components/admin/library/signature";
import { useLocation } from "react-router-dom";
import {
  useEmailTemplate,
  type EmailTemplate as EmailTemplateData,
} from "@/hooks/useEmailTemplate";
import { toast } from "react-hot-toast";
import Loader from "@/components/common/Loader";

// =================================================================
// DATA TYPES AND INTERFACES
// =================================================================

interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    templateName: string;
    subject: string;
    content: string;
  }) => void;
  templateData: EmailTemplateData | null;
  loading: boolean;
}

// DELETE MODAL
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: any) => {
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
          Once deleted, this cannot be undone.
        </p>

        <div className="mt-8 flex justify-center space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 w-full bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 disabled:opacity-50"
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

// MODAL
const EmailTemplateModal = ({
  isOpen,
  onClose,
  onSave,
  templateData,
  loading,
}: EmailTemplateModalProps) => {
  const [templateName, setTemplateName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (templateData && isOpen) {
      setTemplateName(templateData.templateName);
      setSubject(templateData.subject);
      setContent(templateData.content);
    } else {
      setTemplateName("");
      setSubject("");
      setContent("");
    }
  }, [templateData, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!templateName || !subject || !content) {
      toast.error("Please fill all fields");
      return;
    }
    onSave({ templateName, subject, content });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1100] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {templateData ? "Edit Email Template" : "Add Email Template"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            <HiX className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Name */}
          <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col gap-1 text-sm">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Template name
            </label>
            <input
              value={templateName}
              className="bg-transparent outline-none dark:text-white"
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>

          {/* Subject */}
          <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col gap-1 text-sm">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject
            </label>
            <input
              value={subject}
              className="bg-transparent outline-none dark:text-white"
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
            />
          </div>

          {/* Content */}
          <div className="bg-gray-100 dark:bg-slate-900 p-3 rounded-lg border border-gray-200 dark:border-slate-700 flex flex-col gap-1 text-sm">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Content
            </label>
            <textarea
              value={content}
              rows={8}
              onChange={(e) => setContent(e.target.value)}
              className="bg-transparent outline-none resize-none dark:text-white"
              placeholder="Enter email content"
            />
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 dark:border-slate-700 flex space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full bg-gray-200 dark:bg-slate-700 dark:text-white py-2.5 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 font-semibold disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-yellow-400 py-2.5 rounded-lg font-semibold hover:bg-yellow-500 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

// =================================================================
// MAIN COMPONENT — NOW SCRIPT STYLE
// =================================================================

const EmailTemplate = () => {
  const {
    getEmailTemplates,
    createEmailTemplate,
    updateEmailTemplate,
    deleteEmailTemplate,
    loading,
  } = useEmailTemplate();
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplateData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] =
    useState<EmailTemplateData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [templateToDeleteId, setTemplateToDeleteId] = useState<string | null>(
    null,
  );

  const location = useLocation();
  const showSignature = location.pathname === "/admin/library";

  const fetchTemplates = async () => {
    const data = await getEmailTemplates();
    setEmailTemplates(data);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSaveTemplate = async (data: {
    templateName: string;
    subject: string;
    content: string;
  }) => {
    if (templateToEdit) {
      const updated = await updateEmailTemplate(templateToEdit.id, data);
      if (updated) {
        toast.success("Template updated successfully");
        setIsEditModalOpen(false);
        fetchTemplates();
      }
    } else {
      const created = await createEmailTemplate(data);
      if (created) {
        toast.success("Template created successfully");
        setIsEditModalOpen(false);
        fetchTemplates();
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (templateToDeleteId) {
      const success = await deleteEmailTemplate(templateToDeleteId);
      if (success) {
        toast.success("Template deleted successfully");
        setIsDeleteModalOpen(false);
        fetchTemplates();
      }
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const updated = await updateEmailTemplate(id, { status: !currentStatus });
    if (updated) {
      setEmailTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: updated.status } : t)),
      );
      toast.success(`Template ${updated.status ? "activated" : "deactivated"}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  const filteredTemplates = emailTemplates.filter((t) =>
    t.templateName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <div className="relative w-full sm:w-[40%] py-[12px] px-[24px] border-[1.5px] border-[#D8DCE1] dark:border-slate-700 bg-white dark:bg-slate-800 rounded-[1000000px]">
          <input
            placeholder="Search by email template name"
            className="w-full text-[#495057] dark:text-white bg-transparent text-sm outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <HiOutlineSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-[#495057] dark:text-gray-400" />
        </div>

        <button
          onClick={() => {
            setTemplateToEdit(null);
            setIsEditModalOpen(true);
          }}
          className="bg-[#FFCA06] hover:bg-yellow-500 py-[8px] px-[24px] rounded-[12px] flex items-center text-[16px] font-medium text-black"
        >
          <HiPlus className="mr-2" /> Add Template
        </button>
      </div>

      {/* SCRIPT STYLE CARDS */}
      <div className="space-y-4">
        {filteredTemplates.length > 0
          ? filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white dark:bg-slate-800 p-[16px] rounded-[16px] shadow-sm border border-[#EBEDF0] dark:border-slate-700 grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto_auto] gap-x-4 gap-y-3 items-center"
              >
                {/* NAME */}
                <div className="font-[500] text-[14px] text-[#0E1011] dark:text-white col-span-2 lg:col-span-1">
                  {template.templateName}
                </div>

                {/* CREATED BY */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created by
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {template.library?.user?.fullName || "System"}
                  </span>
                </div>

                {/* CREATED ON */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Created on
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* MODIFIED */}
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Modified on
                  </span>
                  <span className="text-sm font-medium dark:text-white">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {/* STATUS */}
                <div className="flex flex-col gap-1 mr-20">
                  <span className="text-[#495057] dark:text-gray-400 text-[12px] font-[400]">
                    Status
                  </span>

                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={template.status}
                        onChange={() =>
                          handleToggleStatus(template.id, !!template.status)
                        }
                      />
                      <div
                        className={`block w-[48px] h-[24px] rounded-full transition-colors ${template.status ? "bg-black" : "bg-gray-300 dark:bg-slate-700"}`}
                      ></div>
                      <div
                        className={`dot absolute left-0.5 top-0.5 bg-white w-[20px] h-[20px] rounded-full transition-transform ${template.status ? "translate-x-6" : ""}`}
                      ></div>
                    </div>
                  </label>
                </div>

                {/* 3 DOT MENU */}
                <div className="relative justify-self-end">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === template.id ? null : template.id,
                      )
                    }
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
                  >
                    <BsThreeDots className="h-5 w-5" />
                  </button>

                  {openMenuId === template.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 border dark:border-slate-700 shadow-xl rounded-lg z-[100]">
                      <button
                        onClick={() => {
                          setTemplateToEdit(template);
                          setIsEditModalOpen(true);
                          setOpenMenuId(null);
                        }}
                        className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setTemplateToDeleteId(template.id);
                          setIsDeleteModalOpen(true);
                          setOpenMenuId(null);
                        }}
                        className="block px-4 py-2 text-sm w-full text-left text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700"
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
                No email templates found.
              </div>
            )}

        {loading && (
          <Loader/>
        )}

        {showSignature && <Signature />}
      </div>

      {/* MODALS */}
      <EmailTemplateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTemplate}
        templateData={templateToEdit}
        loading={loading}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={loading}
      />
    </div>
  );
};

export default EmailTemplate;
