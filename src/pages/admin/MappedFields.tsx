import{ useState } from "react";
import { FiX } from "react-icons/fi";

const yourFields = [
  "First Name",
  "Middle Name",
  "Last Name",
  "2",
  "3",
  "4",
  "5",
  "Phone 1",
  "Phone 2",
];

const mojoFields = [
  { name: "Name", details: "Full customer name used for records." },
  { name: "Property Address", details: "Customer property street address." },
  { name: "Property City", details: "City where the property is located." },
  { name: "Property State", details: "State of the given property." },
  { name: "Property Zip Code", details: "ZIP Code for the property location." },
  { name: "Phone", details: "Primary phone number for contact." },
];

export default function MappedFields() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const handleOpen = (item: any) => {
    setSelected(item);
    setOpen(true);
  };

  return (
    <div className="p-6">
      {/* Button to open the mapping modal */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-black text-white"
      >
        Open Mapping
      </button>

      {/* MAIN MODAL */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[520px] max-h-[80vh] overflow-hidden">

            {/* HEADER */}
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-semibold">Mapped Fields</h2>
              <button onClick={() => setOpen(false)}>
                <FiX size={22} className="text-gray-600" />
              </button>
            </div>

            {/* SCROLL CONTENT */}
            <div className="grid grid-cols-2 gap-4 p-5 max-h-[60vh] overflow-y-auto">

              {/* YOUR FIELDS */}
              <div>
                <p className="font-semibold text-gray-700 mb-2">Your fields:</p>
                <div className="space-y-2">
                  {yourFields.map((f, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700"
                    >
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* MOJO FIELDS */}
              <div>
                <p className="font-semibold text-gray-700 mb-2">Mojo Fields:</p>
                <div className="space-y-2">
                  {mojoFields.map((f, i) => (
                    <div
                      key={i}
                      onClick={() => handleOpen(f)}
                      className="cursor-pointer bg-gray-100 rounded-lg p-3 text-sm text-gray-700 hover:bg-gray-200 transition"
                    >
                      {f.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* DETAILS POPUP */}
          {selected && (
            <div className="absolute top-1/2 left-[58%] translate-y-[-50%] w-[320px] bg-white rounded-xl shadow-lg p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">
                  {selected.name} field
                </h3>
                <button onClick={() => setSelected(null)}>
                  <FiX size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-600">{selected.details}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
