import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useLeadSheets } from "@/hooks/useSystemSettings";
import { Loader2 } from "lucide-react";

const LeadSheet = () => {
  const { data: leadSheets, isLoading } = useLeadSheets();
  const [selectedSheetId, setSelectedSheetId] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const selectedSheet = (leadSheets || []).find((s: any) => s.id === selectedSheetId);

  useEffect(() => {
    if (leadSheets && leadSheets.length > 0 && !selectedSheetId) {
      setSelectedSheetId(leadSheets[0].id);
    }
  }, [leadSheets, selectedSheetId]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      if (checked) {
        return { ...prev, [questionId]: [...current, option] };
      } else {
        return { ...prev, [questionId]: current.filter((o: string) => o !== option) };
      }
    });
  };

  return (
    <section className="w-full bg-white rounded-2xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-[500] text-[#0E1011]">Lead sheet:</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative w-full md:w-[200px] lg:w-[245px]">
            {isLoading ? (
              <div className="flex items-center gap-2 bg-[#EBEDF0] px-4 py-2 rounded-md">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </div>
            ) : (
              <>
                <select
                  value={selectedSheetId}
                  onChange={(e) => {
                    setSelectedSheetId(e.target.value);
                    setAnswers({}); // Reset answers when changing active sheet
                  }}
                  className="appearance-none bg-[#EBEDF0] w-full text-[#18181B] font-[400] rounded-md md:px-4 md:py-2 px-2 py-1 text-[14px] md:text-[16px] outline-none pr-8"
                >
                  {leadSheets && leadSheets.length > 0 ? (
                    leadSheets.map((sheet: any) => (
                      <option key={sheet.id} value={sheet.id}>
                        {sheet.title}
                      </option>
                    ))
                  ) : (
                    <option value="">No Lead Sheets Available</option>
                  )}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" size={18} />
              </>
            )}
          </div>
          <button className="bg-[#EBEDF0] rounded-[8px] text-[#0E1011] font-[500] md:px-[12px] md:py-[8px] px-2 py-1 text-[14px] md:text-[16px] hover:bg-gray-100">
            Print
          </button>
          <button className="bg-[#EBEDF0] rounded-[8px] text-[#0E1011] font-[500] md:px-[12px] md:py-[8px] px-2 py-1 text-[14px] md:text-[16px] hover:bg-gray-100">
            Download
          </button>
          <button className="bg-[#EBEDF0] rounded-[8px] text-[#0E1011] font-[500] md:px-[12px] md:py-[8px] px-2 py-1 text-[14px] md:text-[16px] hover:bg-gray-100">
            Send As Email
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-6">
        {selectedSheet?.questions?.map((q: any) => (
          <div key={q.id} className="flex px-4 py-4 rounded-md bg-gray-50 flex-col gap-2 border border-gray-100">
            <label className="text-[#2B3034] font-[500] text-sm md:text-[14px]">
              {q.text} {q.required && <span className="text-red-500">*</span>}
            </label>

            {q.type === "TEXTFIELD" && (
              <textarea
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full mt-1 p-2 border border-gray-200 rounded-md text-[14px] text-[#495057] placeholder-gray-400 outline-none resize-y min-h-[60px] focus:border-yellow-400"
              />
            )}

            {q.type === "RADIO" && (
              <div className="flex flex-col gap-2 mt-2">
                {q.options?.map((opt: string, idx: number) => (
                  <label key={idx} className="flex text-[14px] font-[400] items-center gap-2 text-[#2B3034] cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="accent-black w-4 h-4 cursor-pointer"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === "CHECKBOX" && (
              <div className="flex flex-col gap-2 mt-2">
                {q.options?.map((opt: string, idx: number) => (
                  <label key={idx} className="flex text-[14px] font-[400] items-center gap-2 text-[#2B3034] cursor-pointer">
                    <input
                      type="checkbox"
                      value={opt}
                      checked={(answers[q.id] || []).includes(opt)}
                      onChange={(e) => handleCheckboxChange(q.id, opt, e.target.checked)}
                      className="accent-black w-4 h-4 rounded cursor-pointer"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === "DROPDOWN" && (
              <select
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                className="w-full mt-1 p-2 border border-gray-200 rounded-md text-[14px] text-[#495057] outline-none focus:border-yellow-400 bg-white"
              >
                <option value="">Select an option...</option>
                {q.options?.map((opt: string, idx: number) => (
                  <option key={idx} value={opt}>{opt}</option>
                ))}
              </select>
            )}

            {q.type === "DATETIME" && (
              <input
                type="datetime-local"
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                className="w-full mt-1 p-2 border border-gray-200 rounded-md text-[14px] text-[#495057] outline-none focus:border-yellow-400"
              />
            )}
          </div>
        ))}

        {!isLoading && (!leadSheets || leadSheets.length === 0) && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No Lead Sheets found. Need to create one in System Settings.
          </div>
        )}
      </div>
    </section>
  );
};

export default LeadSheet;
