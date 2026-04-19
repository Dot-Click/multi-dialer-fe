import { FiPlus, FiFolder, FiMoreHorizontal, FiChevronDown, FiList, FiTrash } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchFolders,
  fetchLists,
  fetchGroups,
  createFolder,
  createList,
  createGroup,
  deleteFolder,
  deleteList,
  deleteGroup
} from '@/store/slices/contactStructureSlice';
import StructureModal from '@/components/modal/StructureModal';

/* ================= BASIC INFORMATION INPUT ================= */

interface BasicInformationInputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
}

const BasicInformationInputField: React.FC<BasicInformationInputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
}) => (
  <div className="bg-gray-100 dark:bg-slate-600/50 px-3 py-2 rounded-[12px] focus-within:ring-2 focus-within:ring-blue-500 text-sm transition-all shadow-sm">
    <label className="block text-[12px] font-[500] text-[#495057] dark:text-gray-400 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full outline-none text-[#111] dark:text-white text-[16px] font-[400] bg-transparent"
    />
  </div>
);

/* ================= EMAIL INPUT ================= */

interface EmailInputFieldProps {
  placeholder: string;
  email: string;
  isPrimary: boolean;
  onChange: (email: string) => void;
  onTogglePrimary: () => void;
  onRemove?: () => void;
}

const EmailInputField: React.FC<EmailInputFieldProps> = ({
  placeholder,
  email,
  isPrimary,
  onChange,
  onTogglePrimary,
  onRemove,
}) => (
  <div className="flex gap-2 items-center">
    <div className="flex-1 bg-gray-100 dark:bg-slate-600/50 px-3 py-4 rounded-[12px] focus-within:ring-2 focus-within:ring-blue-500 shadow-sm transition-all">
      <input
        type="email"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full outline-none text-[#111] dark:text-white text-[16px] font-[400] bg-transparent"
      />
    </div>
    <button
      onClick={onTogglePrimary}
      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isPrimary ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
    >
      Primary
    </button>
    {onRemove && (
      <button onClick={onRemove} className="text-red-500 hover:text-red-700 text-xl font-bold px-2">×</button>
    )}
  </div>
);

/* ================= PHONE INPUT ================= */

interface PhoneInputFieldProps {
  value: string;
  type: "MOBILE" | "TELEPHONE" | "HOME" | "WORK";
  pattern?: string;
  onChange: (val: string) => void;
  onTypeChange: (type: "MOBILE" | "TELEPHONE" | "HOME" | "WORK") => void;
  onRemove?: () => void;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({ value, type, pattern, onChange, onTypeChange, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options: ("MOBILE" | "TELEPHONE" | "HOME" | "WORK")[] = ['MOBILE', 'TELEPHONE', 'HOME', 'WORK'];

  return (
    <div className="flex gap-3 items-center">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-3 flex-1">
        <div className="bg-gray-100 dark:bg-slate-600/50 px-4 py-3 rounded-[12px] focus-within:ring-2 focus-within:ring-blue-500 shadow-sm transition-all">
          <input
            type="tel"
            placeholder="+1234567890"
            value={value}
            pattern={pattern}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || /^\+?[0-9]*$/.test(val)) {
                onChange(val);
              }
            }}
            className="w-full outline-none text-[#111] dark:text-white text-[16px] font-[400] bg-transparent"
          />
        </div>

        <div className="relative">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-100 dark:bg-slate-600/50 px-4 py-3 h-full rounded-[12px] cursor-pointer flex justify-between items-center text-[#111] dark:text-white text-[15px] font-[400] shadow-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-all font-sans"
          >
            <span className="capitalize">{type.toLowerCase()}</span>
            <FiChevronDown className={`transition-transform duration-200 dark:text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
          </div>

          {isOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-slate-800 shadow-2xl rounded-[12px] z-[100] border border-gray-100 dark:border-gray-700 overflow-hidden py-1">
              {options.map((opt) => (
                <div
                  key={opt}
                  className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer text-[14px] text-[#2B3034] dark:text-gray-200 capitalize"
                  onClick={() => {
                    onTypeChange(opt);
                    setIsOpen(false);
                  }}
                >
                  {opt.toLowerCase()}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {onRemove && (
        <button onClick={onRemove} className="text-red-500 hover:text-red-700 text-xl font-bold px-2">×</button>
      )}
    </div>
  );
};

/* ================= SOURCE SELECT INPUT ================= */

interface SourceSelectFieldProps {
  value: string;
  onChange: (val: string) => void;
}

const SourceSelectField: React.FC<SourceSelectFieldProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = ['Manual entry', 'Imported', 'Website', 'Referral'];

  return (    <div className="relative w-full">
      <label className="block text-[#495057] dark:text-gray-400 font-[500] text-[13px] mb-2 uppercase">
        How did you acquire this contact?
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-100 dark:bg-slate-600/50 px-4 py-3 rounded-[12px] cursor-pointer flex justify-between items-center text-[#111] dark:text-white text-[15px] font-[400] shadow-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-all"
      >
        <span>{value}</span>
        <FiChevronDown className={`transition-transform duration-200 dark:text-gray-400 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
 
      {isOpen && (
        <div className="absolute bottom-[calc(100%+8px)] left-0 w-full bg-white dark:bg-slate-800 shadow-2xl rounded-[12px] z-[100] border border-gray-100 dark:border-gray-700 overflow-hidden py-1">
          {options.map((opt) => (
            <div
              key={opt}
              className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer text-[14px] text-[#2B3034] dark:text-gray-200"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


/* ================= MAIN COMPONENT ================= */

import { useNavigate } from 'react-router-dom';
import { createContact } from '@/store/slices/contactSlice';
import toast from 'react-hot-toast';

interface AdminCreateContactComponentProps {
  onSaveRef?: React.MutableRefObject<(() => void) | null>;
}

const AdminCreateContactComponent: React.FC<AdminCreateContactComponentProps> = ({ onSaveRef }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { folders, lists, groups } = useAppSelector((state) => state.contactStructure);

  /* FORM STATE */
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    city: '',
    state: '',
    zip: '',
    source: 'Manual entry',
    contactListId: '',
    folderId: '',
  });

  const [emails, setEmails] = useState<{ email: string; isPrimary: boolean }[]>([
    { email: '', isPrimary: true }
  ]);
  const [phones, setPhones] = useState<{ number: string; type: "MOBILE" | "TELEPHONE" | "HOME" | "WORK" }[]>([
    { number: '', type: 'MOBILE' }
  ]);

  /* SAVING LOGIC */
  const handleSaveContact = async () => {
    if (!formData.fullName) {
      toast.error("Please enter a full name");
      return;
    }

    const invalidPhone = phones.find(p => p.number.trim() !== "" && !/^\+[1-9]\d{1,14}$/.test(p.number));
    if (invalidPhone) {
      toast.error("Please enter valid E.164 formatted phone numbers (e.g., +1234567890)");
      return;
    }

    const payload = {
      fullName: formData.fullName,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      source: formData.source,
      tags: [],
      emails: emails.filter(e => e.email.trim() !== ""),
      phones: phones.filter(p => p.number.trim() !== ""),
      contactListId: formData.contactListId || undefined,
      folderIds: formData.folderId ? [formData.folderId] : [],
    };

    console.log("payload", payload)

    const res = await dispatch(createContact(payload));
    if (createContact.fulfilled.match(res)) {
      toast.success("Contact created successfully!");
      navigate('/admin/data-dialer');
    }
  };

  useEffect(() => {
    if (onSaveRef) {
      onSaveRef.current = handleSaveContact;
    }
  }, [onSaveRef, formData, emails, phones]);

  /* FETCH DATA ON MOUNT */
  useEffect(() => {
    dispatch(fetchFolders());
    dispatch(fetchLists());
    dispatch(fetchGroups());
  }, [dispatch]);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'folder' | 'list' | 'group' | null;
    title: string;
    placeholder: string;
    targetFolderId?: string;
  }>({
    isOpen: false,
    type: null,
    title: '',
    placeholder: '',
  });

  /* ... creation handlers (folders/lists/groups) ... */

  /* CREATION HANDLERS */
  const handleCreateFolder = () => {
    setModalConfig({
      isOpen: true,
      type: 'folder',
      title: 'Add New Folder',
      placeholder: 'Enter folder name',
    });
  };

  const handleCreateList = (folderId: string) => {
    setModalConfig({
      isOpen: true,
      type: 'list',
      title: 'Add New List',
      placeholder: 'Enter list name',
      targetFolderId: folderId,
    });
  };

  const handleCreateGroup = () => {
    setModalConfig({
      isOpen: true,
      type: 'group',
      title: 'Add New Group',
      placeholder: 'Enter group name',
    });
  };

  const handleModalSave = (name: string) => {
    if (modalConfig.type === 'folder') dispatch(createFolder({ name }));
    if (modalConfig.type === 'list' && modalConfig.targetFolderId) {
      dispatch(createList({ name, folderId: modalConfig.targetFolderId }));
    }
    if (modalConfig.type === 'group') dispatch(createGroup(name));
  };

  /* DELETION HANDLERS */
  const handleDeleteFolder = (id: string, name: string) => {
    toast((t) => (
      <span className="flex flex-wrap items-center gap-2">
        Are you sure you want to delete folder <b className="text-gray-900">"{name}"</b>?
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              dispatch(deleteFolder(id));
            }}
            className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-md font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </span>
    ), { duration: 6000 });
  };

  const handleDeleteList = (id: string, name: string) => {
    toast((t) => (
      <span className="flex flex-wrap items-center gap-2">
        Are you sure you want to delete list <b className="text-gray-900">"{name}"</b>?
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              dispatch(deleteList(id));
            }}
            className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-md font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </span>
    ), { duration: 6000 });
  };

  const handleDeleteGroup = (id: string, name: string) => {
    toast((t) => (
      <span className="flex flex-wrap items-center gap-2">
        Are you sure you want to delete group <b className="text-gray-900">"{name}"</b>?
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              dispatch(deleteGroup(id));
            }}
            className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-md font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </span>
    ), { duration: 6000 });
  };

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  /* EMAIL STATE */
  const handleAddEmail = () => setEmails((p) => [...p, { email: '', isPrimary: false }]);
  
  const updateEmail = (index: number, val: string) => {
    const newEmails = [...emails];
    newEmails[index].email = val;
    setEmails(newEmails);
  };
  
  const togglePrimaryEmail = (index: number) => {
    setEmails(emails.map((e, i) => ({ ...e, isPrimary: i === index })));
  };

  const removeEmail = (index: number) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      if (!newEmails.some(e => e.isPrimary)) newEmails[0].isPrimary = true;
      setEmails(newEmails);
    }
  };

  /* PHONE STATE */
  const handleAddPhone = () => setPhones((p) => [...p, { number: '', type: 'MOBILE' }]);
  const updatePhone = (index: number, field: 'number' | 'type', val: any) => {
    const newPhones = [...phones];
    (newPhones[index] as any)[field] = val;
    setPhones(newPhones);
  };
  const removePhone = (index: number) => {
    if (phones.length > 1) {
      setPhones(phones.filter((_, i) => i !== index));
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-5xl work-sans mx-auto min-h-screen pb-20">
      <div className="flex flex-col gap-5">

        {/* BASIC INFORMATION */}
        <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 md:p-6 rounded-[24px] flex flex-col gap-3 shadow-sm border border-transparent dark:border-gray-700">
          <h1 className="text-[#495057] dark:text-gray-400 font-medium uppercase text-[14px]">
            Basic Information
          </h1>

          <div className="grid grid-cols-1 gap-y-5">
            <BasicInformationInputField 
              label="Full Name" 
              placeholder="Enter lead's name"
              value={formData.fullName}
              onChange={(val) => setFormData({ ...formData, fullName: val })}
            />
            {/* <BasicInformationInputField label="Email" placeholder="Enter lead's email" type="email" /> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <BasicInformationInputField 
                label="City" 
                placeholder="Enter lead's city"
                value={formData.city}
                onChange={(val) => setFormData({ ...formData, city: val })}
              />
              <BasicInformationInputField 
                label="State" 
                placeholder="Enter lead's state"
                value={formData.state}
                onChange={(val) => setFormData({ ...formData, state: val })}
              />
            </div>

            <BasicInformationInputField 
              label="Zip" 
              placeholder="Enter lead's Zip"
              value={formData.zip}
              onChange={(val) => setFormData({ ...formData, zip: val })}
            />
          </div>
        </div>

        {/* EMAIL ADDRESSES */}
        <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 md:p-6 rounded-[24px] flex flex-col gap-4 shadow-sm border border-transparent dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h1 className="text-[#495057] dark:text-gray-400 font-medium uppercase text-[14px]">
              Email Addresses
            </h1>
            <button
              onClick={handleAddEmail}
              className="flex gap-1 bg-[#FFCA06] px-[15px] py-[6px] rounded-[12px] items-center text-black text-[10px] sm:text-[12px] md:text-[16px] font-medium hover:bg-[#f7c205] transition-colors"
            >
              <IoAdd /> Add Email
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {emails.map((e, i) => (
              <EmailInputField
                key={i}
                email={e.email}
                isPrimary={e.isPrimary}
                onChange={(val) => updateEmail(i, val)}
                onTogglePrimary={() => togglePrimaryEmail(i)}
                onRemove={emails.length > 1 ? () => removeEmail(i) : undefined}
                placeholder={i === 0 ? 'Primary email address' : 'Additional email address'}
              />
            ))}
          </div>
        </div>

        {/* PHONE NUMBERS */}
        <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 md:p-6 rounded-[24px] flex flex-col gap-4 shadow-sm border border-transparent dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h1 className="text-[#495057] dark:text-gray-400 font-medium uppercase text-[14px]">
              Phone Numbers
            </h1>
            <button
              onClick={handleAddPhone}
              className="flex gap-1 bg-[#FFCA06] px-[15px] py-[6px] rounded-[12px] items-center text-black text-[10px] sm:text-[12px] md:text-[16px] font-medium hover:bg-[#f7c205] transition-colors"
            >
              <IoAdd /> Add Phone
            </button>
          </div>

          <div className="flex flex-col gap-5">
            {phones.map((phone, i) => (
              <PhoneInputField 
                key={i}
                value={phone.number}
                type={phone.type}
                pattern="^\+[1-9]\d{1,14}$"
                onChange={(val) => updatePhone(i, 'number', val)}
                onTypeChange={(type) => updatePhone(i, 'type', type)}
                onRemove={phones.length > 1 ? () => removePhone(i) : undefined}
              />
            ))}
          </div>
        </div>

        {/* SOURCE */}
        <div className="bg-white dark:bg-slate-800 p-3 sm:p-4 md:p-6 rounded-[24px] flex flex-col gap-2 border border-transparent dark:border-gray-700">
          <h1 className="text-[#495057] dark:text-gray-400 font-[500] uppercase text-[14px] mb-2">Source</h1>
          <SourceSelectField 
            value={formData.source}
            onChange={(val) => setFormData({ ...formData, source: val })}
          />
        </div>

        {/* ASSIGNMENTS: LISTS & FOLDERS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4 bg-white dark:bg-slate-800 p-3 sm:p-4 md:p-6 rounded-[24px] shadow-sm border border-transparent dark:border-gray-700">
          
          {/* LEFT COLUMN: LISTS */}
          <div className="bg-white dark:bg-slate-800 border border-[#E9E9EB] dark:border-gray-700 rounded-[16px] p-4 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4 pl-2 pr-1">
              <div className="flex items-center gap-2">
                <FiList className="text-[#9AA0A6] dark:text-gray-400" />
                <h2 className="text-[14px] font-[500] uppercase text-[#495057] dark:text-gray-400 tracking-wide">Select List</h2>
              </div>
              {/* Optional: Add creation button if needed, although lists usually need a folder. 
                  Let's keep the user's request for "give that button" by showing Create Folder/List logic differently or simplified.
              */}
            </div>

            <div className="overflow-y-auto pr-1 flex-grow space-y-1 custom-scrollbar">
              {lists.map((list) => (
                <div
                  key={list.id}
                  onClick={() => setFormData({ ...formData, contactListId: formData.contactListId === list.id ? '' : list.id })}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all border-2 ${
                    formData.contactListId === list.id 
                      ? "bg-[#FFCA06]/5 border-[#FFCA06] shadow-sm" 
                      : "border-transparent hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-[32px] h-[32px] rounded-full border border-[#E9E9EB] dark:border-gray-700 flex items-center justify-center text-[10px] font-bold ${formData.contactListId === list.id ? "bg-[#FFCA06] text-black" : "bg-white dark:bg-slate-700 text-gray-500"}`}>
                      {getInitials(list.name)}
                    </div>
                    <span className={`text-[14px] font-[500] ${formData.contactListId === list.id ? "text-black dark:text-white" : "text-[#5F6368] dark:text-gray-300"}`}>
                      {list.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteList(list.id, list.name);
                      }}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-full transition-all"
                    >
                      <FiTrash size={14} />
                    </button>
                    {formData.contactListId === list.id && <div className="w-2 h-2 rounded-full bg-[#FFCA06]" />}
                  </div>
                </div>
              ))}
              {lists.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">No calling lists found</div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: FOLDERS */}
          <div className="bg-white dark:bg-slate-800 border border-[#E9E9EB] dark:border-gray-700 rounded-[16px] p-4 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4 pl-2 pr-1">
              <div className="flex items-center gap-2">
                <FiFolder className="text-[#9AA0A6] dark:text-gray-400" />
                <h2 className="text-[14px] font-[500] uppercase text-[#495057] dark:text-gray-400 tracking-wide">Select Folder</h2>
              </div>
              <button
                onClick={handleCreateFolder}
                className="bg-[#F3F4F7] dark:bg-gray-700 p-1.5 rounded-[6px] hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Add New Folder"
              >
                <FiPlus className="text-[#5F6368] dark:text-gray-400 text-[14px]" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 flex-grow space-y-1 custom-scrollbar">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  onClick={() => setFormData({ ...formData, folderId: formData.folderId === folder.id ? '' : folder.id })}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer group transition-all border-2 ${
                    formData.folderId === folder.id 
                      ? "bg-[#FFCA06]/5 border-[#FFCA06] shadow-sm" 
                      : "border-transparent hover:bg-gray-50 dark:hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FiFolder className={`text-[18px] ${formData.folderId === folder.id ? "text-[#FFCA06]" : "text-[#9AA0A6] dark:text-gray-400"}`} />
                    <span className={`text-[14px] font-[500] ${formData.folderId === folder.id ? "text-black dark:text-white" : "text-[#5F6368] dark:text-gray-300"}`}>
                      {folder.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Special logic for adding list to this folder if needed
                        handleCreateList(folder.id);
                      }}
                      className="p-1 px-2 text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-100"
                    >
                      + List
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id, folder.name);
                      }}
                      className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-full transition-all"
                    >
                      <FiTrash size={14} />
                    </button>
                    {formData.folderId === folder.id && <div className="w-2 h-2 rounded-full bg-[#FFCA06]" />}
                  </div>
                </div>
              ))}
              {folders.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">No folders found</div>
              )}
            </div>
          </div>
        </div>

        {/* STRUCTURE MODAL */}
        <StructureModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          onSave={handleModalSave}
          title={modalConfig.title}
          placeholder={modalConfig.placeholder}
        />
      </div>
      {/* {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-200">
          <div className="bg-white p-5 rounded-xl shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFCA06]"></div>
            <span className="font-medium">Saving contact...</span>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AdminCreateContactComponent;
