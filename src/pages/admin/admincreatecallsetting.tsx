import { useState, useEffect } from "react";
import type { FC, ReactNode } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AddRecordingModal from "@/components/modal/addrecordingmodal";
import { useRecordings, type RecordingItem } from "@/hooks/useRecordings";
import { useCallSettings } from "@/hooks/useSystemSettings";
import { useScript, type ScriptData } from "@/hooks/useScript";
import { useCallerIds, type CallerId } from "@/hooks/useSystemSettings";

// Types
interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
}

interface SelectFieldProps {
  label: string;
  children: ReactNode;
}

interface CheckboxFieldProps {
  label: string;
}

interface RadioGroupProps {
  title: string;
  name: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}

// Reusable Input Field Component
const InputField: FC<InputFieldProps & { onChange?: (value: string) => void }> = ({ label, type = "text", placeholder, value, onChange }) => (
  <div className="bg-gray-100 rounded-lg px-4 py-2">
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
    />
  </div>
);

// Reusable Select Field Component
const SelectField: FC<SelectFieldProps & { value?: string; onChange?: (value: string) => void }> = ({ label, children, value, onChange }) => (
  <div className="relative bg-gray-100 rounded-lg px-4 py-2">
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange?.(e.target.value)}
      className="w-full bg-transparent text-sm text-gray-800 appearance-none focus:outline-none cursor-pointer"
    >
      {children}
    </select>
    <IoIosArrowDown className="absolute right-4 top-8 text-gray-500 pointer-events-none" />
  </div>
);

// Reusable Checkbox Component
const CheckboxField: FC<CheckboxFieldProps & { checked?: boolean; onChange?: (checked: boolean) => void }> = ({ label, checked, onChange }) => (
  <div className="flex items-center gap-3">
    <input 
      type="checkbox" 
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      className="h-4 w-4 rounded accent-black border-gray-300 focus:ring-blue-400" 
    />
    <label className="text-sm text-gray-700">{label}</label>
  </div>
);

// Reusable Radio Group Component
const RadioGroup: FC<RadioGroupProps> = ({ title, name, options, selected, onChange }) => (
  <div>
    <h3 className="text-sm font-semibold text-gray-800 mb-3">{title}</h3>
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <div key={option} className="flex items-center gap-3">
          <input
            type="radio"
            id={`${name}-${option}`}
            name={name}
            value={option}
            checked={selected === option}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 accent-black border-gray-300 focus:ring-blue-400"
          />
          <label htmlFor={`${name}-${option}`} className="text-sm text-gray-700">
            {option}
          </label>
        </div>
      ))}
    </div>
  </div>
);

const AdminCreateCallSetting: FC = () => {
  const navigate = useNavigate();
  const { createCallSettings } = useCallSettings();

  // Form state
  const [name, setName] = useState("");
  const [onHoldRecording1, setOnHoldRecording1] = useState("");
  const [onHoldRecording2, setOnHoldRecording2] = useState("");
  const [onHoldRecording3, setOnHoldRecording3] = useState("");
  const [answeringMachineRecording, setAnsweringMachineRecording] = useState("");
  const [enableAutoPause, setEnableAutoPause] = useState(false);
  const [enableRecording, setEnableRecording] = useState(false);
  const [sendAppointmentMail, setSendAppointmentMail] = useState(false);
  const [dncCalls, setDncCalls] = useState("No");
  const [callerId, setCallerId] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [noOfLines, setNoOfLines] = useState("");
  const [phoneRingTime, setPhoneRingTime] = useState("");
  const [callScript, setCallScript] = useState("");
  const [sendEmail, setSendEmail] = useState("No");
  const [sendText, setSendText] = useState("No");
  const [isLoading, setIsLoading] = useState(false);

  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getRecordings } = useRecordings();

  const [scripts, setScripts] = useState<ScriptData[]>([]);
  const { getScripts } = useScript();

  const [callerIds, setCallerIds] = useState<CallerId[]>([]);
  const { data: callerIdsData } = useCallerIds();

  useEffect(() => {
    if (callerIdsData) {
      setCallerIds(callerIdsData as CallerId[]);
    }
  }, [callerIdsData]);

  const fetchRecordings = async () => {
    const data = await getRecordings();
    setRecordings(data);
  };

  const fetchScripts = async () => {
    const data = await getScripts();
    setScripts(data);
  };

  useEffect(() => {
    fetchRecordings();
    fetchScripts();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        label:name,
        onHoldRecording1: onHoldRecording1 || undefined,
        onHoldRecording2: onHoldRecording2 || undefined,
        onHoldRecording3: onHoldRecording3 || undefined,
        answeringMachineRecording: answeringMachineRecording || undefined,
        enableAutoPause,
        enableRecording,
        sendAppointmentMail,
        dncCalls: dncCalls === "Yes",
        callerId: callerId || undefined,
        countryCode: countryCode || undefined,
        noOfLines: noOfLines ? parseInt(noOfLines) : undefined,
        phoneRingTime: phoneRingTime || undefined,
        callScript: callScript || undefined,
        sendEmail: sendEmail === "Yes",
        sendText: sendText === "Yes",
      };

      await createCallSettings.mutateAsync(payload);
      toast.success("Call Settings created successfully");
      navigate("/admin/system-settings");
    } catch (error: any) {
      toast.error(error.message || "Failed to save call settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/system-settings");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 rounded-2xl">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-2">
          <h1 className="text-2xl font-semibold text-gray-950">Create Call Settings</h1>
          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <button 
              onClick={handleCancel}
              disabled={isLoading}
              className="px-5 py-2 text-sm font-semibold w-28 text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isLoading}
              className="px-5 py-2 text-sm font-semibold w-28 text-gray-950 bg-[#FFCA06] rounded-md hover:bg-[#f1c00b] disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-8">
          {/* Section 1 */}
          <div className="lg:w-[50%]">
            <InputField 
              label="Name" 
              placeholder="Enter Name"
              value={name}
              onChange={setName}
            />
          </div>

          {/* Section 2 */}
          <div>
            <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Voice recordings Details</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm font-medium bg-yellow-400 text-black rounded-md hover:bg-yellow-500 transition-colors"
            >
              Add Recording
            </button>
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField label="On-hold Recording 1" value={onHoldRecording1} onChange={setOnHoldRecording1}>
                <option value="">Select</option>
                {recordings.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </SelectField>
              <SelectField label="On-hold Recording 2" value={onHoldRecording2} onChange={setOnHoldRecording2}>
                <option value="">Select</option>
                {recordings.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </SelectField>
              <SelectField label="On-hold Recording 3" value={onHoldRecording3} onChange={setOnHoldRecording3}>
                <option value="">Select</option>
                {recordings.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </SelectField>
              <SelectField label="Answering Machine Recordings" value={answeringMachineRecording} onChange={setAnsweringMachineRecording}>
                <option value="">Select</option>
                {recordings.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </SelectField>
            </div>
          </div>

          {/* Section 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">General Communication</h2>
              <div className="space-y-4">
                <CheckboxField 
                  label="Enable Auto Pause" 
                  checked={enableAutoPause}
                  onChange={setEnableAutoPause}
                />
                <CheckboxField 
                  label="Enable Recording" 
                  checked={enableRecording}
                  onChange={setEnableRecording}
                />
                <CheckboxField 
                  label="Send scheduled appointment mail in outlook format" 
                  checked={sendAppointmentMail}
                  onChange={setSendAppointmentMail}
                />
              </div>
            </div>
            <div>
              <RadioGroup
                title="Make Calls to DNC Numbers"
                name="dnc"
                options={["No", "Yes"]}
                selected={dncCalls}
                onChange={setDncCalls}
              />
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
              <div className="sm:col-span-3">
                <SelectField 
                  label="Caller ID" 
                  value={callerId}
                  onChange={setCallerId}
                >
                  <option value="">Select</option>
                  {callerIds.map(cid => (
                    <option key={cid.id} value={cid.twillioNumber || cid.id}>{cid.label} ({cid.twillioNumber})</option>
                  ))}
                </SelectField>
              </div>
              <div className="sm:col-span-2">
                <SelectField label="Country Code" value={countryCode} onChange={setCountryCode}>
                  <option value="">Select</option>
                  <option value="US">US</option>
                  <option value="CA">CA</option>
                  <option value="GB">GB</option>
                </SelectField>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <SelectField label="No of Lines" value={noOfLines} onChange={setNoOfLines}>
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="5">5</option>
              </SelectField>
              <SelectField label="Phone Ring Time" value={phoneRingTime} onChange={setPhoneRingTime}>
                <option value="">Select</option>
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="45">45 seconds</option>
                <option value="60">60 seconds</option>
              </SelectField>
              <SelectField label="Call Script" value={callScript} onChange={setCallScript}>
                <option value="">Select</option>
                {scripts.map(s => (
                  <option key={s.id} value={s.id}>{s.scriptName}</option>
                ))}
              </SelectField>
            </div>
          </div>

          {/* Section 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-4 border-t border-gray-200">
            <RadioGroup
              title="Send Email"
              name="email"
              options={["No", "Yes"]}
              selected={sendEmail}
              onChange={setSendEmail}
            />
            <RadioGroup
              title="Send Text"
              name="text"
              options={["No", "Yes"]}
              selected={sendText}
              onChange={setSendText}
            />
          </div>
        </div>
      </div>
      {isModalOpen && (
        <AddRecordingModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchRecordings}
        />
      )}
    </div>
  );
};

export default AdminCreateCallSetting;
