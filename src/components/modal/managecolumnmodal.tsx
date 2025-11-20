import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { IoClose, IoSearch } from "react-icons/io5";

interface ManageColumnsModalProps {
  onClose: () => void;
}

const ManageColumnsModal: React.FC<ManageColumnsModalProps> = ({ onClose }) => {
  const allFields = ["Name", "Email", "Phone", "Last Dialed", "List", "Tags", "Company", "Created At"];

  const [available, setAvailable] = useState<string[]>(allFields.slice(4));
  const [display, setDisplay] = useState<string[]>(allFields.slice(0, 4));
  const [searchAvailable, setSearchAvailable] = useState<string>("");
  const [searchDisplay, setSearchDisplay] = useState<string>("");

  const handleMove = (
    field: string,
    from: string[],
    to: string[],
    setFrom: Dispatch<SetStateAction<string[]>>,
    setTo: Dispatch<SetStateAction<string[]>>
  ) => {
    setFrom(from.filter((item) => item !== field));
    setTo([...to, field]);
  };

  const filteredAvailable = available.filter((item) =>
    item.toLowerCase().includes(searchAvailable.toLowerCase())
  );
  const filteredDisplay = display.filter((item) =>
    item.toLowerCase().includes(searchDisplay.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-2 sm:p-4">
      {/* Modal Box */}
      <div
        className="bg-white w-full max-w-[95%] sm:max-w-2xl md:max-w-3xl rounded-2xl shadow-2xl relative flex flex-col
        max-h-[90vh] overflow-hidden animate-fadeIn"
      >
        {/* Scrollable Content Area */}
        <div className="overflow-y-auto custom-scrollbar p-5 sm:p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition bg-gray-100 rounded-full p-1"
          >
            <IoClose className="text-xl" />
          </button>

          {/* Header */}
          <h2 className="text-lg font-semibold text-gray-900">
            Data Columns
          </h2>

          {/* Columns Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Available Fields */}
            <div className="border border-gray-200 rounded-xl p-4 h-[320px] flex flex-col shadow-sm">
              <h3 className="text-[15px] font-medium mb-3 text-gray-800">
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
              <div className="overflow-y-auto flex-1 space-y-2 custom-scrollbar">
                {filteredAvailable.length ? (
                  filteredAvailable.map((field) => (
                    <label
                      key={field}
                      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1 transition"
                    >
                      <input
                        type="checkbox"
                        onChange={() =>
                          handleMove(field, available, display, setAvailable, setDisplay)
                        }
                        className="w-4 h-4 accent-gray-900 cursor-pointer"
                      />
                      {field}
                    </label>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 text-center">No fields found</p>
                )}
              </div>
            </div>

            {/* Fields to Display */}
            <div className="border border-gray-200 rounded-xl p-4 h-[320px] flex flex-col shadow-sm">
              <h3 className="text-[15px] font-medium mb-3 text-gray-800">
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
              <div className="overflow-y-auto flex-1 space-y-2 custom-scrollbar">
                {filteredDisplay.length ? (
                  filteredDisplay.map((field) => (
                    <label
                      key={field}
                      className="flex items-center gap-2 text-[15px] text-gray-900 cursor-pointer hover:bg-gray-50 rounded-md px-2 py-1 transition"
                    >
                      <input
                        type="checkbox"
                        checked
                        onChange={() =>
                          handleMove(field, display, available, setDisplay, setAvailable)
                        }
                        className="w-4 h-4 accent-gray-900 cursor-pointer"
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
         <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={onClose}
            className=" w-full bg-[#EBEDF0] px-4 py-2 rounded-md text-sm text-gray-900 font-[500] hover:bg-gray-100"
          >
            Cancel
          </button>
          <button className="bg-[#FFCA06] w-full px-4 py-2 rounded-md text-sm font-medium text-black hover:bg-[#f5bd00]">
            Submit Changes
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ManageColumnsModal;
