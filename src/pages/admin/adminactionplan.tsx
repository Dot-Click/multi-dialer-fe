import React, { useState, useEffect } from "react";
import { Steps, message, ConfigProvider } from "antd";
import { FiHelpCircle, FiPlus, FiX } from "react-icons/fi";
import { RxDragHandleDots2 } from "react-icons/rx";
import { useEmailTemplate } from "../../hooks/useEmailTemplate";
import { useScript } from "../../hooks/useScript";
import { useContact } from "../../hooks/useContact";
import { useActionPlans } from "../../hooks/useSystemSettings";
import { useNavigate } from "react-router-dom";


// ---------------- Step 1 Components ----------------
const RadioGroup = ({ title, description, name, options, selectedValue, onChange }: any) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <FiHelpCircle className="text-gray-400" size={18} />
    </div>
    {description && <p className="text-sm text-gray-500">{description}</p>}
    <div className="space-y-2 mt-1">
      {options.map((option: any) => (
        <label key={option.value} className="flex items-center gap-3 cursor-pointer">
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

const Step1Content = ({ formData, setFormData }: any) => {
  const handleRadioChange = (name: string, value: string) =>
    setFormData((prev: any) => ({ ...prev, [name]: value }));

  return (
    <div className="bg-white font-inter rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-10">
      <div className="bg-[#F9FAFB] border border-gray-200 p-3 rounded-lg w-full max-w-sm">
        <label className="block text-xs text-gray-500 mb-1">Label</label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData((p: any) => ({ ...p, label: e.target.value }))}
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
        onChange={(value: string) => handleRadioChange("schedulingType", value)}
      />

      <RadioGroup
        title="Select Your Scheduling Logic"
        name="schedulingLogic"
        options={[
          { label: "Frequency-Based", value: "frequency" },
          { label: "Date-Based", value: "date" },
        ]}
        selectedValue={formData.schedulingLogic}
        onChange={(value: string) => handleRadioChange("schedulingLogic", value)}
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
        onChange={(value: string) => handleRadioChange("weekendScheduling", value)}
      />
    </div>
  );
};


// ---------------- Step 2 Components ----------------
const CustomDropdown = ({ label, options, value, onChange }: any) => (
  <div className="w-full">
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-transparent text-gray-900 text-sm focus:outline-none border-b border-gray-300 py-1.5"
    >
      <option value="">Select {label}</option>
      {options.map((opt: any) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const lab = typeof opt === 'string' ? opt : opt.label;
        return <option key={val} value={val}>{lab}</option>;
      })}
    </select>
  </div>
);

const CustomTextInput = ({ label, placeholder, value, onChange }: any) => (
  <div className="w-full bg-gray-100/70 p-3 rounded-lg">
    <label className="block text-xs text-gray-500 mb-1">{label}</label>
    <input type="text" placeholder={placeholder} value={value} onChange={onChange} className="w-full bg-transparent text-gray-900 text-sm focus:outline-none" />
  </div>
);

const DaySelector = ({ value, onChange }: any) => (
  <div className="flex-shrink-0">
    <label className="block text-xs text-gray-500 mb-1 text-center">Begin on Day</label>
    <div className="flex items-center justify-center gap-2">
      <button onClick={() => onChange(Math.max(0, value - 1))} className="w-6 h-6 rounded-md bg-gray-200 text-gray-700">-</button>
      <span className="font-semibold text-gray-900 w-6 text-center text-sm">{value}</span>
      <button onClick={() => onChange(value + 1)} className="w-6 h-6 rounded-md bg-gray-200 text-gray-700">+</button>
    </div>
  </div>
);

const ActionStepCard = ({ step, index, onUpdate, onDelete, emailTemplates, scripts }: any) => {
  const handleFieldChange = (field: string, value: any) => onUpdate(index, { ...step, [field]: value });

  const actionOptions = ["Email", "Phone Call", "Task", "Letter", "Mailing Label"];
  const templateOptions = (emailTemplates || []).map((t: any) => ({ label: t.templateName, value: t.id }));
  const scriptOptions = (scripts || []).map((s: any) => ({ label: s.scriptName, value: s.id }));

  return (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <RxDragHandleDots2 className="text-gray-400 cursor-grab" size={20} />
          <h3 className="font-bold text-gray-800">Step #{index + 1}</h3>
        </div>

        <div className="flex-grow w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">

            <CustomDropdown label="Action" options={actionOptions} value={step.type} onChange={(e: any) => handleFieldChange('type', e.target.value)} />

            {step.type === "Email" && (
              <CustomDropdown label="Template" options={templateOptions} value={step.template} onChange={(e: any) => handleFieldChange('template', e.target.value)} />
            )}

            {step.type === "Phone Call" && (
              <CustomDropdown label="Script" options={scriptOptions} value={step.script} onChange={(e: any) => handleFieldChange('script', e.target.value)} />
            )}

            {step.type === "Task" && (
              <CustomTextInput label="Subject" value={step.subject} onChange={(e: any) => handleFieldChange('subject', e.target.value)} />
            )}

            {step.type === "Letter" && (
              <CustomDropdown label="Template" options={["Letter Template #1"]} value={step.template} onChange={(e: any) => handleFieldChange('template', e.target.value)} />
            )}

            {step.type === "Mailing Label" && (
              <CustomTextInput label="Title" value={step.title} onChange={(e: any) => handleFieldChange('title', e.target.value)} />
            )}

            <DaySelector value={step.day} onChange={(val: number) => handleFieldChange('day', val)} />

          </div>
        </div>

        <button onClick={() => onDelete(index)} className="text-red-500 hover:text-red-700 md:ml-auto">
          <FiX size={22} />
        </button>
      </div>
    </div>
  );
};


const Step2Content = ({ actionSteps, setActionSteps, emailTemplates, scripts }: any) => {
  const deleteStep = (index: number) =>
    setActionSteps(actionSteps.filter((_: any, i: number) => i !== index));

  const updateStep = (index: number, updatedStep: any) => {
    const newSteps = [...actionSteps];
    newSteps[index] = updatedStep;
    setActionSteps(newSteps);
  };

  return (
    <div className="space-y-4">
      {actionSteps.map((step: any, index: number) => (
        <ActionStepCard
          key={index}
          step={step}
          index={index}
          onUpdate={updateStep}
          onDelete={deleteStep}
          emailTemplates={emailTemplates}
          scripts={scripts}
        />
      ))}
    </div>
  );
};


// ---------------- Step 3 Components ----------------
const Step3Content = ({ triggerData, setTriggerData, groups, lists }: any) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTriggerData((prev: any) => ({ ...prev, selectedTrigger: e.target.value, triggerSourceId: '' }));

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTriggerData((prev: any) => ({ ...prev, removeOnRemove: e.target.checked }));

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setTriggerData((prev: any) => ({ ...prev, triggerSourceId: e.target.value }));

  const triggerOptions = [
    { value: 'none', label: 'None' },
    { value: 'calling_list', label: 'Adding a contact to Calling list' },
    { value: 'group', label: 'Adding a contact to Group' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
      <h3 className="text-lg font-bold text-gray-900">Choose A Trigger</h3>

      <div className="space-y-3">
        {triggerOptions.map(option => (
          <div key={option.value} className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
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

            {triggerData.selectedTrigger === 'group' && option.value === 'group' && (
              <div className="ml-7 max-w-xs">
                <div className="w-full bg-gray-100/70 p-3 rounded-lg">
                  <label className="block text-xs text-gray-500 mb-1">Select Group</label>
                  <select
                    value={triggerData.triggerSourceId || ''}
                    onChange={handleSourceChange}
                    className="w-full bg-transparent text-gray-900 text-sm focus:outline-none"
                  >
                    <option value="">Select Group</option>
                    {(groups || []).map((group: any) => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {triggerData.selectedTrigger === 'calling_list' && option.value === 'calling_list' && (
              <div className="ml-7 max-w-xs">
                <div className="w-full bg-gray-100/70 p-3 rounded-lg">
                  <label className="block text-xs text-gray-500 mb-1">Select List</label>
                  <select
                    value={triggerData.triggerSourceId || ''}
                    onChange={handleSourceChange}
                    className="w-full bg-transparent text-gray-900 text-sm focus:outline-none"
                  >
                    <option value="">Select List</option>
                    {(lists || []).map((list: any) => (
                      <option key={list.id} value={list.id}>{list.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <hr className="border-gray-200" />

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={triggerData.removeOnRemove}
          onChange={handleCheckboxChange}
          className="h-4 w-4 rounded border-gray-400 accent-black"
        />
        <span className="text-sm text-gray-700">
          Remove from Action Plan if contact(s) are removed from the specified group / calling list
        </span>
      </label>
    </div>
  );
};


// ---------------- Step 4 Components ----------------
const Step4Content = ({ endLogicData, setEndLogicData, groups, actionPlans }: any) => {
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEndLogicData((prev: any) => ({ ...prev, selectedEndLogic: e.target.value }));

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEndLogicData((prev: any) => ({ ...prev, assignGroup: e.target.checked }));

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setEndLogicData((prev: any) => ({ ...prev, selectedGroup: e.target.value }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-8">

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Choose Your End Logic</h3>
        <p className="text-sm text-gray-500 mt-1">
          Here is where you decide what happens to a contact when it has gone through all of your Action Plan steps.
        </p>

        <div className="space-y-4">

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="endLogic"
              value="do_nothing"
              checked={endLogicData.selectedEndLogic === 'do_nothing'}
              onChange={handleRadioChange}
              className="h-4 w-4 mt-1 accent-black flex-shrink-0"
            />
            <span className="text-sm text-gray-700 font-medium">Do nothing</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="endLogic"
              value="repeat_plan"
              checked={endLogicData.selectedEndLogic === 'repeat_plan'}
              onChange={handleRadioChange}
              className="h-4 w-4 mt-1 accent-black flex-shrink-0"
            />
            <div>
              <span className="text-sm text-gray-700 font-medium">Repeat current Action Plan</span>
              <p className="text-xs text-gray-500">
                This will repeat the current Action Plan and start on the day you choose.
              </p>
              {endLogicData.selectedEndLogic === 'repeat_plan' && (
                <div className="mt-2 max-w-xs flex items-center gap-2">
                  <span className="text-xs text-gray-500">Start on Day:</span>
                  <input
                    type="number"
                    value={endLogicData.repeatDay || '1'}
                    onChange={(e) => setEndLogicData((prev: any) => ({ ...prev, repeatDay: e.target.value }))}
                    className="w-20 bg-gray-100/70 p-2 rounded-lg text-gray-900 text-sm focus:outline-none"
                    min="1"
                  />
                </div>
              )}
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="endLogic"
              value="start_other_plan"
              checked={endLogicData.selectedEndLogic === 'start_other_plan'}
              onChange={handleRadioChange}
              className="h-4 w-4 mt-1 accent-black flex-shrink-0"
            />
            <div className="grow">
              <span className="text-sm text-gray-700 font-medium">Start Other Action Plan</span>
              {(actionPlans?.length || 0) === 0 ? (
                <p className="text-xs text-black font-inter font-medium mt-1">
                  You don’t have another Action Plans, create more to chose this option.
                </p>
              ) : (
                <div className="mt-2 max-w-xs">
                  <select
                    disabled={endLogicData.selectedEndLogic !== 'start_other_plan'}
                    value={endLogicData.selectedOtherPlan || ''}
                    onChange={(e) => setEndLogicData((prev: any) => ({ ...prev, selectedOtherPlan: e.target.value }))}
                    className="w-full bg-gray-100/70 p-3 rounded-lg text-gray-900 text-sm focus:outline-none"
                  >
                    <option value="">Select Action Plan</option>
                    {(actionPlans || []).map((plan: any) => (
                      <option key={plan.id} value={plan.id}>{plan.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </label>

        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Optional Group Assignment:</h3>
        <p className="text-sm text-gray-500 mt-1">
          This will automatically move the assigned contact to the group of your choice when the Action Plan has ended. This is popular with Dead Lead and Archive groups. If designated group is also a trigger group, it will assign the appropriate action plan.
        </p>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={endLogicData.assignGroup}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-gray-400 accent-black"
          />
          <span className="text-sm text-gray-700 font-medium">Assign Group</span>
        </label>

        {endLogicData.assignGroup && (
          <div className="max-w-xs">
            <div className="w-full bg-gray-100/70 p-3 rounded-lg">
              <label className="block text-xs text-gray-500 mb-1">Group</label>
              <select
                value={endLogicData.selectedGroup}
                onChange={handleGroupChange}
                className="w-full bg-transparent text-gray-900 text-sm focus:outline-none"
              >
                <option value="">Select Group</option>
                {(groups || []).map((group: any) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// ---------------- Main AdminActionPlan ----------------
const AdminActionPlan = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const { getEmailTemplates } = useEmailTemplate();
  const { getScripts } = useScript();
  const { getContactGroups, getContactLists } = useContact();
  const { data: allActionPlans, createActionPlan } = useActionPlans();
  const isSaving = createActionPlan.isPending;

  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [scripts, setScripts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [contactLists, setContactLists] = useState<any[]>([]);

  useEffect(() => {
    const fetchOptions = async () => {
      const [templates, scriptsData, groupsData, listsData] = await Promise.all([
        getEmailTemplates(),
        getScripts(),
        getContactGroups(),
        getContactLists()
      ]);
      setEmailTemplates(templates);
      setScripts(scriptsData);
      setGroups(groupsData);
      setContactLists(listsData);
    };
    fetchOptions();
  }, []);

  const [formData, setFormData] = useState({
    label: "Expired Property",
    schedulingType: "frequency",
    schedulingLogic: "frequency",
    weekendScheduling: "frequency"
  });

  const [actionSteps, setActionSteps] = useState<any[]>([
    { type: 'Email', template: '', day: 0 },
    { type: 'Phone Call', script: '', subject: '', details: '', day: 0 },
    { type: 'Task', subject: '', day: 0 },
    { type: 'Letter', template: '', day: 0 },
    { type: 'Mailing Label', title: '', day: 0 }
  ]);

  const [triggerData, setTriggerData] = useState({
    selectedTrigger: 'none',
    triggerSourceId: '',
    removeOnRemove: false
  });

  const [endLogicData, setEndLogicData] = useState({
    selectedEndLogic: 'do_nothing',
    assignGroup: true,
    selectedGroup: '',
    selectedOtherPlan: '',
    repeatDay: '1'
  });

  const steps = [
    { title: "Action Plan", content: <Step1Content formData={formData} setFormData={setFormData} /> },
    { title: "Action Steps", content: <Step2Content actionSteps={actionSteps} setActionSteps={setActionSteps} emailTemplates={emailTemplates} scripts={scripts} /> },
    { title: "Trigger Group", content: <Step3Content triggerData={triggerData} setTriggerData={setTriggerData} groups={groups} lists={contactLists} /> },
    { title: "End Logic", content: <Step4Content endLogicData={endLogicData} setEndLogicData={setEndLogicData} groups={groups} actionPlans={allActionPlans} /> },
  ];

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  const handleSave = async () => {
    try {
      if (!formData.label) {
        message.error("Please enter a label for the Action Plan");
        return;
      }

      const payload: any = {
        name: formData.label,
        schedulingType: formData.schedulingType === 'frequency' ? 'FREQUENCY_BASED' : 'DATE_BASED',
        schedulingLogic: formData.schedulingLogic === 'frequency' ? 'FREQUENCY_BASED' : 'DATE_BASED',
        weekendScheduling: formData.weekendScheduling === 'frequency' ? 'FREQUENCY_BASED' : 'DATE_BASED',
        triggerType: triggerData.selectedTrigger === 'none' ? 'NONE' : (triggerData.selectedTrigger === 'calling_list' ? 'CALLING_LIST' : 'GROUP'),
        triggerSourceId: triggerData.triggerSourceId || null,
        removeOnTriggerExit: triggerData.removeOnRemove,
        endLogic: endLogicData.selectedEndLogic === 'do_nothing' ? 'DO_NOTHING' : (endLogicData.selectedEndLogic === 'repeat_plan' ? 'REPEAT_PLAN' : 'START_OTHER_PLAN'),
        nextPlanId: endLogicData.selectedEndLogic === 'start_other_plan' ? endLogicData.selectedOtherPlan : null,
        endLogicValue: endLogicData.selectedEndLogic === 'repeat_plan' ? (endLogicData.repeatDay || '1') : null,
        assignGroupEnabled: endLogicData.assignGroup,
        assignGroupId: endLogicData.selectedGroup || null,
        steps: actionSteps.map((step, index) => {
          let contentValue = "";
          if (step.type === 'Email') contentValue = step.template;
          else if (step.type === 'Phone Call') contentValue = step.script;
          else if (step.type === 'Task') contentValue = step.subject;
          else if (step.type === 'Letter') contentValue = step.template;
          else if (step.type === 'Mailing Label') contentValue = step.title;

          return {
            order: index + 1,
            actionType: step.type === 'Phone Call' ? 'PHONE_CALL' : (step.type === 'Mailing Label' ? 'MAILING_LABEL' : step.type.toUpperCase()),
            contentValue,
            dayOffset: step.day || 0
          };
        })
      };

      await createActionPlan.mutateAsync(payload);
      message.success('Action Plan Saved!');
      navigate("/admin/system-settings"); // Go back to settings
    } catch (error: any) {
      message.error(error.response?.data?.message || error.message || "Failed to save action plan");
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#facc15',
        },
        components: {
          Steps: {
            colorText: "#000",
          },
        },
      }}
    >
      <section className="min-h-screen pr-3 py-4 font-sans">

        <div className="max-w-7xl mx-auto">

          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Action Plan</h1>
            <button onClick={() => navigate(-1)} className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold text-sm hover:bg-gray-300">
              Cancel
            </button>
          </header>

          <div className="mb-8 px-4">
            <Steps current={current} items={steps.map(s => ({ key: s.title, title: s.title }))} />
          </div>

          <main>{steps[current].content}</main>

          <footer className="flex justify-between items-center mt-8">

            <div>
              {current === 1 && (
                <button
                  onClick={() =>
                    setActionSteps([
                      ...actionSteps,
                      { type: "Email", template: "", day: 0 }
                    ])
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 font-semibold text-sm hover:bg-gray-200"
                >
                  <FiPlus /> Add Step
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {current > 0 && (
                <button
                  onClick={prev}
                  className="px-4 py-2 w-28 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300"
                >
                  Previous
                </button>
              )}

              {current < steps.length - 1 && (
                <button
                  onClick={next}
                  className="px-4 py-2 w-28 rounded-lg bg-yellow-400 text-gray-950 font-medium hover:bg-yellow-500"
                >
                  Next
                </button>
              )}

              {current === steps.length - 1 && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 w-28 rounded-lg bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-500 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>

          </footer>
        </div>

      </section>
    </ConfigProvider>
  );
};

export default AdminActionPlan;
