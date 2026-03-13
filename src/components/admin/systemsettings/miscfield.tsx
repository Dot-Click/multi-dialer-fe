import { useState } from "react";
import type { FC } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useMiscFields } from "@/hooks/useSystemSettings";
import { IoIosArrowDown } from "react-icons/io";
import AdminMiscModal from "@/components/modal/adminmiscmodal";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

// FieldRow Component
const FieldRow: FC<{ field: any; onDelete: (id: string) => void }> = ({ field, onDelete }) => {
  const renderInput = () => {
    switch (field.type) {
      case "Dropdown":
        return (
          <div className="relative w-full border-b border-gray-200 dark:border-slate-700">
            <select className="w-full bg-transparent appearance-none py-2 focus:outline-none dark:text-white">
              <option value="">Select...</option>
              {field.options?.map((option: string) => (
                <option key={option} value={option.toLowerCase()}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <IoIosArrowDown />
            </div>
          </div>
        );
      case "Counter":
        return (
          <div className="flex items-center gap-4 w-full border-b border-gray-200 dark:border-slate-700 py-1">
            <div className="flex items-center gap-2">
              <button className="bg-gray-100 dark:bg-slate-700 rounded-md px-2.5 py-1 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600">-</button>
              <span className="font-semibold w-4 text-center dark:text-white">{field.countFrom || 0}</span>
              <button className="bg-gray-100 dark:bg-slate-700 rounded-md px-2.5 py-1 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600">+</button>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">Range: {field.countFrom} - {field.countTo}</span>
          </div>
        )
      case "Date":
        return (
          <div className="grow border-b border-gray-200 dark:border-slate-700">
            <input type="date" className="w-full bg-transparent py-2 focus:outline-none dark:text-white" />
          </div>
        )
      default:
        return (
          <div className="grow border-b border-gray-200 dark:border-slate-700">
            <input
              type="text"
              placeholder="Enter text"
              className="w-full bg-transparent py-2 focus:outline-none dark:text-white dark:placeholder-gray-500"
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between group">
      <label className="text-base text-gray-950 dark:text-gray-300 font-medium mb-1 md:mb-0 md:w-2/5 md:pr-4">
        {field.fieldName}
      </label>

      {renderInput()}

      <button
        onClick={() => onDelete(field.id)}
        className="mt-2 md:mt-0 md:ml-4 text-gray-300 hover:text-red-500 self-start md:self-auto transition-colors"
      >
        <FaTrash size={16} />
      </button>
    </div>
  );
};

// Main MiscField Component
const MiscField: FC = () => {
  const { data: miscFields, isLoading, deleteMiscField } = useMiscFields();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this field?")) {
      try {
        await deleteMiscField.mutateAsync(id);
        toast.success("Field deleted successfully");
      } catch (err) {
        toast.error("Failed to delete field");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-500" />
      </div>
    )
  }

  const fields = miscFields || [];
  const half = Math.ceil(fields.length / 2);
  const leftColumn = fields.slice(0, half);
  const rightColumn = fields.slice(half);

  return (
    <div className="bg-white dark:bg-slate-800 px-4 py-5 rounded-lg w-full max-w-7xl mx-auto relative border dark:border-slate-700">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8">Misc Fields</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-16 gap-y-6">
        <div className="flex flex-col gap-y-3">
          {leftColumn.map((field: any) => (
            <FieldRow key={field.id} field={field} onDelete={handleDelete} />
          ))}
          {leftColumn.length === 0 && <p className="text-gray-400 dark:text-gray-500 text-sm">No fields defined.</p>}
        </div>
        <div className="flex flex-col gap-y-3">
          {rightColumn.map((field: any) => (
            <FieldRow key={field.id} field={field} onDelete={handleDelete} />
          ))}
        </div>
      </div>

      {/* Add Field Button */}
      <div className="mt-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-950 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
          <FaPlus size={14} />
          <span className="text-base font-medium">Add Field</span>
        </button>
      </div>

      {isModalOpen && <AdminMiscModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default MiscField;
