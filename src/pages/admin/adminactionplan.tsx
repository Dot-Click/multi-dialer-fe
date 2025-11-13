// import React, { useState } from 'react';
// import { FaCheck, FaPlus, FaMinus, FaTimes, FaQuestionCircle } from 'react-icons/fa';

// // --- Reusable UI Components ---

// // Custom styled Input Field for this form
// const InputField = ({ label, placeholder, value }) => (
//     <div className='bg-gray-100 rounded-lg px-4 py-2 w-full'>
//         <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
//         <input
//             type="text"
//             placeholder={placeholder}
//             defaultValue={value}
//             className="w-full bg-transparent text-sm font-semibold text-gray-800 focus:outline-none"
//         />
//     </div>
// );

// // Custom styled Select Field for Step 2
// const SelectField = ({ children, className }) => (
//     <div className={`relative w-full ${className}`}>
//         <select className="w-full bg-transparent text-sm text-gray-800 appearance-none focus:outline-none cursor-pointer">
//             {children}
//         </select>
//         <svg className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
//     </div>
// );


// // --- Stepper Component ---
// const Stepper = ({ currentStep }) => {
//     const steps = ["Action Plan", "Action Steps", "Trigger Group", "End Logic"];

//     const getStepClass = (stepIndex) => {
//         if (stepIndex < currentStep) return 'completed';
//         if (stepIndex === currentStep) return 'current';
//         return 'upcoming';
//     };

//     return (
//         <div className="flex items-center justify-between w-full max-w-6xl mx-auto mb-10">
//             {steps.map((label, index) => {
//                 const stepState = getStepClass(index + 1);
//                 return (
//                     <React.Fragment key={index}>
//                         <div className="flex flex-col items-center text-center">
//                             <div className={`
//                                 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
//                                 ${stepState === 'completed' ? 'bg-yellow-400 text-white' : ''}
//                                 ${stepState === 'current' ? 'bg-yellow-400 text-white' : ''}
//                                 ${stepState === 'upcoming' ? 'bg-gray-200 text-gray-500' : ''}
//                             `}>
//                                 {stepState === 'completed' ? <FaCheck /> : index + 1}
//                             </div>
//                             <p className={`mt-2 text-xs font-semibold ${stepState === 'upcoming' ? 'text-gray-500' : 'text-gray-800'}`}>{label}</p>
//                         </div>
//                         {index < steps.length - 1 && (
//                             <div className={`flex-1 h-0.5 mx-4 ${stepState === 'completed' || stepState === 'current' ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
//                         )}
//                     </React.Fragment>
//                 );
//             })}
//         </div>
//     );
// };


// // --- Step 1 Component ---
// const Step1ActionPlan = () => {
//     const [schedulingType, setSchedulingType] = useState('Frequency-Based');
//     const [schedulingLogic, setSchedulingLogic] = useState('Frequency-Based');
//     const [weekendScheduling, setWeekendScheduling] = useState('Frequency-Based');
    
//     return (
//         <div className="bg-white rounded-2xl shadow-lg px-4 py-5 space-y-8 max-w-7xl mx-auto">
//             <div className='w-[50%]'>
//              <InputField label="Label" value="Expired Property" />
//              </div>
//              {/* Scheduling Type */}
//              <div className="space-y-3">
//                 <div className="flex items-center gap-2">
//                     <h3 className="font-semibold text-gray-800">Select Your Scheduling Type</h3>
//                     <FaQuestionCircle className="text-gray-400" />
//                 </div>
//                 <div className="flex flex-col gap-2">
//                     <label className="flex items-center gap-3"><input type="radio" name="schedulingType" value="Frequency-Based" checked={schedulingType === 'Frequency-Based'} onChange={(e) => setSchedulingType(e.target.value)} className="accent-black h-4 w-4" /> Frequency-Based</label>
//                     <label className="flex items-center gap-3"><input type="radio" name="schedulingType" value="Date-Based" checked={schedulingType === 'Date-Based'} onChange={(e) => setSchedulingType(e.target.value)} className="accent-black h-4 w-4" /> Date-Based</label>
//                 </div>
//              </div>

//             {/* Scheduling Logic */}
//              <div className="space-y-3">
//                 <div className="flex items-center gap-2">
//                     <h3 className="font-semibold text-gray-800">Select Your Scheduling Logic</h3>
//                     <FaQuestionCircle className="text-gray-400" />
//                 </div>
//                 <div className="flex flex-col gap-2">
//                     <label className="flex items-center gap-3"><input type="radio" name="schedulingLogic" value="Frequency-Based" checked={schedulingLogic === 'Frequency-Based'} onChange={(e) => setSchedulingLogic(e.target.value)} className="accent-black h-4 w-4" /> Frequency-Based</label>
//                     <label className="flex items-center gap-3"><input type="radio" name="schedulingLogic" value="Date-Based" checked={schedulingLogic === 'Date-Based'} onChange={(e) => setSchedulingLogic(e.target.value)} className="accent-black h-4 w-4" /> Date-Based</label>
//                 </div>
//              </div>

//              {/* Weekend Scheduling */}
//              <div className="space-y-3">
//                 <h3 className="font-semibold text-gray-800">Select Weekend Scheduling</h3>
//                 <p className="text-sm text-gray-500">Do you want steps to be scheduled on weekends?</p>
//                 <div className="flex flex-col gap-2">
//                     <label className="flex items-center gap-3"><input type="radio" name="weekendScheduling" value="Frequency-Based" checked={weekendScheduling === 'Frequency-Based'} onChange={(e) => setWeekendScheduling(e.target.value)} className="accent-black h-4 w-4" /> Frequency-Based</label>
//                     <label className="flex items-center gap-3"><input type="radio" name="weekendScheduling" value="Date-Based" checked={weekendScheduling === 'Date-Based'} onChange={(e) => setWeekendScheduling(e.target.value)} className="accent-black h-4 w-4" /> Date-Based</label>
//                 </div>
//              </div>
//         </div>
//     );
// }

// // --- Step 2 Component ---
// const Step2ActionSteps = () => {
//     // This state would typically come from an API or be managed by a state management library
//     const [steps, setSteps] = useState([
//         { id: 1, action: 'Email', template: 'Email Template #1', day: 0 },
//         { id: 2, action: 'Phone Call', script: 'Script #1', subject: 'Enter text here...', details: 'Enter text here...', day: 0 },
//         { id: 3, action: 'Task', subject: 'Enter text here...', day: 0 },
//         { id: 4, action: 'Letter', template: 'Letter Template #1', day: 0 },
//         { id: 5, action: 'Mailing Label', title: 'Enter text here...', day: 0 },
//     ]);

//     const addStep = () => {
//         // Add a new blank step
//         const newStep = { id: steps.length + 1, action: 'Email', template: 'Select Template', day: 0 };
//         setSteps([...steps, newStep]);
//     };

//     const removeStep = (id) => {
//         setSteps(steps.filter(step => step.id !== id));
//     };

//     return (
//         <div className="space-y-4 max-w-7xl mx-auto">
//             {steps.map((step, index) => (
//                 <div key={step.id} className="bg-white p-4 rounded-xl shadow-lg flex flex-wrap items-center gap-4">
//                     <div className="flex items-center gap-4">
//                         <FaMinus className="text-gray-400 cursor-pointer" />
//                         <span className="font-bold text-gray-800">Step #{index + 1}</span>
//                     </div>
                    
//                     <div className="flex-grow grid grid-cols-1 bg-red-500 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
//                         {/* Action Field */}
//                         <div className="border-b pb-1"><label className="text-xs text-gray-500">Action</label><SelectField><option>{step.action}</option></SelectField></div>

//                         {/* Conditional Fields */}
//                         {step.action === 'Email' && <div className="border-b pb-1"><label className="text-xs text-gray-500">Template</label><SelectField><option>{step.template}</option></SelectField></div>}
//                         {step.action === 'Phone Call' && <div className="border-b pb-1"><label className="text-xs text-gray-500">Script</label><SelectField><option>{step.script}</option></SelectField></div>}
//                         {step.action === 'Task' && <div className="border-b pb-1"><label className="text-xs text-gray-500">Subject</label><input type="text" defaultValue={step.subject} className="w-full focus:outline-none"/></div>}
//                         {step.action === 'Letter' && <div className="border-b pb-1"><label className="text-xs text-gray-500">Template</label><SelectField><option>{step.template}</option></SelectField></div>}
//                         {step.action === 'Mailing Label' && <div className="border-b pb-1"><label className="text-xs text-gray-500">Title</label><input type="text" defaultValue={step.title} className="w-full focus:outline-none"/></div>}
                        
//                         {step.action === 'Phone Call' && <div className="border-b pb-1 col-span-1 lg:col-span-2"><label className="text-xs text-gray-500">Details</label><input type="text" defaultValue={step.details} className="w-full focus:outline-none"/></div>}

//                     </div>
                    
//                     {/* Begin on Day */}
//                     <div className="flex items-center gap-2">
//                         <label className="text-xs text-gray-500 whitespace-nowrap">Begin on Day</label>
//                         <div className="flex items-center gap-2 border-b pb-1">
//                             <FaMinus className="cursor-pointer text-gray-500" />
//                             <span className="font-semibold">{step.day}</span>
//                             <FaPlus className="cursor-pointer text-gray-500" />
//                         </div>
//                     </div>
                    
//                     <FaTimes className="text-red-500 cursor-pointer" onClick={() => removeStep(step.id)} />
//                 </div>
//             ))}
            
//             <button onClick={addStep} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
//                 <FaPlus size={12} />
//                 <span className="text-sm font-medium">Add Step</span>
//             </button>
//         </div>
//     );
// };


// // --- Step 3 Component ---
// const Step3TriggerGroup = () => {
//     const [trigger, setTrigger] = useState('None');
//     return (
//         <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6 max-w-2xl mx-auto">
//             <h3 className="text-lg font-bold text-gray-800">Choose A Trigger</h3>
//             <div className="flex flex-col gap-4">
//                 <label className="flex items-center gap-3"><input type="radio" name="trigger" value="None" checked={trigger === 'None'} onChange={(e) => setTrigger(e.target.value)} className="accent-black h-4 w-4" /> None</label>
//                 <label className="flex items-center gap-3"><input type="radio" name="trigger" value="Calling List" checked={trigger === 'Calling List'} onChange={(e) => setTrigger(e.target.value)} className="accent-black h-4 w-4" /> Adding a contact to Calling list</label>
//                 <label className="flex items-center gap-3"><input type="radio" name="trigger" value="Group" checked={trigger === 'Group'} onChange={(e) => setTrigger(e.target.value)} className="accent-black h-4 w-4" /> Adding a contact to Group</label>
//             </div>
//             <div className="flex items-center gap-3 pt-4 border-t mt-4">
//                 <input type="checkbox" className="h-4 w-4 rounded accent-black" />
//                 <label className="text-sm text-gray-700">Remove from Action Plan if contact(s) are removed from the specified group / calling list</label>
//             </div>
//         </div>
//     );
// };

// // --- Main Parent Component ---
// const AdminActionPlan = () => {
//     const [currentStep, setCurrentStep] = useState(1);

//     const handleNext = () => {
//         if (currentStep < 4) {
//             setCurrentStep(currentStep + 1);
//         }
//     };

//     const handlePrevious = () => {
//         if (currentStep > 1) {
//             setCurrentStep(currentStep - 1);
//         }
//     };

//     const renderStepContent = () => {
//         switch (currentStep) {
//             case 1:
//                 return <Step1ActionPlan />;
//             case 2:
//                 return <Step2ActionSteps />;
//             case 3:
//                 return <Step3TriggerGroup />;
//             // case 4: return <Step4EndLogic />; // Jab aap step 4 bhejenge, toh yahan add hoga
//             default:
//                 return <Step1ActionPlan />;
//         }
//     };

//     return (
//         <div className=" min-h-screen px-4 py-5">
//             <div className="max-w-7xl mx-auto">
//                 {/* Header */}
//                 <div className="flex justify-between items-center mb-4">
//                     <h1 className="text-3xl font-semibold text-gray-900">Action Plan</h1>
//                     <button className="px-5 py-2 text-sm font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300">
//                         Cancel
//                     </button>
//                 </div>
                
//                 {/* Stepper */}
//                 <Stepper currentStep={currentStep} />
                
//                 {/* Step Content */}
//                 <div className="mt-10">
//                     {renderStepContent()}
//                 </div>
                
//                 {/* Navigation Buttons */}
//                 <div className="flex justify-end items-center gap-4 mt-10 max-w-7xl mx-auto">
//                     {currentStep > 1 && (
//                          <button onClick={handlePrevious} className="px-6 py-2.5 text-sm font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300">
//                             Previous
//                         </button>
//                     )}
//                     <button onClick={handleNext} className="px-8 py-2.5 text-sm font-semibold text-gray-950 bg-[#FFCA06] rounded-md hover:bg-[#FFCA06]">
//                         {currentStep === 4 ? 'Finish' : 'Next'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminActionPlan;




import React, { useState } from 'react';
import type { ReactNode } from "react";

import { FaCheck, FaPlus, FaMinus, FaTimes, FaQuestionCircle } from 'react-icons/fa';

// --- Types ---
interface InputFieldProps {
  label: string;
  placeholder?: string;
  value?: string;
}

interface SelectFieldProps {
  children: ReactNode;
  className?: string;
}

interface StepperProps {
  currentStep: number;
}

// --- Reusable UI Components ---
// Custom styled Input Field
const InputField: React.FC<InputFieldProps> = ({ label, placeholder, value }) => (
  <div className="bg-gray-100 rounded-lg px-4 py-2 w-full">
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={value}
      className="w-full bg-transparent text-sm font-semibold text-gray-800 focus:outline-none"
    />
  </div>
);

// Custom styled Select Field
const SelectField: React.FC<SelectFieldProps> = ({ children, className }) => (
  <div className={`relative w-full ${className || ''}`}>
    <select className="w-full bg-transparent text-sm text-gray-800 appearance-none focus:outline-none cursor-pointer">
      {children}
    </select>
    <svg
      className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);

// --- Stepper Component ---
const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const steps = ['Action Plan', 'Action Steps', 'Trigger Group', 'End Logic'];

  const getStepClass = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="flex items-center justify-between w-full max-w-6xl mx-auto mb-10">
      {steps.map((label, index) => {
        const stepState = getStepClass(index + 1);
        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${stepState === 'completed' ? 'bg-yellow-400 text-white' : ''}
                  ${stepState === 'current' ? 'bg-yellow-400 text-white' : ''}
                  ${stepState === 'upcoming' ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {stepState === 'completed' ? <FaCheck /> : index + 1}
              </div>
              <p
                className={`mt-2 text-xs font-semibold ${
                  stepState === 'upcoming' ? 'text-gray-500' : 'text-gray-800'
                }`}
              >
                {label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 ${
                  stepState === 'completed' || stepState === 'current'
                    ? 'bg-yellow-400'
                    : 'bg-gray-200'
                }`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// --- Step 1 Component ---
const Step1ActionPlan: React.FC = () => {
  const [schedulingType, setSchedulingType] = useState('Frequency-Based');

  return (
    <div className="bg-white rounded-2xl shadow-lg px-4 py-5 space-y-8 max-w-7xl mx-auto">
      <div className="w-[50%]">
        <InputField label="Label" placeholder="Enter name" value="Expired Property" />
      </div>

      {/* Scheduling Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800">Select Your Scheduling Type</h3>
          <FaQuestionCircle className="text-gray-400" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="schedulingType"
              value="Frequency-Based"
              checked={schedulingType === 'Frequency-Based'}
              onChange={(e) => setSchedulingType(e.target.value)}
              className="accent-black h-4 w-4"
            />{' '}
            Frequency-Based
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="schedulingType"
              value="Date-Based"
              checked={schedulingType === 'Date-Based'}
              onChange={(e) => setSchedulingType(e.target.value)}
              className="accent-black h-4 w-4"
            />{' '}
            Date-Based
          </label>
        </div>
      </div>
    </div>
  );
};

// --- Step 2 Component ---
interface Step {
  id: number;
  action: string;
  template?: string;
  script?: string;
  subject?: string;
  title?: string;
  details?: string;
  day: number;
}

const Step2ActionSteps: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, action: 'Email', template: 'Email Template #1', day: 0 },
  ]);

  const addStep = () => {
    const newStep: Step = {
      id: steps.length + 1,
      action: 'Email',
      template: 'Select Template',
      day: 0,
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (id: number) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className="bg-white p-4 rounded-xl shadow-lg flex flex-wrap items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <FaMinus className="text-gray-400 cursor-pointer" />
            <span className="font-bold text-gray-800">Step #{index + 1}</span>
          </div>

          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="border-b pb-1">
              <label className="text-xs text-gray-500">Action</label>
              <SelectField>
                <option>{step.action}</option>
              </SelectField>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 whitespace-nowrap">Begin on Day</label>
            <div className="flex items-center gap-2 border-b pb-1">
              <FaMinus className="cursor-pointer text-gray-500" />
              <span className="font-semibold">{step.day}</span>
              <FaPlus className="cursor-pointer text-gray-500" />
            </div>
          </div>

          <FaTimes
            className="text-red-500 cursor-pointer"
            onClick={() => removeStep(step.id)}
          />
        </div>
      ))}

      <button
        onClick={addStep}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
      >
        <FaPlus size={12} />
        <span className="text-sm font-medium">Add Step</span>
      </button>
    </div>
  );
};

// --- Main Component ---
const AdminActionPlan: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen px-4 py-5">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-semibold text-gray-900">Action Plan</h1>
          <button className="px-5 py-2 text-sm font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300">
            Cancel
          </button>
        </div>

        <Stepper currentStep={currentStep} />

        <div className="mt-10">
          {currentStep === 1 && <Step1ActionPlan />}
          {currentStep === 2 && <Step2ActionSteps />}
        </div>

        {/* Navigation */}
        <div className="flex justify-end items-center gap-4 mt-10 max-w-7xl mx-auto">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-2.5 text-sm font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Previous
            </button>
          )}
          <button
            onClick={handleNext}
            className="px-8 py-2.5 text-sm font-semibold text-gray-950 bg-[#FFCA06] rounded-md hover:bg-[#f1c00b]"
          >
            {currentStep === 4 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminActionPlan;
