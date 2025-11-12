import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiX, FiCircle, FiChevronDown } from "react-icons/fi";
import { HiOutlineMenu } from "react-icons/hi";
import {
  BsTextareaT,
  BsListCheck,
  BsCheckSquare,
  BsCalendar,
  BsCalendarEvent,
} from "react-icons/bs";

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
    { value: "text", label: "Text Field", icon: <HiOutlineMenu size={16} /> },
    { value: "textarea", label: "Text Area", icon: <BsTextareaT size={16} /> },
    { value: "dropdown", label: "Dropdown", icon: <BsListCheck size={16} /> },
    { value: "radio", label: "Radio Button", icon: <FiCircle size={16} /> },
    { value: "checkbox", label: "Checkbox", icon: <BsCheckSquare size={16} /> },
    { value: "date", label: "Date", icon: <BsCalendar size={16} /> },
    {
      value: "datetime",
      label: "Date and Time",
      icon: <BsCalendarEvent size={16} />,
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
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lead Sheet Title
          </label>
          <input
            type="text"
            value={leadSheetTitle}
            onChange={(e) => setLeadSheetTitle(e.target.value)}
            placeholder="Enter lead sheet title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-sm bg-white"
          />
        </div>

        {/* Questions */}
        <div className="space-y-5 mb-6">
          {questions.map((question) => (
            <div
              key={question.id}
              className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                {/* Drag Handle */}
                <div className="cursor-move text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <HiOutlineMenu size={18} />
                </div>

                {/* Question Input */}
                <div className="flex-1 min-w-[200px]">
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
                    className="w-full border-none focus:ring-0 text-gray-800 text-sm placeholder-gray-400 bg-transparent"
                  />
                  <div className="h-px bg-gray-200 mt-1"></div>
                </div>

                {/* Custom Dropdown */}
                <div className="relative w-44">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === question.id ? null : question.id
                      )
                    }
                    className="w-full flex items-center justify-between border-none bg-transparent focus:outline-none text-sm text-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      {getTypeOption(question.type)?.icon}
                      {getTypeOption(question.type)?.label}
                    </div>
                    <FiChevronDown className="text-gray-500" />
                  </button>
                  <div className="h-px bg-gray-200 mt-1"></div>

                  {/* Dropdown Menu */}
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

              {/* Options for Dropdown/Radio/Checkbox */}
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
                        <div className="cursor-move text-gray-400 hover:text-gray-600 flex-shrink-0">
                          <HiOutlineMenu size={16} />
                        </div>
                        <div className="flex-1 min-w-[200px]">
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
                            className="w-full border-none focus:ring-0 text-gray-800 text-sm placeholder-gray-400 bg-transparent"
                          />
                          <div className="h-px bg-gray-200 mt-1"></div>
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
