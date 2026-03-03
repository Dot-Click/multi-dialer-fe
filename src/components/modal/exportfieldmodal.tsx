import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { downloadCSV } from "@/utils/csvDownload";
import toast from "react-hot-toast";
import { IoClose, IoSearch } from "react-icons/io5";

interface ExportFieldsModalProps {
  onClose: () => void;
}

const ExportFieldsModal: React.FC<ExportFieldsModalProps> = ({ onClose }) => {
  const [search, setSearch] = useState("");
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const { contacts } = useAppSelector((state) => state.contacts);
  const fields = [
    "Name",
    "Email",
    "Phone",
    "City",
    "State",
    "Zip",
    "Created At",
    "Updated At",
    "Tags",
  ];

  const filteredFields = fields.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase()),
  );

  const fieldMapping: Record<string, string> = {
    Name: "name",
    Email: "email",
    Phone: "phone",
    City: "city",
    State: "state",
    Zip: "zip",
    "Created At": "createdAt",
    "Updated At": "updatedAt",
    Tags: "tags",
  };

  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field],
    );
  };

  const handleExport = () => {
    if (selectedFields.length === 0) {
      toast.error("Please select at least one field");
      return;
    }

    downloadCSV(
      contacts,
      selectedFields,
      fieldMapping,
      `contacts-export-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Fields to export
          </h2>
          <button onClick={onClose}>
            <IoClose className="text-2xl bg-gray-200 rounded-sm text-gray-600 " />
          </button>
        </div>

        {/* Search */}
        <div className="relative mx-5 mt-4">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-100 w-full py-2 px-4 pr-10 text-sm rounded-full outline-none placeholder:text-gray-500"
          />
          <IoSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />
        </div>

        {/* Fields list */}
        <div className="overflow-y-auto max-h-72 mt-4 px-5 custom-scrollbar">
          {filteredFields.map((field, idx) => (
            <label
              key={idx}
              className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-none"
            >
              <input
                type="checkbox"
                checked={selectedFields.includes(field)}
                onChange={() => toggleField(field)}
                className="w-4 h-4 appearance-none border border-gray-400  checked:bg-black checked:border-black checked:after:content-['✔'] checked:after:text-white checked:after:text-[11px] checked:after:flex checked:after:items-center checked:after:justify-center"
              />
              <span className="text-gray-800 text-sm">{field}</span>
            </label>
          ))}

          {filteredFields.length === 0 && (
            <p className="text-gray-500 text-center py-6 text-sm">
              No fields found
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t">
          <button
            onClick={handleExport}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2.5 rounded-lg"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportFieldsModal;
