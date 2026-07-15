import { useMemo, useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";
import { LuArrowDownAZ } from "react-icons/lu";
import { useMiscFields } from "@/hooks/useSystemSettings";

const STATIC_FIELDS = [
  "Name", "Email", "Phone", "Last Dialed", "List", "Tags",
  "Address", "City", "State", "Zip", "Description", "Status", "Disposition",
];

interface ManageColumnsModalProps {
  onClose: () => void;
  initialDisplayColumns?: string[];
  onApply?: (columns: string[]) => void;
}

const ManageColumnsModal: React.FC<ManageColumnsModalProps> = ({
  onClose,
  initialDisplayColumns,
  onApply,
}) => {
  const { data: miscFields } = useMiscFields();

  // Misc fields are fetched live from the API (same source as System
  // Settings → Profile Fields) — never hardcoded here. "notes" is excluded
  // to match the Contact Detail Profile tab, which hides it in favor of the
  // dedicated Description field.
  const miscFieldNames = useMemo(
    () =>
      (miscFields ?? [])
        .map((f) => f.fieldName)
        .filter((name) => name.trim().toLowerCase() !== "notes"),
    [miscFields]
  );

  // allFields is derived — recalculates whenever miscFieldNames loads/changes.
  const allFields = useMemo(
    () => [...STATIC_FIELDS, ...miscFieldNames.filter((f) => !STATIC_FIELDS.includes(f))],
    [miscFieldNames]
  );

  const defaultDisplay = initialDisplayColumns ?? allFields.slice(0, 4);

  // Only display[] is stored in state; available is always derived so new
  // misc fields appear automatically even if the API responded after mount.
  const [display, setDisplay] = useState<string[]>(defaultDisplay);

  const available = useMemo(
    () => allFields.filter((f) => !display.includes(f)),
    [allFields, display]
  );

  const [searchAvailable, setSearchAvailable] = useState("");
  const [searchDisplay, setSearchDisplay] = useState("");
  const [sortAZ, setSortAZ] = useState(false);

  const sortMaybe = (list: string[]) =>
    sortAZ ? [...list].sort((a, b) => a.localeCompare(b)) : list;

  const filteredAvailable = sortMaybe(
    available.filter((item) => item.toLowerCase().includes(searchAvailable.toLowerCase()))
  );
  const filteredDisplay = sortMaybe(
    display.filter((item) => item.toLowerCase().includes(searchDisplay.toLowerCase()))
  );

  const moveToDisplay = (field: string) => setDisplay((prev) => [...prev, field]);
  const moveToAvailable = (field: string) => setDisplay((prev) => prev.filter((f) => f !== field));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-2 sm:p-4">
      <div className="bg-white w-full dark:bg-slate-800 max-w-[95%] sm:max-w-2xl md:max-w-3xl rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-fadeIn">
        <div className="overflow-y-auto custom-scrollbar p-5 sm:p-6">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition bg-gray-100 rounded-full p-1"
          >
            <IoClose className="text-xl" />
          </button>

          {/* Header */}
          <div className="flex items-center justify-between gap-3 pr-8">
            <h2 className="text-lg dark:text-white font-semibold text-gray-900">Data Columns</h2>
            <button
              type="button"
              onClick={() => setSortAZ((prev) => !prev)}
              aria-pressed={sortAZ}
              title="Show columns in A-Z order"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                sortAZ
                  ? "bg-[#FFCA06] border-[#FFCA06] text-black"
                  : "bg-transparent border-gray-300 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              <LuArrowDownAZ className="text-base" />
              Sort A-Z
            </button>
          </div>

          {/* Two panels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Available */}
            <div className="rounded-xl p-4 h-[380px] flex flex-col">
              <h3 className="text-[15px] dark:text-white font-medium mb-3 text-gray-800">
                Available fields:
              </h3>
              <div className="relative mb-3">
                <input
                  type="text"
                  value={searchAvailable}
                  onChange={(e) => setSearchAvailable(e.target.value)}
                  placeholder="Search"
                  className="w-full border border-gray-300 rounded-3xl px-4 py-2 text-sm outline-none focus:border-gray-400"
                />
                <IoSearch className="absolute right-3 top-2.5 text-gray-400" />
              </div>
              <div className="overflow-y-auto flex-1 space-y-1 custom-scrollbar">
                {filteredAvailable.length ? (
                  filteredAvailable.map((field) => (
                    <label
                      key={field}
                      className="flex items-center gap-2 text-sm dark:text-white text-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 py-1 transition"
                    >
                      <input
                        type="checkbox"
                        onChange={() => moveToDisplay(field)}
                        className="w-4 h-4 accent-gray-900 cursor-pointer"
                      />
                      {field}
                    </label>
                  ))
                ) : (
                  <p className="text-xs dark:text-white text-gray-500 text-center">No fields found</p>
                )}
              </div>
            </div>

            {/* Display */}
            <div className="rounded-xl p-4 h-[380px] flex flex-col">
              <h3 className="text-[15px] dark:text-white font-medium mb-3 text-gray-800">
                Fields to display:
              </h3>
              <div className="relative mb-3">
                <input
                  type="text"
                  value={searchDisplay}
                  onChange={(e) => setSearchDisplay(e.target.value)}
                  placeholder="Search"
                  className="w-full border border-gray-300 rounded-3xl px-4 py-2 text-sm outline-none focus:border-gray-400"
                />
                <IoSearch className="absolute right-3 top-2.5 text-gray-400" />
              </div>
              <div className="overflow-y-auto flex-1 space-y-1 custom-scrollbar">
                {filteredDisplay.length ? (
                  filteredDisplay.map((field) => (
                    <label
                      key={field}
                      className="flex items-center gap-2 text-[15px] dark:text-white text-gray-900 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-2 py-1 transition"
                    >
                      <input
                        type="checkbox"
                        checked
                        onChange={() => moveToAvailable(field)}
                        className="w-4 h-4 accent-gray-900 cursor-pointer"
                      />
                      {field}
                    </label>
                  ))
                ) : (
                  <p className="text-xs dark:text-white text-gray-500 text-center">No fields found</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={onClose}
              className="w-full bg-[#EBEDF0] px-4 py-2 rounded-md text-sm text-gray-900 font-[500] hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              className="bg-[#FFCA06] w-full px-4 py-2 rounded-md text-sm font-medium text-black hover:bg-[#f5bd00]"
              onClick={() => {
                if (onApply) onApply(sortMaybe(display));
              }}
            >
              Submit Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageColumnsModal;
