import { useState, useEffect } from "react";
import { HiOutlineSearch, HiPlus, HiX } from "react-icons/hi";
import { BsThreeDots } from "react-icons/bs";
import { IoWarningOutline } from "react-icons/io5";
import Signature from "@/components/admin/library/signature";
import { useLocation } from "react-router-dom";

// =================================================================
// DATA TYPES AND INTERFACES
// =================================================================

interface EmailTemplateData {
  id: number;
  name: string;
  subject: string;
  content: string;
  createdBy: string;
  createdOn: string;
  modifiedOn: string;
  status: boolean;
}

interface EmailTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; subject: string; content: string }) => void;
  templateData: EmailTemplateData | null;
}

// DELETE MODAL
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1200] p-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm text-center p-8">
        <div className="mx-auto flex items-center justify-center w-fit">
          <span className="text-3xl text-red-600"><IoWarningOutline /></span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mt-5">Delete Template?</h3>
        <p className="text-sm text-gray-500 mt-2">Once deleted, this cannot be undone.</p>

        <div className="mt-8 flex justify-center space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 w-full bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-2.5 w-full bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// MODAL
const EmailTemplateModal = ({ isOpen, onClose, onSave, templateData }: EmailTemplateModalProps) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (templateData && isOpen) {
      setName(templateData.name);
      setSubject(templateData.subject);
      setContent(templateData.content);
    } else {
      setName('');
      setSubject('');
      setContent('');
    }
  }, [templateData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {templateData ? "Edit Email Template" : "Add Email Template"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <HiX className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Name */}
          <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 flex flex-col gap-1 text-sm">
            <label className="text-sm font-medium text-gray-700">Template name</label>
            <input value={name} className="bg-transparent outline-none" onChange={(e) => setName(e.target.value)} />
          </div>

          {/* Subject */}
          <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 flex flex-col gap-1 text-sm">
            <label className="text-sm font-medium text-gray-700">Subject</label>
            <input value={subject} className="bg-transparent outline-none" onChange={(e) => setSubject(e.target.value)} />
          </div>

          {/* Content */}
          <div className="bg-gray-100 p-3 rounded-lg border border-gray-200 flex flex-col gap-1 text-sm">
            <label className="text-sm font-medium text-gray-700">Email Content</label>
            <textarea value={content} rows={8} onChange={(e) => setContent(e.target.value)} className="bg-transparent outline-none resize-none" />
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 flex space-x-3">
          <button onClick={onClose} className="w-full bg-gray-200 py-2.5 rounded-lg hover:bg-gray-300 font-semibold">Cancel</button>
          <button onClick={() => onSave({ name, subject, content })}
            className="w-full bg-yellow-400 py-2.5 rounded-lg font-semibold hover:bg-yellow-500">
            Save
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
   const [emailTemplates, setEmailTemplates] = useState<EmailTemplateData[]>([
    {
      id: 1,
      name: "Email Template #1",
      subject: "Your business gets calls — but do they all turn into customers?",
      content: "Hi there! 👋\n\nCallScout helps companies win more customers with call analytics and automated quality control.\n\nTrack the performance of every call\nDetect customer losses in real time\nTrain your team to sell better with AI-powered insights\n\nTry CallScout free for 7 days and make sure no call slips away from your business.\n\n[🚀 Try it now]",
      createdBy: "John Lee",
      createdOn: "09/09/2025",
      modifiedOn: "09/09/2025",
      status: false,
    },
    {
      id: 2, name: "Email Template #2", subject: "Follow up on our conversation", content: "Hello! Just following up.", createdBy: "Brooklyn Simmons", createdOn: "08/09/2025", modifiedOn: "08/09/2025", status: true,
    },
    {
      id: 3, name: "Email Template #3", subject: "Special offer for you", content: "We have a special offer just for you!", createdBy: "Devon Lane", createdOn: "07/09/2025", modifiedOn: "07/09/2025", status: false,
    },
  ]);

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState<EmailTemplateData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [, setTemplateToDeleteId] = useState<number | null>(null);

  const location = useLocation();
  const showSignature = location.pathname === "/admin/library";

  const handleToggleStatus = (id: number) => {
    setEmailTemplates(prev =>
      prev.map(t => t.id === id ? { ...t, status: !t.status } : t)
    );
  };

  return (
    <div>
      {/* SEARCH + ADD BUTTON */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <div className="relative w-full sm:w-[40%] py-[12px] px-[24px] border-[1.5px] border-[#D8DCE1] bg-white rounded-[1000000px]">
          <input placeholder="Search by email template name"
            className="w-full text-[#495057] text-sm outline-none" />
          <HiOutlineSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-[#495057]" />
        </div>

        <button onClick={() => { setTemplateToEdit(null); setIsEditModalOpen(true); }}
          className="bg-[#FFCA06] hover:bg-yellow-500 py-[8px] px-[24px] rounded-[12px] flex items-center text-[16px] font-medium">
          <HiPlus className="mr-2" /> Add Template
        </button>
      </div>

      {/* SCRIPT STYLE CARDS */}
      <div className="space-y-4">
        {emailTemplates.map(template => (
          <div
            key={template.id}
            className="bg-white p-[16px] rounded-[16px] shadow-sm border border-[#EBEDF0] grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto_auto] gap-x-4 gap-y-3 items-center">

            {/* NAME */}
            <div className="font-[500] text-[14px] text-[#0E1011] col-span-2 lg:col-span-1">
              {template.name}
            </div>

            {/* CREATED BY */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Created by</span>
              <span className="text-sm font-medium">{template.createdBy}</span>
            </div>

            {/* CREATED ON */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Created on</span>
              <span className="text-sm font-medium">{template.createdOn}</span>
            </div>

            {/* MODIFIED */}
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Modified on</span>
              <span className="text-sm font-medium">{template.modifiedOn}</span>
            </div>

            {/* STATUS */}
            <div className="flex flex-col gap-1 mr-20">
              <span className="text-[#495057] text-[12px] font-[400]">Status</span>

              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={template.status}
                    onChange={() => handleToggleStatus(template.id)}
                  />
                  <div className={`block w-[48px] h-[24px] rounded-full transition-colors ${template.status ? "bg-black" : "bg-gray-300"}`}></div>
                  <div className={`dot absolute left-0.5 top-0.5 bg-white w-[20px] h-[20px] rounded-full transition-transform ${template.status ? "translate-x-6" : ""}`}></div>
                </div>
              </label>
            </div>

            {/* 3 DOT MENU */}
            <div className="relative justify-self-end">
              <button
                onClick={() => setOpenMenuId(openMenuId === template.id ? null : template.id)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                <BsThreeDots className="h-5 w-5" />
              </button>

              {openMenuId === template.id && (
                <div className="absolute right-0 mt-2 w-32 bg-white border shadow-xl rounded-lg">
                  <button onClick={() => {
                    setTemplateToEdit(template);
                    setIsEditModalOpen(true);
                    setOpenMenuId(null);
                  }}
                    className="block px-4 py-2 text-sm w-full text-left hover:bg-gray-100">
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setTemplateToDeleteId(template.id);
                      setIsDeleteModalOpen(true);
                      setOpenMenuId(null);
                    }}
                    className="block px-4 py-2 text-sm w-full text-left text-red-600 hover:bg-gray-100">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {showSignature && <Signature />}
      </div>

      {/* MODALS */}
      <EmailTemplateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={() => {}}
        templateData={templateToEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {}}
      />
    </div>
  );
};

export default EmailTemplate;
