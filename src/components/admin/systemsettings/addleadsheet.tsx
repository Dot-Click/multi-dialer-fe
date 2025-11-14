import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiX,  FiChevronDown } from "react-icons/fi";
import { HiOutlineMenu } from "react-icons/hi";
import textImg from "../../../assets/text.png";
import textareaImg from "../../../assets/textarea.png";
import dropdownImg from "../../../assets/dropdown.png";
import radioImg from "../../../assets/radio.png";
import checkboxImg from "../../../assets/checkbox.png";
import dateImg from "../../../assets/date.png";
import datetimeImg from "../../../assets/datetime.png";


type QuestionType =
  | "text"
  | "textarea"
  | "dropdown"
  | "radio"
  | "checkbox"
  | "date"
  | "datetime";

interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options: string[];
}

const AddLeadSheet: React.FC = () => {
  const navigate = useNavigate();
  const [leadSheetTitle, setLeadSheetTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", question: "", type: "text", options: [] },
  ]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const questionTypeOptions: {
    value: QuestionType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { value: "text", label: "Text Field", icon: <img src={textImg} className="w-4 h-4" /> },
  
    { value: "textarea", label: "Text Area", icon: <img src={textareaImg} className="w-4 h-4" /> },
  
    { value: "dropdown", label: "Dropdown", icon: <img src={dropdownImg} className="w-4 h-4" /> },
  
    { value: "radio", label: "Radio Button", icon: <img src={radioImg} className="w-4 h-4" /> },
  
    { value: "checkbox", label: "Checkbox", icon: <img src={checkboxImg} className="w-4 h-4" /> },
  
    { value: "date", label: "Date", icon: <img src={dateImg} className="w-4 h-4" /> },
  
    {
      value: "datetime",
      label: "Date and Time",
      icon: <img src={datetimeImg} className="w-4 h-4" />,
    },
  ];

  const handleQuestionChange = (
    id: string,
    field: "question" | "type",
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const updated = { ...q, [field]: value };
          if (
            field === "type" &&
            !["dropdown", "radio", "checkbox"].includes(value)
          ) {
            updated.options = [];
          } else if (
            field === "type" &&
            ["dropdown", "radio", "checkbox"].includes(value) &&
            updated.options.length === 0
          ) {
            updated.options = [""];
          }
          return updated;
        }
        return q;
      })
    );
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      type: "text",
      options: [],
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleOptionChange = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const handleAddOption = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  const handleDeleteOption = (questionId: string, optionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const newOptions = q.options.filter((_, idx) => idx !== optionIndex);
          return { ...q, options: newOptions.length ? newOptions : [""] };
        }
        return q;
      })
    );
  };

  const getTypeOption = (type: QuestionType) =>
    questionTypeOptions.find((opt) => opt.value === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Lead Sheet:", { title: leadSheetTitle, questions });
    navigate("/admin/system-settings");
  };

  const handleCancel = () => navigate("/admin/system-settings");

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Add Lead Sheet</h1>
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-400 hover:bg-yellow-500 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>

      {/* Lead Sheet Title */}
<div className="mb-6 bg-white p-4 rounded-xl">
  <div className="flex items-center gap-4">
    {/* Label */}
    <label className="text-[12px] font-medium text-gray-700 whitespace-nowrap">
      Lead Sheet Title
    </label>

    {/* Input underline */}
    <input
      type="text"
      value={leadSheetTitle}
      onChange={(e) => setLeadSheetTitle(e.target.value)}
      className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-b focus:border-gray-400 focus:ring-0 outline-none text-[13px] pb-1"

    />
  </div>
</div>


{/* Questions */}
<div className="space-y-5 mb-6">
  {questions.map((question) => (
    <div
      key={question.id}
      className="p-4 bg-transparent"
    >
<div className="flex gap-4 justify-center items-center">
     {/* Drag Handle (GRAY BACKGROUND, LEFT SIDE) */}
     <div className="cursor-move flex-shrink-0 bg-gray-100 p-2 rounded-lg">
          <HiOutlineMenu size={16} className="text-gray-500" />
        </div>
      <div className="flex items-center w-full p-3 rounded-lg   bg-white gap-3 flex-wrap sm:flex-nowrap">

     

        {/* Question Input */}
        <div className="flex-1 min-w-[200px] bg-white p-2 rounded-lg">
          <input
            type="text"
            value={question.question}
            onChange={(e) =>
              handleQuestionChange(
                question.id,
                "question",
                e.target.value
              )
            }
            placeholder="Add Question"
            className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-b focus:border-gray-400 focus:ring-0 outline-none text-[13px] pb-1"


          />
        </div>

        {/* Type Dropdown */}
        <div className="relative w-44 bg-white p-2 rounded-lg">
          <button
            type="button"
            onClick={() =>
              setOpenDropdown(
                openDropdown === question.id ? null : question.id
              )
            }
            className="w-full flex items-center justify-between bg-transparent border-none text-sm text-gray-800"
          >
            <div className="flex items-center gap-2">
              {getTypeOption(question.type)?.icon}
              {getTypeOption(question.type)?.label}
            </div>
            <FiChevronDown className="text-gray-500" />
          </button>

          <div className="h-px bg-gray-300 mt-1"></div>

          {openDropdown === question.id && (
            <div className="absolute z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
              {questionTypeOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    handleQuestionChange(
                      question.id,
                      "type",
                      option.value
                    );
                    setOpenDropdown(null);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    question.type === option.value
                      ? "text-yellow-500"
                      : "text-gray-800"
                  }`}
                >
                  {option.icon}
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Question */}
        <button
          type="button"
          onClick={() => handleDeleteQuestion(question.id)}
          className="text-red-500 hover:text-red-700 ml-auto flex-shrink-0"
        >
          <FiX size={20} />
        </button>
      </div>

      {/* Options (if dropdown, radio, checkbox) */}
      {["dropdown", "radio", "checkbox"].includes(question.type) && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options
          </label>

          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 flex-wrap sm:flex-nowrap"
              >
                <div className="cursor-move flex-shrink-0 bg-gray-100 p-2 rounded-lg">
                  <HiOutlineMenu size={14} className="text-gray-500" />
                </div>

                <div className="flex-1 min-w-[200px] bg-white p-2 rounded-lg">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(
                        question.id,
                        idx,
                        e.target.value
                      )
                    }
                    placeholder="Option"
                    className="w-full bg-transparent border-0 border-b border-gray-300 focus:border-yellow-400 focus:ring-0 text-[13px] pb-1"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteOption(question.id, idx)
                  }
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <FiX size={18} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => handleAddOption(question.id)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg mt-2 w-full sm:w-auto"
            >
              <FiPlus size={16} />
              Add Option
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  ))}
</div>


        {/* Add Question */}
        <button
          type="button"
          onClick={handleAddQuestion}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          <FiPlus size={18} />
          Add Question
        </button>
      </div>
    </div>
  );
};

export default AddLeadSheet;
