import { useState, useEffect } from "react";
import { HiOutlineSearch, HiPlus, HiX } from "react-icons/hi";
import { IoWarningOutline } from "react-icons/io5";

import { BsThreeDots } from "react-icons/bs";


interface SMSTemplateData {
  id: number;
  name: string;
  content: string; // SMS content field add kiya
  createdBy: string;
  createdOn: string;
  modifiedOn: string;
  status: boolean;
}

interface SMSTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; content: string }) => void;
  templateData: SMSTemplateData | null;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}



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
// EDIT/ADD SMS TEMPLATE MODAL COMPONENT
// =================================================================

const SMSTemplateModal = ({ isOpen, onClose, onSave, templateData }: SMSTemplateModalProps) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (templateData && isOpen) {
      setName(templateData.name);
      setContent(templateData.content);
    } else {
      setName('');
      setContent('');
    }
  }, [templateData, isOpen]);

  const handleSave = () => {
    if (!name.trim()) {
      alert("Template Name is required.");
      return;
    }
    onSave({ name, content });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {templateData ? "Edit SMS Template" : "Add SMS Template"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><HiX className="h-6 w-6 text-gray-500" /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Template Name */}
          <div className="bg-gray-100 p-3 flex flex-col gap-1 border border-transparent rounded-lg focus-within:ring-2 focus-within:ring-yellow-400">
            <label className="text-xs font-medium text-gray-600">Template Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent outline-none text-sm" placeholder="SMS Template #1" />
          </div>
          {/* Content */}
          <div className="bg-gray-100 p-3 flex flex-col gap-1 border border-transparent rounded-lg focus-within:ring-2 focus-within:ring-yellow-400">
            <label className="text-xs font-medium text-gray-600">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} className="w-full bg-transparent outline-none text-sm resize-none" placeholder="Enter your SMS content here..." />
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
// MAIN SMS TEMPLATE COMPONENT
// =================================================================

const SMSTemplate = () => {
  const [smsTemplates, setSMSTemplates] = useState<SMSTemplateData[]>([
    { id: 1, name: "SMS Template #1", content: "Hi [Customer Name], this is a reminder about your appointment tomorrow at [Time].", createdBy: "John Lee", createdOn: "09/09/2025", modifiedOn: "09/09/2025", status: true },
    { id: 2, name: "SMS Template #2", content: "Thanks for your recent purchase! Here is your receipt: [Link]", createdBy: "Brooklyn Simmons", createdOn: "08/09/2025", modifiedOn: "08/09/2025", status: true },
    { id: 3, name: "SMS Template #3", content: "Hello! We have a special offer just for you. Use code SAVE20.", createdBy: "Devon Lane", createdOn: "07/09/2025", modifiedOn: "07/09/2025", status: false },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [templateToEdit, setTemplateToEdit] = useState<SMSTemplateData | null>(null);
  const [templateToDeleteId, setTemplateToDeleteId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const handleAddClick = () => {
    setTemplateToEdit(null);
    setIsEditModalOpen(true);
  };

  const handleEditClick = (template: SMSTemplateData) => {
    setTemplateToEdit(template);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const handleSaveTemplate = (savedData: { name: string; content: string }) => {
    if (templateToEdit) {
      setSMSTemplates(prev => prev.map(t => t.id === templateToEdit.id ? { ...t, ...savedData, modifiedOn: new Date().toLocaleDateString('en-GB') } : t));
    } else {
      const newTemplate: SMSTemplateData = { id: Date.now(), ...savedData, createdBy: "Current User", createdOn: new Date().toLocaleDateString('en-GB'), modifiedOn: new Date().toLocaleDateString('en-GB'), status: true };
      setSMSTemplates(prev => [...prev, newTemplate]);
    }
    setIsEditModalOpen(false);
  };

  const openDeleteModal = (id: number) => {
    setTemplateToDeleteId(id);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = () => {
    if (templateToDeleteId !== null) {
      setSMSTemplates(prev => prev.filter(t => t.id !== templateToDeleteId));
    }
    setIsDeleteModalOpen(false);
    setTemplateToDeleteId(null);
  };

  const handleToggleStatus = (id: number) => {
    setSMSTemplates(prev => prev.map(sms => (sms.id === id ? { ...sms, status: !sms.status } : sms)));
  };

  return (
    <div className="">
      {/* Search + Add button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <div className="relative w-full sm:w-96">
          <input type="text" placeholder="Search by template name" className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
          <HiOutlineSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button onClick={handleAddClick} className="bg-yellow-400 text-sm hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg flex items-center">
          <HiPlus className="h-5 w-5 mr-2" />
          Add Template
        </button>
      </div>

      {/* SMS Template Cards */}
      <div className="space-y-4">
        {smsTemplates.map((template) => (
          <div key={template.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition hover:shadow-md">
            <div className="font-medium text-base text-gray-900 w-full lg:w-1/4">{template.name}</div>
            <div className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700">
              <div className="flex flex-col"><span className="text-gray-500 text-xs">Created by</span><span className="font-medium text-gray-900">{template.createdBy}</span></div>
              <div className="flex flex-col"><span className="text-gray-500 text-xs">Created on</span><span className="font-medium text-gray-900">{template.createdOn}</span></div>
              <div className="flex flex-col"><span className="text-gray-500 text-xs">Modified on</span><span className="font-medium text-gray-900">{template.modifiedOn}</span></div>
              <div className="flex items-center justify-between sm:justify-end gap-3">
                <label htmlFor={`toggle-${template.id}`} className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" id={`toggle-${template.id}`} className="sr-only" checked={template.status} onChange={() => handleToggleStatus(template.id)} />
                    <div className={`block w-11 h-6 rounded-full transition-colors duration-300 ${template.status ? "bg-black" : "bg-gray-300"}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${template.status ? "translate-x-5" : ""}`}></div>
                  </div>
                </label>
                <div className="relative">
                  <button onClick={() => setOpenMenuId(openMenuId === template.id ? null : template.id)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
                    <BsThreeDots className="h-5 w-5" />
                  </button>
                  {openMenuId === template.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-20 border">
                      <button onClick={() => handleEditClick(template)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>
                      <button onClick={() => openDeleteModal(template.id)} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <SMSTemplateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTemplate}
        templateData={templateToEdit}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default SMSTemplate;