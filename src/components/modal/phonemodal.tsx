import { IoClose } from 'react-icons/io5';
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateContact } from '@/store/slices/contactSlice';
import toast from 'react-hot-toast';

// Props interface
interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    number: string;
    type: string;
    isPrimary: boolean;
  };
  index?: number;
}

const PhoneModal: React.FC<PhoneModalProps> = ({ isOpen, onClose, initialData, index }) => {
  const dispatch = useAppDispatch();
  const { currentContact } = useAppSelector((state) => state.contacts);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneType, setPhoneType] = useState('MOBILE');
  const [isPrimary, setIsPrimary] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      setPhoneNumber(initialData.number);
      setPhoneType(initialData.type);
      setIsPrimary(initialData.isPrimary);
    } else {
      setPhoneNumber('');
      setPhoneType('MOBILE');
      setIsPrimary(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!currentContact) return;
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    const phoneEntry = {
      number: phoneNumber,
      type: phoneType,
      isPrimary: isPrimary
    };

    let updatedPhones;
    if (initialData !== undefined && index !== undefined) {
      // Edit existing
      updatedPhones = [...(currentContact.phones || [])];
      updatedPhones[index] = phoneEntry;
    } else {
      // Add new
      updatedPhones = [...(currentContact.phones || []), phoneEntry];
    }

    const payload = {
      phones: updatedPhones
    };

    try {
      await dispatch(updateContact({ id: currentContact.id, payload })).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to update contact:", err);
      toast.error("Failed to update phone number: " + err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
      onClick={onClose} // Close modal on outside click
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? "Edit Phone" : "Add New Phone"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Phone Number */}
          <div className="bg-gray-100/70 p-3 rounded-lg w-full">
            <label htmlFor="phoneNumber" className="text-xs text-gray-500 block">
              Phone number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="w-full bg-transparent text-gray-900 text-xs placeholder:text-xs focus:outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Phone Type */}
          <div className="bg-gray-100/70 p-3 rounded-lg w-full">
            <label htmlFor="phoneType" className="text-xs text-gray-500 block">
              Phone type
            </label>
            <select
              id="phoneType"
              value={phoneType}
              onChange={(e) => setPhoneType(e.target.value)}
              className="w-full bg-transparent text-gray-900 text-xs placeholder:text-xs focus:outline-none cursor-pointer"
            >
              <option value="MOBILE">Mobile</option>
              <option value="WORK">Work</option>
              <option value="HOME">Home</option>
              <option value="TELEPHONE">Telephone</option>
            </select>
          </div>

          {/* Primary Checkbox */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isPrimary"
              checked={isPrimary}
              onChange={(e) => setIsPrimary(e.target.checked)}
              className="h-5 w-5 rounded border-gray-400 text-black focus:ring-black cursor-pointer accent-black"
            />
            <label htmlFor="isPrimary" className="text-sm font-medium text-gray-700 cursor-pointer">
              Primary
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center items-center gap-3 pt-6 mt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-200 w-full hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-6 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#FFCA06] w-full hover:bg-yellow-500 text-gray-950 font-semibold py-2.5 px-6 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneModal;
