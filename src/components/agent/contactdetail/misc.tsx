import { useMiscFields } from "@/hooks/useSystemSettings";
import { Loader2 } from "lucide-react";

const Misc = () => {
  const { data: miscFields, isLoading, isError } = useMiscFields();

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

  // If no misc fields defined, show a message or use default ones? 
  // The user asked to integrate the backend ones, so I'll prioritize them.
  // If none exist, we can show a placeholder or empty state.

  const fields = miscFields || [];

  // Split fields into two columns
  const half = Math.ceil(fields.length / 2);
  const leftFields = fields.slice(0, half);
  const rightFields = fields.slice(half);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10">

      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-3">
        {leftFields.length > 0 ? (
          leftFields.map((field) => (
            <div key={field.id} className="flex items-center w-full gap-4">
              <label className="text-[14px] font-medium text-[#0E1011] w-40">
                {field.fieldName}
              </label>

              <div className="flex-1 border-b border-gray-300">
                {field.type === 'dropdownSchema' && field.options ? (
                  <select className="w-full text-sm text-gray-900 outline-none py-1 focus:border-b focus:border-gray-600 bg-transparent">
                    <option value="">Select...</option>
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === 'counterSchema' ? 'number' : field.type === 'dateSchema' ? 'date' : 'text'}
                    className="w-full text-sm text-gray-900 outline-none py-1 focus:border-b focus:border-gray-600"
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No custom fields defined in left column.</p>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-3">
        {rightFields.length > 0 ? (
          rightFields.map((field) => (
            <div key={field.id} className="flex items-center w-full gap-4">
              <label className="text-[14px] font-medium text-[#0E1011] w-40">
                {field.fieldName}
              </label>

              <div className="flex-1 border-b border-gray-300">
                {field.type === 'dropdownSchema' && field.options ? (
                  <select className="w-full text-sm text-gray-900 outline-none py-1 focus:border-b focus:border-gray-600 bg-transparent">
                    <option value="">Select...</option>
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === 'counterSchema' ? 'number' : field.type === 'dateSchema' ? 'date' : 'text'}
                    className="w-full text-sm text-gray-900 outline-none py-1 focus:border-b focus:border-gray-600"
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No custom fields defined in right column.</p>
        )}
      </div>
    </div>
  );
};

export default Misc;
