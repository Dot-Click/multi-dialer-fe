import { IoClose } from "react-icons/io5";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateContact } from "@/store/slices/contactSlice";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface EditModalProps {
  onClose: () => void;
}

const EditModal = ({ onClose }: EditModalProps) => {
  const dispatch = useAppDispatch();
  const { currentContact, isLoading } = useAppSelector((state) => state.contacts);

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    mailingAddress: "",
    mailingCity: "",
    mailingState: "",
    mailingZip: "",
  });

  useEffect(() => {
    if (currentContact) {
      setFormData({
        fullName: currentContact.fullName || "",
        address: currentContact.address || "",
        city: currentContact.city || "",
        state: currentContact.state || "",
        zip: currentContact.zip || "",
        mailingAddress: currentContact.mailingAddress || "",
        mailingCity: currentContact.mailingCity || "",
        mailingState: currentContact.mailingState || "",
        mailingZip: currentContact.mailingZip || "",
      });
    }
  }, [currentContact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentContact) return;

    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    try {
      await dispatch(
        updateContact({ id: currentContact.id, payload: formData })
      ).unwrap();
      toast.success("Contact updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error("Failed to update contact: " + err);
    }
  };

  const Field = ({
    label,
    name,
    placeholder,
  }: {
    label: string;
    name: string;
    placeholder?: string;
  }) => (
    <div className="bg-[#F3F4F7] flex flex-col gap-1 px-3 py-2 rounded-lg">
      <label className="text-[#495057] font-medium text-[12px]">{label}</label>
      <input
        type="text"
        name={name}
        value={(formData as any)[name]}
        onChange={handleChange}
        placeholder={placeholder ?? `Enter ${label}`}
        className="w-full placeholder:text-sm text-sm outline-none bg-transparent"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl sm:max-w-2xl md:max-w-3xl p-5 sm:p-6 shadow-2xl relative animate-fadeIn my-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 sticky top-0 bg-white z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Edit Contact
          </h2>
          <button onClick={onClose} type="button">
            <IoClose className="text-2xl text-gray-600 hover:text-black" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-6 space-y-5">
          {/* Full Name */}
          <Field label="Full Name" name="fullName" placeholder="Enter full name" />

          {/* Property Address */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-3 text-sm sm:text-base">
              Property Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Street Address" name="address" placeholder="123 Main St" />
              <Field label="City" name="city" placeholder="City" />
              <Field label="State" name="state" placeholder="State" />
              <Field label="Zip Code" name="zip" placeholder="12345" />
            </div>
          </div>

          {/* Mailing Address */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-3 text-sm sm:text-base">
              Mailing Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Street Address" name="mailingAddress" placeholder="123 Main St" />
              <Field label="City" name="mailingCity" placeholder="City" />
              <Field label="State" name="mailingState" placeholder="State" />
              <Field label="Zip Code" name="mailingZip" placeholder="12345" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center border-t gap-3 mt-6 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="bg-gray-100 w-full sm:w-1/2 hover:bg-gray-200 px-5 py-2 rounded-lg font-medium transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-yellow-400 w-full sm:w-1/2 hover:bg-yellow-500 px-6 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
