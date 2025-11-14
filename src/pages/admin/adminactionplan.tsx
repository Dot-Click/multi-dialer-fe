// import React, { useState } from "react";
// import { Steps, message } from "antd";
// import { FiHelpCircle, FiPlus, FiX } from "react-icons/fi";
// import { RxDragHandleDots2 } from "react-icons/rx";

// // STEP 1, 2, 3 کے کمپوننٹس (کوئی تبدیلی نہیں)
// const RadioGroup = ({ title, description, name, options, selectedValue, onChange }) => ( <div className="space-y-3"> <div className="flex items-center gap-2"><h3 className="text-base font-semibold text-gray-900">{title}</h3><FiHelpCircle className="text-gray-400" size={18} /></div> {description && <p className="text-sm text-gray-500">{description}</p>} <div className="space-y-2 mt-1">{options.map((option) => (<label key={option.value} className="flex items-center gap-3 cursor-pointer"><input type="radio" name={name} value={option.value} checked={selectedValue === option.value} onChange={(e) => onChange(e.target.value)} className="h-4 w-4 accent-black" /><span className="text-sm text-gray-700">{option.label}</span></label>))}</div> </div> );
// const Step1Content = ({ formData, setFormData }) => { const handleRadioChange = (name, value) => setFormData((prev) => ({ ...prev, [name]: value })); return (<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-10"><div className="bg-[#F9FAFB] border border-gray-200 p-3 rounded-lg w-full max-w-sm"><label className="block text-xs text-gray-500 mb-1">Label</label><input type="text" value={formData.label} onChange={(e) => setFormData((p) => ({ ...p, label: e.target.value }))} className="bg-transparent w-full text-gray-900 font-medium focus:outline-none" /></div><RadioGroup title="Select Your Scheduling Type" name="schedulingType" options={[{ label: "Frequency-Based", value: "frequency" }, { label: "Date-Based", value: "date" }]} selectedValue={formData.schedulingType} onChange={(value) => handleRadioChange("schedulingType", value)} /><RadioGroup title="Select Your Scheduling Logic" name="schedulingLogic" options={[{ label: "Frequency-Based", value: "frequency" }, { label: "Date-Based", value: "date" }]} selectedValue={formData.schedulingLogic} onChange={(value) => handleRadioChange("schedulingLogic", value)} /><RadioGroup title="Select Weekend Scheduling" description="Do you want steps to be scheduled on weekends?" name="weekendScheduling" options={[{ label: "Frequency-Based", value: "frequency" }, { label: "Date-Based", value: "date" }]} selectedValue={formData.weekendScheduling} onChange={(value) => handleRadioChange("weekendScheduling", value)} /></div>); };
// const CustomDropdown = ({ label, options, value, onChange }) => ( <div className="w-full"> <label className="block text-xs text-gray-500 mb-1">{label}</label> <select value={value} onChange={onChange} className="w-full bg-transparent text-gray-900 text-sm focus:outline-none border-b border-gray-300 py-1.5"> {options.map(opt => <option key={opt} value={opt}>{opt}</option>)} </select> </div> );
// const CustomTextInput = ({ label, placeholder, value, onChange }) => ( <div className="w-full bg-gray-100/70 p-3 rounded-lg"> <label className="block text-xs text-gray-500 mb-1">{label}</label> <input type="text" placeholder={placeholder} value={value} onChange={onChange} className="w-full bg-transparent text-gray-900 text-sm focus:outline-none" /> </div> );
// const DaySelector = ({ value, onChange }) => ( <div className="flex-shrink-0"> <label className="block text-xs text-gray-500 mb-1 text-center">Begin on Day</label> <div className="flex items-center justify-center gap-2"> <button onClick={() => onChange(Math.max(0, value - 1))} className="w-6 h-6 rounded-md bg-gray-200 text-gray-700">-</button> <span className="font-semibold text-gray-900 w-6 text-center text-sm">{value}</span> <button onClick={() => onChange(value + 1)} className="w-6 h-6 rounded-md bg-gray-200 text-gray-700">+</button> </div> </div> );
// const ActionStepCard = ({ step, index, onUpdate, onDelete }) => { const handleFieldChange = (field, value) => { onUpdate(index, { ...step, [field]: value }); }; const actionOptions = ["Email", "Phone Call", "Task", "Letter", "Mailing Label"]; const templateOptions = ["Email Template #1", "Template #2"]; const scriptOptions = ["Script #1", "Script #2"]; return ( <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4"> <div className="flex flex-col md:flex-row items-start md:items-center gap-4"> <div className="flex items-center gap-2 w-full md:w-auto"> <RxDragHandleDots2 className="text-gray-400 cursor-grab" size={20} /> <h3 className="font-bold text-gray-800">Step #{index + 1}</h3> </div> <div className="flex-grow w-full"> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"> <CustomDropdown label="Action" options={actionOptions} value={step.type} onChange={e => handleFieldChange('type', e.target.value)} /> {step.type === "Email" && <CustomDropdown label="Template" options={templateOptions} value={step.template} onChange={e => handleFieldChange('template', e.target.value)} />} {step.type === "Phone Call" && <CustomDropdown label="Script" options={scriptOptions} value={step.script} onChange={e => handleFieldChange('script', e.target.value)} />} {step.type === "Task" && ( <div className="w-full"> <label className="block text-xs text-gray-500 mb-1">Subject</label> <input type="text" value={step.subject || ''} onChange={e => handleFieldChange('subject', e.target.value)} className="w-full bg-transparent text-gray-900 text-sm focus:outline-none border-b border-gray-300 py-1.5" /> </div> )} {step.type === "Letter" && <CustomDropdown label="Template" options={["Letter Template #1"]} value={step.template} onChange={e => handleFieldChange('template', e.target.value)} />} {step.type === "Mailing Label" && <CustomTextInput label="Title" value={step.title} onChange={e => handleFieldChange('title', e.target.value)} />} <div className="hidden lg:block"></div> <DaySelector value={step.day} onChange={val => handleFieldChange('day', val)} /> </div> {step.type === "Phone Call" && ( <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"> <CustomTextInput label="Subject" placeholder="Enter text here..." value={step.subject} onChange={e => handleFieldChange('subject', e.target.value)} /> <CustomTextInput label="Details" placeholder="Enter text here..." value={step.details} onChange={e => handleFieldChange('details', e.target.value)} /> </div> )} </div> <button onClick={() => onDelete(index)} className="text-red-500 hover:text-red-700 md:ml-auto"> <FiX size={22} /> </button> </div> </div> ); };
// const Step2Content = ({ actionSteps, setActionSteps }) => { const addStep = () => { const newStep = { type: "Email", template: "Email Template #1", day: 0 }; setActionSteps([...actionSteps, newStep]); }; const deleteStep = (index) => { setActionSteps(actionSteps.filter((_, i) => i !== index)); }; const updateStep = (index, updatedStep) => { const newSteps = [...actionSteps]; newSteps[index] = updatedStep; setActionSteps(newSteps); }; return ( <div className="space-y-4"> {actionSteps.map((step, index) => ( <ActionStepCard key={index} step={step} index={index} onUpdate={updateStep} onDelete={deleteStep} /> ))}</div> ); };
// const Step3Content = ({ triggerData, setTriggerData }) => { const handleRadioChange = (e) => { setTriggerData(prev => ({ ...prev, selectedTrigger: e.target.value })); }; const handleCheckboxChange = (e) => { setTriggerData(prev => ({...prev, removeOnRemove: e.target.checked })); }; const triggerOptions = [ { value: 'none', label: 'None' }, { value: 'calling_list', label: 'Adding a contact to Calling list' }, { value: 'group', label: 'Adding a contact to Group' }, ]; return ( <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6"> <h3 className="text-lg font-bold text-gray-900">Choose A Trigger</h3> <div className="space-y-3"> {triggerOptions.map(option => ( <label key={option.value} className="flex items-center gap-3 cursor-pointer"> <input type="radio" name="trigger" value={option.value} checked={triggerData.selectedTrigger === option.value} onChange={handleRadioChange} className="h-4 w-4 accent-black" /> <span className="text-sm text-gray-700">{option.label}</span> </label> ))} </div> <hr className="border-gray-200" /> <label className="flex items-center gap-3 cursor-pointer"> <input type="checkbox" checked={triggerData.removeOnRemove} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-400 accent-black" /> <span className="text-sm text-gray-700"> Remove from Action Plan if contact(s) are removed from the specified group / calling list </span> </label> </div> ); };

// // === نیا کمپوننٹ: STEP 4 کا مواد ===
// const Step4Content = ({ endLogicData, setEndLogicData }) => {

//     const handleRadioChange = (e) => {
//         setEndLogicData(prev => ({ ...prev, selectedEndLogic: e.target.value }));
//     };

//     const handleCheckboxChange = (e) => {
//         setEndLogicData(prev => ({ ...prev, assignGroup: e.target.checked }));
//     };

//     const handleGroupChange = (e) => {
//         setEndLogicData(prev => ({ ...prev, selectedGroup: e.target.value }));
//     };

//     return (
//         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-8">
//             {/* بالائی حصہ */}
//             <div className="space-y-4">
//                 <div>
//                     <h3 className="text-lg font-bold text-gray-900">Choose Your End Logic</h3>
//                     <p className="text-sm text-gray-500 mt-1">Here is where you decide what happens to a contact when it has gone through all of your Action Plan steps.</p>
//                 </div>
                
//                 {/* ریڈیو بٹنز */}
//                 <div className="space-y-4">
//                     {/* Option 1 */}
//                     <label className="flex items-start gap-3 cursor-pointer">
//                         <input type="radio" name="endLogic" value="do_nothing" checked={endLogicData.selectedEndLogic === 'do_nothing'} onChange={handleRadioChange} className="h-4 w-4 mt-1 accent-black flex-shrink-0" />
//                         <span className="text-sm text-gray-700 font-medium">Do nothing</span>
//                     </label>
//                     {/* Option 2 */}
//                     <label className="flex items-start gap-3 cursor-pointer">
//                         <input type="radio" name="endLogic" value="repeat" checked={endLogicData.selectedEndLogic === 'repeat'} onChange={handleRadioChange} className="h-4 w-4 mt-1 accent-black flex-shrink-0" />
//                         <div>
//                             <span className="text-sm text-gray-700 font-medium">Repeat current Action Plan</span>
//                             <p className="text-xs text-gray-500">This will repeat the current Action Plan and start on the day you choose.</p>
//                         </div>
//                     </label>
//                     {/* Option 3 */}
//                     <label className="flex items-start gap-3 cursor-pointer">
//                         <input type="radio" name="endLogic" value="start_other" checked={endLogicData.selectedEndLogic === 'start_other'} onChange={handleRadioChange} className="h-4 w-4 mt-1 accent-black flex-shrink-0" />
//                         <div>
//                             <span className="text-sm text-gray-700 font-medium">Start other Action Plan</span>
//                              {/* مشروط متن */}
//                             {endLogicData.selectedEndLogic === 'start_other' && (
//                                 <p className="text-xs text-red-500">You don't have another Action Plans, create more to chose this option.</p>
//                             )}
//                         </div>
//                     </label>
//                 </div>
//             </div>

//             {/* نچلا حصہ */}
//             <div className="space-y-4">
//                  <div>
//                     <h3 className="text-lg font-bold text-gray-900">Optional Group Assignment:</h3>
//                     <p className="text-sm text-gray-500 mt-1">This will automatically move the assigned contact to the group of your choice when the Action Plan has ended. This is popular with Dead Lead and Archive groups. If designated group is also a trigger group, it will assign the appropriate action plan.</p>
//                 </div>

//                 {/* چیک باکس */}
//                 <label className="flex items-center gap-3 cursor-pointer">
//                     <input type="checkbox" checked={endLogicData.assignGroup} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-400 accent-black" />
//                     <span className="text-sm text-gray-700 font-medium">Assign Group</span>
//                 </label>

//                 {/* مشروط ڈراپ ڈاؤن */}
//                 {endLogicData.assignGroup && (
//                     <div className="max-w-xs">
//                          <div className="w-full bg-gray-100/70 p-3 rounded-lg">
//                             <label className="block text-xs text-gray-500 mb-1">Group</label>
//                             <select value={endLogicData.selectedGroup} onChange={handleGroupChange} className="w-full bg-transparent text-gray-900 text-sm focus:outline-none">
//                                 <option value="">Select</option>
//                                 <option value="group1">Dead Leads</option>
//                                 <option value="group2">Archive</option>
//                             </select>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };


// // === مرکزی کمپوننٹ (اپ ڈیٹ شدہ) ===
// const AdminActionPlan = () => {
//     const [current, setCurrent] = useState(0);

//     const [formData, setFormData] = useState({ label: "Expired Property", schedulingType: "frequency", schedulingLogic: "frequency", weekendScheduling: "frequency" });
//     const [actionSteps, setActionSteps] = useState([ { type: 'Email', template: 'Email Template #1', day: 0 }, { type: 'Phone Call', script: 'Script #1', subject: '', details: '', day: 0 }, { type: 'Task', subject: '', day: 0 }, { type: 'Letter', template: 'Letter Template #1', day: 0 }, { type: 'Mailing Label', title: '', day: 0 } ]);
//     const [triggerData, setTriggerData] = useState({ selectedTrigger: 'none', removeOnRemove: false });
//     // Step 4 کے لیے اسٹیٹ
//     const [endLogicData, setEndLogicData] = useState({
//         selectedEndLogic: 'do_nothing',
//         assignGroup: true,
//         selectedGroup: '',
//     });

//     const steps = [
//         { title: "Action Plan", content: <Step1Content formData={formData} setFormData={setFormData} /> },
//         { title: "Action Steps", content: <Step2Content actionSteps={actionSteps} setActionSteps={setActionSteps} /> },
//         { title: "Trigger Group", content: <Step3Content triggerData={triggerData} setTriggerData={setTriggerData} /> },
//         { title: "End Logic", content: <Step4Content endLogicData={endLogicData} setEndLogicData={setEndLogicData} /> },
//     ];

//     const next = () => setCurrent(current + 1);
//     const prev = () => setCurrent(current - 1);
//     const handleSave = () => {
//         message.success('Action Plan Saved!');
//         // یہاں فارم جمع کرانے کی منطق شامل کریں
//     };

//     return (
//         <section className=" min-h-screen pr-3 py-4 font-sans">
//             <div className="max-w-7xl mx-auto">
//                 <header className="flex justify-between items-center mb-6">
//                     <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Action Plan</h1>
//                     <button className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold text-sm hover:bg-gray-300">Cancel</button>
//                 </header>
//                 <div className="mb-8 px-4"><Steps current={current} items={steps.map((s) => ({ key: s.title, title: s.title }))} /></div>
//                 <main>{steps[current].content}</main>
//                 <footer className="flex justify-between items-center mt-8">
//                     <div> {current === 1 && ( <button onClick={() => { const newStep = { type: "Email", template: "Email Template #1", day: 0 }; setActionSteps([...actionSteps, newStep]); }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 font-semibold text-sm hover:bg-gray-200"><FiPlus /> Add Step</button>)} </div>
//                     <div className="flex items-center gap-3">
//                         {current > 0 && (<button onClick={prev} className="px-4 py-2 w-28 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">Previous</button>)}
//                         {current < steps.length - 1 && (<button onClick={next} className="px-4 py-2 w-28 rounded-lg bg-yellow-400 text-gray-950 font-medium hover:bg-yellow-500">Next</button>)}
//                         {/* آخری مرحلے پر "Save" بٹن */}
//                         {current === steps.length - 1 && (<button onClick={handleSave} className="px-4 py-2 w-28 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-500">Save</button>)}
//                     </div>
//                 </footer>
//             </div>
//             <style jsx global>{` .ant-steps-item-process .ant-steps-item-icon { background-color: #fbbd23 !important; border-color: #fbbd23 !important; } .ant-steps-item-process .ant-steps-item-icon .ant-steps-icon { color: black !important; } .ant-steps-item-finish .ant-steps-item-icon { background-color: #fbbd23 !important; border-color: #fbbd23 !important; } .ant-steps-item-finish .ant-steps-item-icon .ant-steps-icon svg { color: black !important; } .ant-steps-item-finish > .ant-steps-item-container > .ant-steps-item-tail::after { background-color: #fbbd23 !important; } .ant-steps-item-wait .ant-steps-item-icon { background-color: #e5e7eb !important; border-color: #e5e7eb !important; } .ant-steps-item-wait .ant-steps-item-icon .ant-steps-icon { color: #6b7280 !important; } `}</style>
//         </section>
//     );
// };

// export default AdminActionPlan;


import React, { useState } from "react";
import { Steps, message } from "antd";
import { FiHelpCircle, FiPlus, FiX } from "react-icons/fi";
import { RxDragHandleDots2 } from "react-icons/rx";


interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  title: string;
  description?: string;
  name: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  title,
  description,
  name,
  options,
  selectedValue,
  onChange,
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <FiHelpCircle className="text-gray-400" size={18} />
    </div>

    {description && <p className="text-sm text-gray-500">{description}</p>}

    <div className="space-y-2 mt-1">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex items-center gap-3 cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selectedValue === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="h-4 w-4 accent-black"
          />
          <span className="text-sm text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  </div>
);

// ---------------------
// STEP 1: Action Plan
// ---------------------

interface Step1Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const Step1Content: React.FC<Step1Props> = ({ formData, setFormData }) => {
  const handleRadioChange = (name: string, value: string) =>
    setFormData((prev: any) => ({ ...prev, [name]: value }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-10">
      <div className="bg-[#F9FAFB] border border-gray-200 p-3 rounded-lg w-full max-w-sm">
        <label className="block text-xs text-gray-500 mb-1">Label</label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              label: e.target.value,
            }))
          }
          className="bg-transparent w-full text-gray-900 font-medium focus:outline-none"
        />
      </div>

      <RadioGroup
        title="Select Your Scheduling Type"
        name="schedulingType"
        options={[
          { label: "Frequency-Based", value: "frequency" },
          { label: "Date-Based", value: "date" },
        ]}
        selectedValue={formData.schedulingType}
        onChange={(value) => handleRadioChange("schedulingType", value)}
      />

      <RadioGroup
        title="Select Your Scheduling Logic"
        name="schedulingLogic"
        options={[
          { label: "Frequency-Based", value: "frequency" },
          { label: "Date-Based", value: "date" },
        ]}
        selectedValue={formData.schedulingLogic}
        onChange={(value) => handleRadioChange("schedulingLogic", value)}
      />

      <RadioGroup
        title="Select Weekend Scheduling"
        description="Do you want steps to be scheduled on weekends?"
        name="weekendScheduling"
        options={[
          { label: "Frequency-Based", value: "frequency" },
          { label: "Date-Based", value: "date" },
        ]}
        selectedValue={formData.weekendScheduling}
        onChange={(value) => handleRadioChange("weekendScheduling", value)}
      />
    </div>
  );
};

// ---------------------
// REUSABLE FIELDS
// ---------------------

interface CustomDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  value,
  onChange,
}) => (
  <div className="w-full">
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-transparent text-gray-900 text-sm focus:outline-none border-b border-gray-300 py-1.5"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

interface CustomTextInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
}) => (
  <div className="w-full bg-gray-100/70 p-3 rounded-lg">
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-transparent text-gray-900 text-sm focus:outline-none"
    />
  </div>
);

// ---------------------
// DAY SELECTOR
// ---------------------

interface DaySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ value, onChange }) => (
  <div className="flex-shrink-0">
    <label className="block text-xs text-gray-500 mb-1 text-center">
      Begin on Day
    </label>
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-6 h-6 rounded-md bg-gray-200 text-gray-700"
      >
        -
      </button>
      <span className="font-semibold text-gray-900 w-6 text-center text-sm">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-6 h-6 rounded-md bg-gray-200 text-gray-700"
      >
        +
      </button>
    </div>
  </div>
);

// ---------------------
// STEP 2: Action Step Card
// ---------------------

interface StepItem {
  type: string;
  template?: string;
  script?: string;
  subject?: string;
  details?: string;
  title?: string;
  day: number;
}

interface StepCardProps {
  step: StepItem;
  index: number;
  onUpdate: (index: number, step: StepItem) => void;
  onDelete: (index: number) => void;
}

const ActionStepCard: React.FC<StepCardProps> = ({
  step,
  index,
  onUpdate,
  onDelete,
}) => {
  const handleFieldChange = (field: string, value: any) => {
    onUpdate(index, { ...step, [field]: value });
  };

  const actionOptions = [
    "Email",
    "Phone Call",
    "Task",
    "Letter",
    "Mailing Label",
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <RxDragHandleDots2 className="text-gray-400 cursor-grab" size={20} />
          <h3 className="font-bold text-gray-800">Step #{index + 1}</h3>
        </div>

        <div className="flex-grow w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <CustomDropdown
              label="Action"
              options={actionOptions}
              value={step.type}
              onChange={(e) =>
                handleFieldChange("type", (e.target as HTMLSelectElement).value)
              }
            />

            {step.type === "Email" && (
              <CustomDropdown
                label="Template"
                options={["Email Template #1", "Template #2"]}
                value={step.template || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "template",
                    (e.target as HTMLSelectElement).value
                  )
                }
              />
            )}

            {step.type === "Phone Call" && (
              <CustomDropdown
                label="Script"
                options={["Script #1", "Script #2"]}
                value={step.script || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "script",
                    (e.target as HTMLSelectElement).value
                  )
                }
              />
            )}

            {step.type === "Task" && (
              <CustomTextInput
                label="Subject"
                value={step.subject || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "subject",
                    (e.target as HTMLInputElement).value
                  )
                }
              />
            )}

            <DaySelector
              value={step.day}
              onChange={(v) => handleFieldChange("day", v)}
            />
          </div>

          {step.type === "Phone Call" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <CustomTextInput
                label="Subject"
                placeholder="Enter text here..."
                value={step.subject || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "subject",
                    (e.target as HTMLInputElement).value
                  )
                }
              />
              <CustomTextInput
                label="Details"
                placeholder="Enter text here..."
                value={step.details || ""}
                onChange={(e) =>
                  handleFieldChange(
                    "details",
                    (e.target as HTMLInputElement).value
                  )
                }
              />
            </div>
          )}
        </div>

        <button
          onClick={() => onDelete(index)}
          className="text-red-500 hover:text-red-700 md:ml-auto"
        >
          <FiX size={22} />
        </button>
      </div>
    </div>
  );
};

// ---------------------
// STEP 2 Component
// ---------------------

interface Step2Props {
  actionSteps: StepItem[];
  setActionSteps: React.Dispatch<React.SetStateAction<StepItem[]>>;
}

const Step2Content: React.FC<Step2Props> = ({
  actionSteps,
  setActionSteps,
}) => {
  const updateStep = (index: number, updated: StepItem) => {
    const clone = [...actionSteps];
    clone[index] = updated;
    setActionSteps(clone);
  };

  const deleteStep = (index: number) => {
    setActionSteps(actionSteps.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {actionSteps.map((step, index) => (
        <ActionStepCard
          key={index}
          step={step}
          index={index}
          onUpdate={updateStep}
          onDelete={deleteStep}
        />
      ))}
    </div>
  );
};

// ---------------------
// STEP 3 Component
// ---------------------

interface TriggerData {
  selectedTrigger: string;
  removeOnRemove: boolean;
}

interface Step3Props {
  triggerData: TriggerData;
  setTriggerData: React.Dispatch<React.SetStateAction<TriggerData>>;
}

const Step3Content: React.FC<Step3Props> = ({
  triggerData,
  setTriggerData,
}) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTriggerData((prev) => ({
      ...prev,
      selectedTrigger: e.target.value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTriggerData((prev) => ({
      ...prev,
      removeOnRemove: e.target.checked,
    }));
  };

  const triggerOptions = [
    { value: "none", label: "None" },
    { value: "calling_list", label: "Adding a contact to Calling list" },
    { value: "group", label: "Adding a contact to Group" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Choose A Trigger</h3>

      <div className="space-y-3">
        {triggerOptions.map((option) => (
          <label key={option.value} className="flex items-center gap-3">
            <input
              type="radio"
              name="trigger"
              value={option.value}
              checked={triggerData.selectedTrigger === option.value}
              onChange={handleRadioChange}
              className="h-4 w-4 accent-black"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>

      <hr className="border-gray-200" />

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={triggerData.removeOnRemove}
          onChange={handleCheckboxChange}
          className="h-4 w-4 accent-black"
        />
        <span className="text-sm text-gray-700">
          Remove from Action Plan if contact(s) are removed from the specified
          group / calling list
        </span>
      </label>
    </div>
  );
};

// ---------------------
// STEP 4 Component
// ---------------------

interface EndLogicData {
  selectedEndLogic: string;
  assignGroup: boolean;
  selectedGroup: string;
}

interface Step4Props {
  endLogicData: EndLogicData;
  setEndLogicData: React.Dispatch<React.SetStateAction<EndLogicData>>;
}

const Step4Content: React.FC<Step4Props> = ({
  endLogicData,
  setEndLogicData,
}) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndLogicData((prev) => ({
      ...prev,
      selectedEndLogic: e.target.value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndLogicData((prev) => ({
      ...prev,
      assignGroup: e.target.checked,
    }));
  };

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndLogicData((prev) => ({
      ...prev,
      selectedGroup: e.target.value,
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">
          Choose Your End Logic
        </h3>
        <p className="text-sm text-gray-500">
          Here is where you decide what happens to a contact after all steps.
        </p>

        <label className="flex gap-3 cursor-pointer">
          <input
            type="radio"
            name="endlogic"
            value="do_nothing"
            checked={endLogicData.selectedEndLogic === "do_nothing"}
            onChange={handleRadioChange}
            className="h-4 w-4 accent-black"
          />
          <span>Do nothing</span>
        </label>

        <label className="flex gap-3 cursor-pointer">
          <input
            type="radio"
            name="endlogic"
            value="repeat"
            checked={endLogicData.selectedEndLogic === "repeat"}
            onChange={handleRadioChange}
            className="h-4 w-4 accent-black"
          />
          <span>Repeat current Action Plan</span>
        </label>

        <label className="flex gap-3 cursor-pointer">
          <input
            type="radio"
            name="endlogic"
            value="start_other"
            checked={endLogicData.selectedEndLogic === "start_other"}
            onChange={handleRadioChange}
            className="h-4 w-4 accent-black"
          />
          <span>Start another Action Plan</span>
        </label>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">Optional Group Assignment</h3>

        <label className="flex gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={endLogicData.assignGroup}
            onChange={handleCheckboxChange}
            className="h-4 w-4 accent-black"
          />
          <span>Assign Group</span>
        </label>

        {endLogicData.assignGroup && (
          <select
            value={endLogicData.selectedGroup}
            onChange={handleGroupChange}
            className="bg-gray-100 p-2 rounded-lg"
          >
            <option value="">Select Group</option>
            <option value="Dead Leads">Dead Leads</option>
            <option value="Archive">Archive</option>
          </select>
        )}
      </div>
    </div>
  );
};

// ---------------------
// MAIN COMPONENT
// ---------------------

const AdminActionPlan: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const [formData, setFormData] = useState({
    label: "",
    schedulingType: "frequency",
    schedulingLogic: "frequency",
    weekendScheduling: "frequency",
  });

  const [actionSteps, setActionSteps] = useState<StepItem[]>([
    { type: "Email", template: "Email Template #1", day: 0 },
  ]);

  const [triggerData, setTriggerData] = useState<TriggerData>({
    selectedTrigger: "none",
    removeOnRemove: false,
  });

  const [endLogicData, setEndLogicData] = useState<EndLogicData>({
    selectedEndLogic: "do_nothing",
    assignGroup: false,
    selectedGroup: "",
  });

  const steps = [
    { title: "Action Plan", content: <Step1Content formData={formData} setFormData={setFormData} /> },
    { title: "Action Steps", content: <Step2Content actionSteps={actionSteps} setActionSteps={setActionSteps} /> },
    { title: "Trigger Group", content: <Step3Content triggerData={triggerData} setTriggerData={setTriggerData} /> },
    { title: "End Logic", content: <Step4Content endLogicData={endLogicData} setEndLogicData={setEndLogicData} /> },
  ];

  const handleSave = () => {
    message.success("Action Plan Saved!");
  };

  return (
    <section className="min-h-screen pr-3 py-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Action Plan
          </h1>
          <button className="px-5 py-2 rounded-lg bg-gray-200">Cancel</button>
        </header>

        <Steps current={current} items={steps.map((x) => ({ title: x.title }))} />

        <main className="mt-8">{steps[current].content}</main>

        <footer className="flex justify-between mt-8">
          {current === 1 && (
            <button
              onClick={() =>
                setActionSteps((prev) => [
                  ...prev,
                  { type: "Email", template: "Email Template #1", day: 0 },
                ])
              }
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 border rounded"
            >
              <FiPlus /> Add Step
            </button>
          )}

          <div className="flex gap-3">
            {current > 0 && (
              <button
                onClick={() => setCurrent(current - 1)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Previous
              </button>
            )}

            {current < steps.length - 1 && (
              <button
                onClick={() => setCurrent(current + 1)}
                className="px-4 py-2 bg-yellow-400 rounded"
              >
                Next
              </button>
            )}

            {current === steps.length - 1 && (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-yellow-400 rounded"
              >
                Save
              </button>
            )}
          </div>
        </footer>
      </div>
    </section>
  );
};

export default AdminActionPlan;





























// NEW 

// import React, { useState } from "react";
// import { Steps, message } from "antd";
// import { FiHelpCircle, FiPlus, FiX } from "react-icons/fi";
// import { RxDragHandleDots2 } from "react-icons/rx";

// // ---------------- Step 1 Components ----------------
// const RadioGroup = ({ title, description, name, options, selectedValue, onChange }: any) => (
//   <div className="space-y-3">
//     <div className="flex items-center gap-2">
//       <h3 className="text-base font-semibold text-gray-900">{title}</h3>
//       <FiHelpCircle className="text-gray-400" size={18} />
//     </div>
//     {description && <p className="text-sm text-gray-500">{description}</p>}
//     <div className="space-y-2 mt-1">
//       {options.map((option: any) => (
//         <label key={option.value} className="flex items-center gap-3 cursor-pointer">
//           <input
//             type="radio"
//             name={name}
//             value={option.value}
//             checked={selectedValue === option.value}
//             onChange={(e) => onChange(e.target.value)}
//             className="h-4 w-4 accent-black"
//           />
//           <span className="text-sm text-gray-700">{option.label}</span>
//         </label>
//       ))}
//     </div>
//   </div>
// );

// const Step1Content = ({ formData, setFormData }: any) => {
//   const handleRadioChange = (name: string, value: string) =>
//     setFormData((prev: any) => ({ ...prev, [name]: value }));

//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-10">
//       <div className="bg-[#F9FAFB] border border-gray-200 p-3 rounded-lg w-full max-w-sm">
//         <label className="block text-xs text-gray-500 mb-1">Label</label>
//         <input
//           type="text"
//           value={formData.label}
//           onChange={(e) => setFormData((p: any) => ({ ...p, label: e.target.value }))}
//           className="bg-transparent w-full text-gray-900 font-medium focus:outline-none"
//         />
//       </div>
//       <RadioGroup
//         title="Select Your Scheduling Type"
//         name="schedulingType"
//         options={[
//           { label: "Frequency-Based", value: "frequency" },
//           { label: "Date-Based", value: "date" },
//         ]}
//         selectedValue={formData.schedulingType}
//         onChange={(value: string) => handleRadioChange("schedulingType", value)}
//       />
//       <RadioGroup
//         title="Select Your Scheduling Logic"
//         name="schedulingLogic"
//         options={[
//           { label: "Frequency-Based", value: "frequency" },
//           { label: "Date-Based", value: "date" },
//         ]}
//         selectedValue={formData.schedulingLogic}
//         onChange={(value: string) => handleRadioChange("schedulingLogic", value)}
//       />
//       <RadioGroup
//         title="Select Weekend Scheduling"
//         description="Do you want steps to be scheduled on weekends?"
//         name="weekendScheduling"
//         options={[
//           { label: "Frequency-Based", value: "frequency" },
//           { label: "Date-Based", value: "date" },
//         ]}
//         selectedValue={formData.weekendScheduling}
//         onChange={(value: string) => handleRadioChange("weekendScheduling", value)}
//       />
//     </div>
//   );
// };

// // ---------------- Step 2 Components ----------------
// const CustomDropdown = ({ label, options, value, onChange }: any) => (
//   <div className="w-full">
//     <label className="block text-xs text-gray-500 mb-1">{label}</label>
//     <select value={value} onChange={onChange} className="w-full bg-transparent text-gray-900 text-sm focus:outline-none border-b border-gray-300 py-1.5">
//       {options.map((opt: string) => (
//         <option key={opt} value={opt}>{opt}</option>
//       ))}
//     </select>
//   </div>
// );

// const CustomTextInput = ({ label, placeholder, value, onChange }: any) => (
//   <div className="w-full bg-gray-100/70 p-3 rounded-lg">
//     <label className="block text-xs text-gray-500 mb-1">{label}</label>
//     <input type="text" placeholder={placeholder} value={value} onChange={onChange} className="w-full bg-transparent text-gray-900 text-sm focus:outline-none" />
//   </div>
// );

// const DaySelector = ({ value, onChange }: any) => (
//   <div className="flex-shrink-0">
//     <label className="block text-xs text-gray-500 mb-1 text-center">Begin on Day</label>
//     <div className="flex items-center justify-center gap-2">
//       <button onClick={() => onChange(Math.max(0, value - 1))} className="w-6 h-6 rounded-md bg-gray-200 text-gray-700">-</button>
//       <span className="font-semibold text-gray-900 w-6 text-center text-sm">{value}</span>
//       <button onClick={() => onChange(value + 1)} className="w-6 h-6 rounded-md bg-gray-200 text-gray-700">+</button>
//     </div>
//   </div>
// );

// const ActionStepCard = ({ step, index, onUpdate, onDelete }: any) => {
//   const handleFieldChange = (field: string, value: any) => onUpdate(index, { ...step, [field]: value });
//   const actionOptions = ["Email", "Phone Call", "Task", "Letter", "Mailing Label"];
//   const templateOptions = ["Email Template #1", "Template #2"];
//   const scriptOptions = ["Script #1", "Script #2"];

//   return (
//     <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4">
//       <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
//         <div className="flex items-center gap-2 w-full md:w-auto">
//           <RxDragHandleDots2 className="text-gray-400 cursor-grab" size={20} />
//           <h3 className="font-bold text-gray-800">Step #{index + 1}</h3>
//         </div>
//         <div className="flex-grow w-full">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
//             <CustomDropdown label="Action" options={actionOptions} value={step.type} onChange={(e: any) => handleFieldChange('type', e.target.value)} />
//             {step.type === "Email" && <CustomDropdown label="Template" options={templateOptions} value={step.template} onChange={(e: any) => handleFieldChange('template', e.target.value)} />}
//             {step.type === "Phone Call" && <CustomDropdown label="Script" options={scriptOptions} value={step.script} onChange={(e: any) => handleFieldChange('script', e.target.value)} />}
//             {step.type === "Task" && <CustomTextInput label="Subject" placeholder="" value={step.subject} onChange={(e: any) => handleFieldChange('subject', e.target.value)} />}
//             {step.type === "Letter" && <CustomDropdown label="Template" options={["Letter Template #1"]} value={step.template} onChange={(e: any) => handleFieldChange('template', e.target.value)} />}
//             {step.type === "Mailing Label" && <CustomTextInput label="Title" placeholder="" value={step.title} onChange={(e: any) => handleFieldChange('title', e.target.value)} />}
//             <DaySelector value={step.day} onChange={(val: number) => handleFieldChange('day', val)} />
//           </div>
//         </div>
//         <button onClick={() => onDelete(index)} className="text-red-500 hover:text-red-700 md:ml-auto"><FiX size={22} /></button>
//       </div>
//     </div>
//   );
// };

// const Step2Content = ({ actionSteps, setActionSteps }: any) => {
//   const addStep = () => {
//     const newStep = { type: "Email", template: "Email Template #1", day: 0 };
//     setActionSteps([...actionSteps, newStep]);
//   };
//   const deleteStep = (index: number) => setActionSteps(actionSteps.filter((_: any, i: number) => i !== index));
//   const updateStep = (index: number, updatedStep: any) => {
//     const newSteps = [...actionSteps];
//     newSteps[index] = updatedStep;
//     setActionSteps(newSteps);
//   };

//   return (
//     <div className="space-y-4">
//       {actionSteps.map((step: any, index: number) => (
//         <ActionStepCard key={index} step={step} index={index} onUpdate={updateStep} onDelete={deleteStep} />
//       ))}
//     </div>
//   );
// };

// // ---------------- Step 3 Components ----------------
// const Step3Content = ({ triggerData, setTriggerData }: any) => {
//   const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) =>
//     setTriggerData((prev: any) => ({ ...prev, selectedTrigger: e.target.value }));
//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
//     setTriggerData((prev: any) => ({ ...prev, removeOnRemove: e.target.checked }));

//   const triggerOptions = [
//     { value: 'none', label: 'None' },
//     { value: 'calling_list', label: 'Adding a contact to Calling list' },
//     { value: 'group', label: 'Adding a contact to Group' },
//   ];

//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
//       <h3 className="text-lg font-bold text-gray-900">Choose A Trigger</h3>
//       <div className="space-y-3">
//         {triggerOptions.map(option => (
//           <label key={option.value} className="flex items-center gap-3 cursor-pointer">
//             <input type="radio" name="trigger" value={option.value} checked={triggerData.selectedTrigger === option.value} onChange={handleRadioChange} className="h-4 w-4 accent-black" />
//             <span className="text-sm text-gray-700">{option.label}</span>
//           </label>
//         ))}
//       </div>
//       <hr className="border-gray-200" />
//       <label className="flex items-center gap-3 cursor-pointer">
//         <input type="checkbox" checked={triggerData.removeOnRemove} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-400 accent-black" />
//         <span className="text-sm text-gray-700"> Remove from Action Plan if contact(s) are removed from the specified group / calling list </span>
//       </label>
//     </div>
//   );
// };

// // ---------------- Step 4 Components ----------------
// const Step4Content = ({ endLogicData, setEndLogicData }: any) => {
//   const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => setEndLogicData((prev: any) => ({ ...prev, selectedEndLogic: e.target.value }));
//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => setEndLogicData((prev: any) => ({ ...prev, assignGroup: e.target.checked }));
//   const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => setEndLogicData((prev: any) => ({ ...prev, selectedGroup: e.target.value }));

//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-8">
//       {/* Top Part */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-bold text-gray-900">Choose Your End Logic</h3>
//         <p className="text-sm text-gray-500 mt-1">Here is where you decide what happens to a contact when it has gone through all of your Action Plan steps.</p>
//         <div className="space-y-4">
//           <label className="flex items-start gap-3 cursor-pointer">
//             <input type="radio" name="endLogic" value="do_nothing" checked={endLogicData.selectedEndLogic === 'do_nothing'} onChange={handleRadioChange} className="h-4 w-4 mt-1 accent-black flex-shrink-0" />
//             <span className="text-sm text-gray-700 font-medium">Do nothing</span>
//           </label>
//           <label className="flex items-start gap-3 cursor-pointer">
//             <input type="radio" name="endLogic" value="repeat" checked={endLogicData.selectedEndLogic === 'repeat'} onChange={handleRadioChange} className="h-4 w-4 mt-1 accent-black flex-shrink-0" />
//             <div>
//               <span className="text-sm text-gray-700 font-medium">Repeat current Action Plan</span>
//               <p className="text-xs text-gray-500">This will repeat the current Action Plan and start on the day you choose.</p>
//             </div>
//           </label>
//           <label className="flex items-start gap-3 cursor-pointer">
//             <input type="radio" name="endLogic" value="start_other" checked={endLogicData.selectedEndLogic === 'start_other'} onChange={handleRadioChange} className="h-4 w-4 mt-1 accent-black flex-shrink-0" />
//             <div>
//               <span className="text-sm text-gray-700 font-medium">Start other Action Plan</span>
//               {endLogicData.selectedEndLogic === 'start_other' && (
//                 <p className="text-xs text-red-500">You don't have another Action Plans, create more to chose this option.</p>
//               )}
//             </div>
//           </label>
//         </div>
//       </div>

//       {/* Bottom Part */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-bold text-gray-900">Optional Group Assignment:</h3>
//         <p className="text-sm text-gray-500 mt-1">This will automatically move the assigned contact to the group of your choice when the Action Plan has ended...</p>
//         <label className="flex items-center gap-3 cursor-pointer">
//           <input type="checkbox" checked={endLogicData.assignGroup} onChange={handleCheckboxChange} className="h-4 w-4 rounded border-gray-400 accent-black" />
//           <span className="text-sm text-gray-700 font-medium">Assign Group</span>
//         </label>
//         {endLogicData.assignGroup && (
//           <div className="max-w-xs">
//             <div className="w-full bg-gray-100/70 p-3 rounded-lg">
//               <label className="block text-xs text-gray-500 mb-1">Group</label>
//               <select value={endLogicData.selectedGroup} onChange={handleGroupChange} className="w-full bg-transparent text-gray-900 text-sm focus:outline-none">
//                 <option value="">Select</option>
//                 <option value="group1">Dead Leads</option>
//                 <option value="group2">Archive</option>
//               </select>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ---------------- Main AdminActionPlan ----------------
// const AdminActionPlan = () => {
//   const [current, setCurrent] = useState(0);
//   const [formData, setFormData] = useState({ label: "Expired Property", schedulingType: "frequency", schedulingLogic: "frequency", weekendScheduling: "frequency" });
//   const [actionSteps, setActionSteps] = useState<any[]>([
//     { type: 'Email', template: 'Email Template #1', day: 0 },
//     { type: 'Phone Call', script: 'Script #1', subject: '', details: '', day: 0 },
//     { type: 'Task', subject: '', day: 0 },
//     { type: 'Letter', template: 'Letter Template #1', day: 0 },
//     { type: 'Mailing Label', title: '', day: 0 }
//   ]);
//   const [triggerData, setTriggerData] = useState({ selectedTrigger: 'none', removeOnRemove: false });
//   const [endLogicData, setEndLogicData] = useState({ selectedEndLogic: 'do_nothing', assignGroup: true, selectedGroup: '' });

//   const steps = [
//     { title: "Action Plan", content: <Step1Content formData={formData} setFormData={setFormData} /> },
//     { title: "Action Steps", content: <Step2Content actionSteps={actionSteps} setActionSteps={setActionSteps} /> },
//     { title: "Trigger Group", content: <Step3Content triggerData={triggerData} setTriggerData={setTriggerData} /> },
//     { title: "End Logic", content: <Step4Content endLogicData={endLogicData} setEndLogicData={setEndLogicData} /> },
//   ];

//   const next = () => setCurrent(current + 1);
//   const prev = () => setCurrent(current - 1);
//   const handleSave = () => { message.success('Action Plan Saved!'); };

//   return (
//     <section className=" min-h-screen pr-3 py-4 font-sans">
//       <div className="max-w-7xl mx-auto">
//         <header className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Action Plan</h1>
//           <button className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold text-sm hover:bg-gray-300">Cancel</button>
//         </header>
//         <div className="mb-8 px-4"><Steps current={current} items={steps.map(s => ({ key: s.title, title: s.title }))} /></div>
//         <main>{steps[current].content}</main>
//         <footer className="flex justify-between items-center mt-8">
//           <div>
//             {current === 1 && (
//               <button onClick={() => setActionSteps([...actionSteps, { type: "Email", template: "Email Template #1", day: 0 }])} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 font-semibold text-sm hover:bg-gray-200">
//                 <FiPlus /> Add Step
//               </button>
//             )}
//           </div>
//           <div className="flex items-center gap-3">
//             {current > 0 && <button onClick={prev} className="px-4 py-2 w-28 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300">Previous</button>}
//             {current < steps.length - 1 && <button onClick={next} className="px-4 py-2 w-28 rounded-lg bg-yellow-400 text-gray-950 font-medium hover:bg-yellow-500">Next</button>}
//             {current === steps.length - 1 && <button onClick={handleSave} className="px-4 py-2 w-28 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-500">Save</button>}
//           </div>
//         </footer>
//       </div>
//     </section>
//   );
// };

// export default AdminActionPlan;
