import { useMiscFields } from "@/hooks/useSystemSettings";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateContact } from "@/store/slices/contactSlice";
import toast from "react-hot-toast";

const Misc = () => {
  const dispatch = useAppDispatch();
  const { currentContact } = useAppSelector((state) => state.contacts);
  const { data: miscFields, isLoading, isError } = useMiscFields();
  const [values, setValues] = useState<Record<string, any>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (currentContact?.miscValues) {
      setValues(currentContact.miscValues as Record<string, any>);
    }
  }, [currentContact]);

  const handleChange = (fieldId: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSave = async () => {
    if (!currentContact) return;
    setIsUpdating(true);
    try {
      await dispatch(
        updateContact({
          id: currentContact.id,
          payload: { miscValues: values },
        })
      ).unwrap();
      toast.success("Misc details saved successfully");
    } catch (error: any) {
      toast.error("Failed to save misc details: " + error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500 w-full">
        Failed to load additional fields.
      </div>
    );
  }

  const fields = miscFields || [];
  const half = Math.ceil(fields.length / 2);
  const leftFields = fields.slice(0, half);
  const rightFields = fields.slice(half);

  const renderField = (field: any) => {
    const value = values[field.id] || "";

    return (
      <div key={field.id} className="flex items-center w-full gap-4">
        <label className="text-[14px] font-medium text-[#0E1011] w-40">
          {field.fieldName}
        </label>

        <div className="flex-1 border-b border-gray-300">
          {field.type === "dropdown" ? (
            <select
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="w-full text-sm text-gray-900 outline-none py-1 focus:border-b focus:border-gray-600 bg-transparent"
            >
              <option value="">Select...</option>
              {field.options?.map((opt: string) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type === "counter" ? "number" : field.type === "date" ? "date" : "text"}
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className="w-full text-sm text-gray-900 outline-none py-1 focus:border-b focus:border-gray-600"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4">
          {leftFields.length > 0 ? (
            leftFields.map(renderField)
          ) : (
            <p className="text-gray-400 text-sm">No custom fields defined.</p>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4">
          {rightFields.map(renderField)}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="bg-[#0E1011] text-white px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
          Save Misc Details
        </button>
      </div>
    </div>
  );
};

export default Misc;
