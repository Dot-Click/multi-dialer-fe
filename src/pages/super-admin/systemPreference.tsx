import { Database, FileText, ChevronDown, MoveRight } from 'lucide-react';

const SystemPreference = () => {
    type DropdownFieldProps = {
  label: string;
  value: string;
};

  
  // Reusable Dropdown Component - Exactly matching your input style
  const DropdownField = ({ label, value }: DropdownFieldProps) => (
  <div className="bg-[#F3F4F7] py-[8px] px-4 rounded-[12px] mb-3 w-full cursor-pointer hover:bg-[#efeff0] transition-colors group">
    <label className="text-[14px] font-[500] text-[#495057] block mb-0.5">
      {label}
    </label>
    <div className="flex justify-between items-center">
      <span className="text-[16px] font-[400] text-[#71717A] work-sans">
        {value}
      </span>
      <ChevronDown className="w-4 h-4 text-[#828291] group-hover:text-[#343434] transition-colors" />
    </div>
  </div>
);
  return (
    <div className="bg-white p-4 work-sans md:px-8 md:py-[23px] rounded-[22px] shadow-sm w-full max-w-full mx-auto border border-gray-50">
      {/* Top Title */}
      <h2 className="text-[18px] font-[500] inter text-[#343434] mb-5">System Preferences</h2>

      {/* --- Language Section --- */}
      <div className="mb-8">
        <DropdownField label="Default Language" value="English" />
      </div>

      {/* --- Data Retention Policy Section --- */}
      <div className="mb-10">
        <div className="flex items-center gap-6 mb-8">
          <div className="bg-[#F4F4F5] p-2 rounded-lg">
            <Database className="w-5 h-5 text-[#343434]" />
          </div>
          <h3 className="font-[600] text-[18px] inter text-[#34363B]">Data Retention Policy</h3>
        </div>

        <div className="space-y-1">
          <DropdownField label="Call Log Retention" value="1 year" />
          <DropdownField label="Call Recordings Retention" value="90 days" />
          <DropdownField label="Inactive Users Data" value="180 days" />
        </div>
      </div>

      {/* Divider exactly like previous component */}
      <div className="h-[1px] bg-gray-100 w-full mb-10" />

      {/* --- Audit Logs Section --- */}
      <div>
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-[#F4F4F5] p-2 rounded-lg">
            <FileText className="w-5 h-5 text-[#343434]" />
          </div>
          <h3 className="font-[600] text-[18px] inter text-[#343434]">Audit Logs</h3>
        </div>

        <p className="text-[16px] font-[400] text-[#34363B] mb-5 max-w-full work-sans">
          System audit logs track all administrative actions and security events
        </p>

        {/* Action Row - Responsive Design */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex flex-wrap items-center gap-3">
            {/* Outline Pill */}
            <div className="border border-[#EBEDF0] px-[24px] py-[8px] rounded-[12px] text-[16px] font-[500] text-[#0E1011] work-sans">
              Last 90 days available
            </div>
            {/* Filled Pill */}
            <div className="bg-[#EBEDF0] px-[24px] py-[8px] rounded-[12px] text-[16px] font-[500] text-[#0E1011] work-sans">
              324 entries
            </div>
          </div>
          
          {/* View Logs Link */}
          <button className="flex items-center gap-2 text-[14px] font-[600] text-[#343434] hover:gap-3 transition-all inter
          border border-[#EBEDF0] px-[24px] py-[8px] rounded-[12px] text-[16px] font-[500] text-[#0E1011] work-sans">
            View Logs <MoveRight className="w-4 h-4" />
          </button>
        </div>

        {/* Small Footer Text */}
        <p className="text-[16px] font-[400] text-[#8D8D8D] mt-5 work-sans">
          Audit logs are automatically retained for 90 days and cannot be modified or deleted
        </p>
      </div>
    </div>
  );
};

export default SystemPreference;