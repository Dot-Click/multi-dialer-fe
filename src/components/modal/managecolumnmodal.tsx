import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { IoClose, IoSearch } from "react-icons/io5";

// Props کے لیے انٹرفیس
interface ManageColumnsModalProps {
  onClose: () => void;
}

const ManageColumnsModal: React.FC<ManageColumnsModalProps> = ({ onClose }) => {
  const allFields = ["Name", "Email", "Phone", "Last Dialed", "List", "Tags", "Company", "Created At"];

  const [available, setAvailable] = useState<string[]>(allFields.slice(4));
  const [display, setDisplay] = useState<string[]>(allFields.slice(0, 4));
  const [searchAvailable, setSearchAvailable] = useState<string>("");
  const [searchDisplay, setSearchDisplay] = useState<string>("");

  // مکمل طور پر ٹائپ شدہ handleMove فنکشن
  const handleMove = (
    field: string,
    from: string[],
    to: string[],
    setFrom: Dispatch<SetStateAction<string[]>>,
    setTo: Dispatch<SetStateAction<string[]>>
  ) => {
    setFrom(from.filter((item: string) => item !== field));
    setTo([...to, field]);
  };

  const filteredAvailable = available.filter((item: string) =>
    item.toLowerCase().includes(searchAvailable.toLowerCase())
  );
  const filteredDisplay = display.filter((item: string) =>
    item.toLowerCase().includes(searchDisplay.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white w-full max-w-2xl sm:max-w-3xl rounded-2xl shadow-2xl p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
        >
          <IoClose className="text-2xl" />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold mb-6 text-gray-800 text-center sm:text-left">
          Data columns
        </h2>

        {/* Columns Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Available fields */}
          <div className="border border-gray-200 rounded-xl p-4 h-[320px] flex flex-col shadow-sm">
            <h3 className="text-[15px] font-medium mb-3 text-gray-800">Available fields</h3>
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
            <div className="overflow-y-auto custom-scrollbar flex-1 space-y-2">
              {filteredAvailable.length ? (
                filteredAvailable.map((field: string) => (
                  <label
                    key={field}
                    className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1 transition"
                  >
                    <input
                      type="checkbox"
                      onChange={() =>
                        handleMove(field, available, display, setAvailable, setDisplay)
                      }
                      className="w-4 h-4 accent-gray-900 text-white cursor-pointer"
                    />
                    {field}
                  </label>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center">No fields found</p>
              )}
            </div>
          </div>

          {/* Fields to display */}
          <div className="border border-gray-200 rounded-xl p-4 h-[320px] flex flex-col shadow-sm">
            <h3 className="text-[15px] font-medium mb-3 text-gray-800">Fields to display</h3>
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
            <div className="overflow-y-auto custom-scrollbar flex-1 space-y-2">
              {filteredDisplay.length ? (
                filteredDisplay.map((field: string) => (
                  <label
                    key={field}
                    className="flex items-center gap-2 text-[15px] font-[400] text-gray-900 cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1 transition"
                  >
                    <input
                      type="checkbox"
                      checked
                      onChange={() =>
                        handleMove(field, display, available, setDisplay, setAvailable)
                      }
                      className="w-4 h-4 accent-gray-900 text-white cursor-pointer"
                    />
                    {field}
                  </label>
                ))
              ) : (
                <p className="text-xs text-gray-500 text-center">No fields found</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-3 cursor-pointer rounded-lg w-full text-base text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button className="bg-[#FFCA06] px-4 py-3 cursor-pointer rounded-lg w-full text-base font-medium text-black hover:bg-[#f5bd00] transition">
            Submit Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageColumnsModal;