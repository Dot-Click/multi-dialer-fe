import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiPlus, FiX, FiChevronDown } from "react-icons/fi";
import { HiOutlineMenu } from "react-icons/hi";
import { message } from "antd";
import { useLeadSheets } from "@/hooks/useSystemSettings";
import textImg from "../../../assets/text.png";
import textareaImg from "../../../assets/textarea.png";
import dropdownImg from "../../../assets/dropdown.png";
import radioImg from "../../../assets/radio.png";
import checkboxImg from "../../../assets/checkbox.png";
import dateImg from "../../../assets/date.png";
import datetimeImg from "../../../assets/datetime.png";

// ── Types ────────────────────────────────────────────────────────────────────

type QuestionType =
  | "textfield"
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
  required: boolean;
}

type BackendQuestionType = "TEXTFIELD" | "DROPDOWN" | "CHECKBOX" | "RADIO" | "DATETIME";

// Map frontend type → backend enum value
const typeToBackend: Record<QuestionType, BackendQuestionType> = {
  textfield: "TEXTFIELD",
  textarea: "TEXTFIELD",
  dropdown: "DROPDOWN",
  radio: "RADIO",
  checkbox: "CHECKBOX",
  date: "DATETIME",
  datetime: "DATETIME",
};;

const CHOICE_TYPES: QuestionType[] = ["dropdown", "radio", "checkbox"];

// ── Component ────────────────────────────────────────────────────────────────

const AddLeadSheet: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id"); // If present, we're editing

  const { data: allSheets, createLeadSheet, updateLeadSheet } = useLeadSheets();

  const [leadSheetTitle, setLeadSheetTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { id: "1", question: "", type: "textfield", options: [], required: false },
  ]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ── Load existing sheet for editing ────────────────────────────────────────
  useEffect(() => {
    if (!editId || !allSheets) return;
    const sheet = allSheets.find((s: any) => s.id === editId);
    if (!sheet) return;

    setLeadSheetTitle(sheet.title);
    if (sheet.questions?.length) {
      setQuestions(
        sheet.questions.map((q: any, i: number) => {
          // Map backend type → frontend type
          const backendToFrontend: Record<string, QuestionType> = {
            TEXTFIELD: "textfield",
            DROPDOWN: "dropdown",
            RADIO: "radio",
            CHECKBOX: "checkbox",
            DATETIME: "datetime",
          };
          return {
            id: q.id || String(i + 1),
            question: q.text,
            type: backendToFrontend[q.type] || "textfield",
            options: q.options || [],
            required: q.required ?? false,
          };
        })
      );
    }
  }, [editId, allSheets]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Question type options ───────────────────────────────────────────────────

  const questionTypeOptions: { value: QuestionType; label: string; icon: React.ReactNode }[] = [
    { value: "textfield", label: "Text Field", icon: <img src={textImg} className="w-4 h-4" alt="text" /> },
    { value: "textarea", label: "Text Area", icon: <img src={textareaImg} className="w-4 h-4" alt="textarea" /> },
    { value: "dropdown", label: "Dropdown", icon: <img src={dropdownImg} className="w-4 h-4" alt="dropdown" /> },
    { value: "radio", label: "Radio Button", icon: <img src={radioImg} className="w-4 h-4" alt="radio" /> },
    { value: "checkbox", label: "Checkbox", icon: <img src={checkboxImg} className="w-4 h-4" alt="checkbox" /> },
    { value: "date", label: "Date", icon: <img src={dateImg} className="w-4 h-4" alt="date" /> },
    { value: "datetime", label: "Date and Time", icon: <img src={datetimeImg} className="w-4 h-4" alt="datetime" /> },
  ];

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleQuestionChange = (id: string, field: "question" | "type", value: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const updated = { ...q, [field]: value };

        if (field === "type") {
          const isChoice = CHOICE_TYPES.includes(value as QuestionType);
          if (!isChoice) {
            updated.options = [];
            updated.required = false;
          } else if (updated.options.length === 0) {
            updated.options = ["", ""];
            updated.required = true;
          }
        }
        return updated;
      })
    );
  };

  const handleDeleteQuestion = (id: string) =>
    setQuestions((prev) => prev.filter((q) => q.id !== id));

  const handleAddQuestion = () =>
    setQuestions((prev) => [
      ...prev,
      { id: Date.now().toString(), question: "", type: "textfield", options: [], required: false },
    ]);

  const handleOptionChange = (questionId: string, idx: number, value: string) =>
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const opts = [...q.options];
        opts[idx] = value;
        return { ...q, options: opts };
      })
    );

  const handleAddOption = (questionId: string) =>
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, options: [...q.options, ""] } : q))
    );

  const handleDeleteOption = (questionId: string, idx: number) =>
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const opts = q.options.filter((_, i) => i !== idx);
        return { ...q, options: opts.length ? opts : [""] };
      })
    );

  const getTypeOption = (type: QuestionType) => questionTypeOptions.find((o) => o.value === type);

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leadSheetTitle.trim()) {
      message.error("Please enter a Lead Sheet title.");
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        message.error(`Question #${i + 1} cannot be empty.`);
        return;
      }
      if (CHOICE_TYPES.includes(q.type)) {
        const valid = q.options.filter((o) => o.trim().length > 0);
        if (valid.length < 2) {
          message.error(`Question #${i + 1} (${q.type}) needs at least 2 non-empty options.`);
          return;
        }
      }
    }

    // Build backend payload
    const payload = {
      title: leadSheetTitle.trim(),
      questions: questions.map((q) => {
        const backendType = typeToBackend[q.type];
        const isChoice = CHOICE_TYPES.includes(q.type);
        return {
          text: q.question.trim(),
          type: backendType,
          ...(isChoice
            ? {
              options: q.options.filter((o) => o.trim().length > 0),
              required: true,
            }
            : {}),
        };
      }),
    };

    try {
      if (editId) {
        await updateLeadSheet.mutateAsync({ id: editId, data: payload });
        message.success("Lead Sheet updated successfully!");
      } else {
        await createLeadSheet.mutateAsync(payload);
        message.success("Lead Sheet created successfully!");
      }
      navigate("/admin/system-settings");
    } catch (err: any) {
      message.error(
        err?.response?.data?.message || err?.message || "Failed to save Lead Sheet."
      );
    }
  };

  const isSaving = createLeadSheet.isPending || updateLeadSheet.isPending;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-transparent dark:bg-slate-900 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {editId ? "Edit Lead Sheet" : "Add Lead Sheet"}
          </h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/system-settings")}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 rounded-lg disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {/* Lead Sheet Title */}
        <div className="mb-6 bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4">
            <label className="text-[12px] font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
              Lead Sheet Title
            </label>
            <input
              type="text"
              value={leadSheetTitle}
              onChange={(e) => setLeadSheetTitle(e.target.value)}
              placeholder="e.g. Buyer Qualification Sheet"
              className="w-full bg-transparent border-0 border-b border-gray-300 dark:border-slate-600 focus:border-b focus:border-yellow-400 focus:ring-0 outline-none text-[13px] pb-1 dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-5 mb-6" ref={dropdownRef}>
          {questions.map((question, qIdx) => (
            <div key={question.id} className="p-4 bg-transparent">
              <div className="flex gap-4 justify-center items-center">

                {/* Drag Handle */}
                <div className="cursor-move shrink-0 bg-gray-100 dark:bg-slate-700 p-2 rounded-lg">
                  <HiOutlineMenu size={16} className="text-gray-500 dark:text-gray-400" />
                </div>

                <div className="flex items-center w-full p-3 rounded-lg bg-white dark:bg-slate-800 border dark:border-slate-700 gap-3 flex-wrap sm:flex-nowrap">

                  {/* Question Input */}
                  <div className="flex-1 min-w-[200px] bg-white p-2 rounded-lg">
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => handleQuestionChange(question.id, "question", e.target.value)}
                      placeholder="Add Question"
                      className="w-full bg-transparent border-0 border-b border-gray-300 dark:border-slate-600 focus:border-b focus:border-yellow-400 focus:ring-0 outline-none text-[13px] pb-1 dark:text-white dark:placeholder-gray-500"
                    />
                  </div>

                  {/* Type Dropdown */}
                  <div className="relative w-44 bg-white p-2 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === question.id ? null : question.id)}
                      className="w-full flex items-center justify-between bg-transparent border-none text-sm text-gray-800 dark:text-white"
                    >
                      <div className="flex items-center gap-2">
                        {getTypeOption(question.type)?.icon}
                        {getTypeOption(question.type)?.label}
                      </div>
                      <FiChevronDown className="text-gray-500" />
                    </button>

                    <div className="h-px bg-gray-300 dark:bg-slate-700 mt-1" />

                    {openDropdown === question.id && (
                      <div className="absolute z-20 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg w-full">
                        {questionTypeOptions.map((option) => (
                          <div
                            key={option.value}
                            onClick={() => {
                              handleQuestionChange(question.id, "type", option.value);
                              setOpenDropdown(null);
                            }}
                             className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 ${question.type === option.value ? "text-yellow-500" : "text-gray-800 dark:text-gray-200"
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
                    disabled={questions.length === 1}
                    className="text-red-500 hover:text-red-700 ml-auto shrink-0 disabled:opacity-30"
                    title="Delete question"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>

              {/* Options (for dropdown / radio / checkbox) */}
              {CHOICE_TYPES.includes(question.type) && (
                <div className="mt-4 ml-12">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Options
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-normal ml-1">(at least 2 required)</span>
                  </label>

                  <div className="space-y-2">
                    {question.options.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <div className="cursor-move shrink-0 bg-gray-100 dark:bg-slate-700 p-2 rounded-lg">
                          <HiOutlineMenu size={14} className="text-gray-500 dark:text-gray-400" />
                        </div>

                        <div className="flex-1 min-w-[200px] bg-white dark:bg-slate-800 border dark:border-slate-700 p-2 rounded-lg">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(question.id, idx, e.target.value)}
                            placeholder={`Option ${idx + 1}`}
                            className="w-full bg-transparent border-0 border-b border-gray-300 dark:border-slate-600 focus:border-yellow-400 focus:ring-0 text-[13px] pb-1 outline-none dark:text-white dark:placeholder-gray-500"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteOption(question.id, idx)}
                          className="text-red-500 hover:text-red-700 shrink-0"
                        >
                          <FiX size={18} />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddOption(question.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg mt-2 w-full sm:w-auto transition-colors"
                    >
                      <FiPlus size={16} />
                      Add Option
                    </button>
                  </div>
                </div>
              )}

              {/* Required badge for choice types */}
              {CHOICE_TYPES.includes(question.type) && (
                <p className="ml-12 mt-2 text-xs text-gray-400">
                  ✓ This question is required by default
                </p>
              )}

              {/* Divider between questions */}
              {qIdx < questions.length - 1 && <hr className="mt-4 border-gray-100" />}
            </div>
          ))}
        </div>

        {/* Add Question */}
        <button
          type="button"
          onClick={handleAddQuestion}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors border-2 border-dashed border-gray-200 dark:border-slate-700"
        >
          <FiPlus size={18} />
          Add Question
        </button>
      </div>
    </div>
  );
};

export default AddLeadSheet;
