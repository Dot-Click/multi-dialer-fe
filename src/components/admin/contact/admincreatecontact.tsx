// Icon imports from react-icons
import { FiPlus, FiFolder, FiMoreHorizontal, FiChevronDown } from 'react-icons/fi';
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { IoAdd } from 'react-icons/io5';
import { useContact, type ContactEmail, type ContactPhone, type ContactList, type ContactFolder, type ContactGroup } from '@/hooks/useContact';
import { toast } from 'react-hot-toast';

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
  <div className="bg-gray-100 px-3 py-2 rounded-[12px] focus-within:ring-2 focus-within:ring-blue-500 text-sm">
    <label className="block text-[12px] font-medium text-[#495057] mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full outline-none text-[#0E1011] text-[16px] font-normal bg-transparent"
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
  onRemove
}) => (
  <div className="flex gap-2 items-center">
    <div className="flex-1 bg-gray-100 px-3 py-4 rounded-[12px] focus-within:ring-2 focus-within:ring-blue-500">
      <input
        type="email"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full outline-none text-[#0E1011] text-[16px] font-normal bg-transparent"
      />
    </div>
    <button
      onClick={onTogglePrimary}
      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isPrimary ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}
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
  number: string;
  type: 'MOBILE' | 'TELEPHONE' | 'HOME' | 'WORK';
  onChangeNumber: (val: string) => void;
  onChangeType: (val: 'MOBILE' | 'TELEPHONE' | 'HOME' | 'WORK') => void;
  onRemove?: () => void;
}

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({
  number,
  type,
  onChangeNumber,
  onChangeType,
  onRemove
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const options: ('MOBILE' | 'TELEPHONE' | 'HOME' | 'WORK')[] = ['MOBILE', 'WORK', 'HOME', 'TELEPHONE'];

  return (
    <div className="flex gap-3 items-center">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-3 flex-1">
        <div className="bg-gray-100 px-3 py-4 rounded-[12px] focus-within:ring-2 focus-within:ring-blue-500">
          <input
            type="tel"
            value={number}
            onChange={(e) => onChangeNumber(e.target.value)}
            placeholder="Phone number"
            className="w-full outline-none text-[#0E1011] text-[16px] font-normal bg-transparent"
          />
        </div>

        <div className="relative">
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gray-100 px-3 py-4 rounded-[12px] cursor-pointer flex justify-between items-center text-[#0E1011] text-[16px] font-normal"
          >
            <span className="capitalize">{type.toLowerCase()}</span>
            <FiChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>

          {isOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white shadow-lg rounded-[12px] z-100 border border-gray-100 overflow-hidden">
              {options.map((opt) => (
                <div
                  key={opt}
                  className="px-4 py-2 hover:bg-[#F2F2F2] cursor-pointer text-[14px] text-[#030213]"
                  onClick={() => {
                    onChangeType(opt);
                    setIsOpen(false);
                  }}
                >
                  {opt.charAt(0) + opt.slice(1).toLowerCase()}
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

  return (
    <div className="relative w-full">
      <label className="block text-[#2B3034] font-normal text-[14px] mb-2">
        How did you acquire this contact?
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-100 px-3 py-3 rounded-[12px] cursor-pointer flex justify-between items-center text-[#0E1011] text-[16px] font-normal focus-within:ring-2 focus-within:ring-blue-500"
      >
        <span>{value}</span>
        <FiChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white shadow-lg rounded-[12px] z-100 border border-gray-100 overflow-hidden">
          {options.map((opt) => (
            <div
              key={opt}
              className="px-4 py-2 hover:bg-[#F2F2F2] cursor-pointer text-[14px] text-[#030213]"
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

export interface AdminCreateContactRef {
  save: () => Promise<void>;
}

const AdminCreateContactComponent = forwardRef<AdminCreateContactRef>((_, ref) => {
  const { createContact, getContactLists, getContactFolders, getContactGroups, loading } = useContact();

  const [folders, setFolders] = useState<ContactFolder[]>([]);
  const [lists, setLists] = useState<ContactList[]>([]);
  const [groups, setGroups] = useState<ContactGroup[]>([]);

  const [formData, setFormData] = useState({
    fullName: '',
    city: '',
    state: '',
    zip: '',
    source: 'Manual entry',
    contactListId: '',
  });

  const [emails, setEmails] = useState<ContactEmail[]>([{ email: '', isPrimary: true }]);
  const [phones, setPhones] = useState<ContactPhone[]>([{ number: '', type: 'MOBILE' }]);

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedFolders, fetchedLists, fetchedGroups] = await Promise.all([
        getContactFolders(),
        getContactLists(),
        getContactGroups()
      ]);
      setFolders(fetchedFolders);
      setLists(fetchedLists);
      setGroups(fetchedGroups);
    };
    fetchData();
  }, []);

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (!formData.fullName) {
        toast.error('Full Name is required');
        return;
      }

      const filteredEmails = emails.filter(e => e.email.trim() !== '');
      const filteredPhones = phones.filter(p => p.number.trim() !== '');

      if (filteredEmails.length === 0) {
        toast.error('At least one email is required');
        return;
      }

      try {
        await createContact({
          ...formData,
          emails: filteredEmails,
          phones: filteredPhones,
        });
        toast.success('Contact created successfully');
        // Reset form or navigate
        setFormData({
          fullName: '',
          city: '',
          state: '',
          zip: '',
          source: 'Manual entry',
          contactListId: '',
        });
        setEmails([{ email: '', isPrimary: true }]);
        setPhones([{ number: '', type: 'MOBILE' }]);
      } catch (err: any) {
        toast.error(err.message);
      }
    }
  }));

  const handleAddEmail = () => setEmails([...emails, { email: '', isPrimary: false }]);
  const handleAddPhone = () => setPhones([...phones, { number: '', type: 'MOBILE' }]);

  const updateEmail = (index: number, val: string) => {
    const newEmails = [...emails];
    newEmails[index].email = val;
    setEmails(newEmails);
  };

  const togglePrimaryEmail = (index: number) => {
    const newEmails = emails.map((e, i) => ({
      ...e,
      isPrimary: i === index
    }));
    setEmails(newEmails);
  };

  const removeEmail = (index: number) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      if (!newEmails.some(e => e.isPrimary)) {
        newEmails[0].isPrimary = true;
      }
      setEmails(newEmails);
    }
  };

  const updatePhone = (index: number, number: string) => {
    const newPhones = [...phones];
    newPhones[index].number = number;
    setPhones(newPhones);
  };

  const updatePhoneType = (index: number, type: 'MOBILE' | 'TELEPHONE' | 'HOME' | 'WORK') => {
    const newPhones = [...phones];
    newPhones[index].type = type;
    setPhones(newPhones);
  };

  const removePhone = (index: number) => {
    if (phones.length > 1) {
      setPhones(phones.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="max-w-5xl work-sans mx-auto min-h-screen pb-20">
      <div className="flex flex-col gap-5">

        {/* BASIC INFORMATION */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-[24px] flex flex-col gap-3 shadow-sm">
          <h1 className="text-[#495057] font-medium uppercase text-[14px]">
            Basic Information
          </h1>

          <div className="grid grid-cols-1 gap-y-5">
            <BasicInformationInputField
              label="Full Name"
              placeholder="Enter lead's name"
              value={formData.fullName}
              onChange={(val) => setFormData({ ...formData, fullName: val })}
            />

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
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-[24px] flex flex-col gap-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-[#495057] font-medium uppercase text-[14px]">
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
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-[24px] flex flex-col gap-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-[#495057] font-medium uppercase text-[14px]">
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
            {phones.map((p, i) => (
              <PhoneInputField
                key={i}
                number={p.number}
                type={p.type}
                onChangeNumber={(val) => updatePhone(i, val)}
                onChangeType={(val) => updatePhoneType(i, val)}
                onRemove={phones.length > 1 ? () => removePhone(i) : undefined}
              />
            ))}
          </div>
        </div>

        {/* SOURCE */}
        <div className="bg-white p-3 sm:p-4 md:p-6 rounded-[24px] flex flex-col gap-2 shadow-sm">
          <h1 className="text-[#495057] font-medium uppercase text-[14px] mb-2">Source</h1>
          <SourceSelectField
            value={formData.source}
            onChange={(val) => setFormData({ ...formData, source: val })}
          />
        </div>

        {/* LISTS & GROUPS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 bg-white p-3 sm:p-4 md:p-6 rounded-[24px] shadow-sm">
          {/* LISTS */}
          <div className="bg-white border border-[#E9E9EB] rounded-[16px] p-4 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4 pl-2 pr-1">
              <h2 className="text-[14px] font-medium uppercase text-[#495057] tracking-wide">LISTS & FOLDERS</h2>
              <button className="bg-[#F3F4F7] p-1.5 rounded-[6px] hover:bg-gray-200 transition-colors">
                <FiPlus className="text-[#5F6368] text-[14px]" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 grow space-y-1 custom-scrollbar">
              {folders.map((folder) => (
                <div
                  key={`folder-${folder.id}`}
                  className="flex items-center justify-between p-2 rounded-lg cursor-pointer group hover:bg-[#F9FAFB]"
                >
                  <div className="flex items-center gap-3">
                    <FiFolder className="text-[18px] text-[#9AA0A6]" />
                    <span className="text-[14px] font-medium text-[#5F6368]">
                      {folder.name}
                    </span>
                  </div>
                  <FiMoreHorizontal className="text-[#9AA0A6] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}

              {lists.map((list) => (
                <div
                  key={`list-${list.id}`}
                  onClick={() => setFormData({ ...formData, contactListId: list.id })}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer group transition-colors ${formData.contactListId === list.id ? 'bg-[#FFCA06] bg-opacity-20 border border-[#FFCA06]' : 'hover:bg-[#F9FAFB]'}`}
                >
                  <span className="text-[14px] font-normal text-[#5F6368] pl-8">
                    {list.name}
                  </span>
                  {list.name.slice(0, 2).toUpperCase() && (
                    <div className="w-[24px] h-[24px] rounded-full border border-[#E9E9EB] flex items-center justify-center text-[10px] font-medium text-[#5F6368] bg-white">
                      {list.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
              ))}

              {folders.length === 0 && lists.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">No lists or folders found</div>
              )}
            </div>
          </div>

          {/* GROUPS */}
          <div className="bg-white border border-[#E9E9EB] rounded-[16px] p-4 h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4 pl-2 pr-1">
              <h2 className="text-[14px] font-medium uppercase text-[#495057] tracking-wide">GROUPS</h2>
              <button className="bg-[#F3F4F7] p-1.5 rounded-[6px] hover:bg-gray-200 transition-colors">
                <FiPlus className="text-[#5F6368] text-[14px]" />
              </button>
            </div>

            <div className="overflow-y-auto pr-1 grow space-y-1 custom-scrollbar">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="p-2 rounded-lg hover:bg-[#F9FAFB] cursor-pointer text-[14px] font-medium text-[#495057]"
                >
                  {group.name}
                </div>
              ))}
              {groups.length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm">No groups found</div>
              )}
            </div>
          </div>
        </div>

      </div>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-200">
          <div className="bg-white p-5 rounded-xl shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFCA06]"></div>
            <span className="font-medium">Saving contact...</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdminCreateContactComponent;
