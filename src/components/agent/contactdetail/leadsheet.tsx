import { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useLeadSheets } from "@/hooks/useSystemSettings";
import { Loader2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateContact, sendLeadSheetEmail } from "@/store/slices/contactSlice";
import toast from "react-hot-toast";

const LeadSheet = () => {
  const dispatch = useAppDispatch();
  const { currentContact } = useAppSelector((state) => state.contacts);
  const { data: leadSheets, isLoading } = useLeadSheets();
  const [selectedSheetId, setSelectedSheetId] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const selectedSheet = (leadSheets || []).find((s: any) => s.id === selectedSheetId);

  useEffect(() => {
    if (leadSheets && leadSheets.length > 0 && !selectedSheetId) {
      setSelectedSheetId(leadSheets[0].id);
    }
  }, [leadSheets, selectedSheetId]);

  useEffect(() => {
    if (currentContact?.leadsheetValues) {
      setAnswers(currentContact.leadsheetValues as Record<string, any>);
    }
  }, [currentContact]);

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

  const handleSave = async () => {
    if (!currentContact) return;
    setIsUpdating(true);
    try {
      await dispatch(
        updateContact({
          id: currentContact.id,
          payload: { leadsheetValues: answers },
        })
      ).unwrap();
      toast.success("Lead sheet answers saved successfully");
    } catch (error: any) {
      toast.error("Failed to save lead sheet: " + error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!currentContact || !selectedSheetId) return;

    const email = currentContact.emails?.[0]?.email || prompt("Enter recipient email address:");
    if (!email) return;

    setIsSendingEmail(true);
    try {
      await dispatch(
        sendLeadSheetEmail({
          contactId: currentContact.id,
          leadSheetId: selectedSheetId,
          recipientEmail: email,
        })
      ).unwrap();
      toast.success("Lead sheet email sent successfully to " + email);
    } catch (error: any) {
      toast.error("Failed to send lead sheet email: " + error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleDownload = () => {
    if (!selectedSheet || !currentContact) return;

    let content = `LEAD SHEET: ${selectedSheet.title}\n`;
    content += `CONTACT: ${currentContact.fullName}\n`;
    content += `DATE: ${new Date().toLocaleString()}\n`;
    content += `------------------------------------------\n\n`;

    selectedSheet.questions?.forEach((q: any, index: number) => {
      const answer = answers[q.id];
      const formattedAnswer = Array.isArray(answer)
        ? answer.join(", ")
        : answer || "Not provided";

      content += `${index + 1}. ${q.text}\n`;
      content += `   Answer: ${formattedAnswer}\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `LeadSheet_${currentContact.fullName.replace(/\s+/g, '_')}_${selectedSheet.title.replace(/\s+/g, '_')}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Lead sheet downloaded successfully");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="w-full bg-white dark:bg-slate-800 rounded-2xl transition-colors">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h2 className="text-[18px] font-medium text-[#0E1011] dark:text-white">Lead sheet:</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative w-full md:w-[200px] lg:w-[245px]">
            {isLoading ? (
              <div className="flex items-center gap-2 bg-[#EBEDF0] dark:bg-gray-700 dark:text-white px-4 py-2 rounded-md">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </div>
            ) : (
              <>
                <select
                  value={selectedSheetId}
                  onChange={(e) => {
                    setSelectedSheetId(e.target.value);
                  }}
                  className="appearance-none bg-[#EBEDF0] dark:bg-gray-700 w-full text-[#18181B] dark:text-white font-normal rounded-md md:px-4 md:py-2 px-2 py-1 text-[14px] md:text-[16px] outline-none pr-8"
                >
                  {leadSheets && leadSheets.length > 0 ? (
                    leadSheets.map((sheet: any) => (
                      <option key={sheet.id} value={sheet.id} className="dark:bg-slate-800">
                        {sheet.title}
                      </option>
                    ))
                  ) : (
                    <option value="" className="dark:bg-slate-800">No Lead Sheets Available</option>
                  )}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 pointer-events-none" size={18} />
              </>
            )}
          </div>
          <button
            onClick={handlePrint}
            disabled={!selectedSheet}
            className="bg-[#EBEDF0] dark:bg-gray-700 rounded-[8px] text-[#0E1011] dark:text-white font-medium md:px-[12px] md:py-[8px] px-2 py-1 text-[14px] md:text-[16px] hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Print
          </button>
          <button
            onClick={handleDownload}
            disabled={!selectedSheet}
            className="bg-[#EBEDF0] dark:bg-gray-700 rounded-[8px] text-[#0E1011] dark:text-white font-medium md:px-[12px] md:py-[8px] px-2 py-1 text-[14px] md:text-[16px] hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Download
          </button>
          <button
            onClick={handleSendEmail}
            disabled={isSendingEmail || !selectedSheetId}
            className="bg-[#EBEDF0] dark:bg-gray-700 rounded-[8px] text-[#0E1011] dark:text-white font-medium md:px-[12px] md:py-[8px] px-2 py-1 text-[14px] md:text-[16px] hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSendingEmail && <Loader2 className="w-4 h-4 animate-spin" />}
            Send As Email
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-6">
        {selectedSheet?.questions?.map((q: any) => (
          <div key={q.id} className="flex px-4 py-4 rounded-md bg-gray-50 dark:bg-gray-700 flex-col gap-2 border border-gray-100 dark:border-gray-600">
            <label className="text-[#2B3034] dark:text-white font-medium text-sm md:text-[14px]">
              {q.text} {q.required && <span className="text-red-500">*</span>}
            </label>

            {q.type === "TEXTFIELD" && (
              <textarea
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                placeholder="Type your answer here..."
                className="w-full mt-1 p-2 border border-gray-200 dark:border-gray-600 rounded-md text-[14px] text-[#495057] dark:text-white placeholder-gray-400 outline-none bg-white dark:bg-slate-800 resize-y min-h-[60px] focus:border-yellow-400"
              />
            )}

            {q.type === "RADIO" && (
              <div className="flex flex-col gap-2 mt-2">
                {q.options?.map((opt: string, idx: number) => (
                  <label key={idx} className="flex text-[14px] font-normal items-center gap-2 text-[#2B3034] dark:text-gray-300 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt}
                      checked={answers[q.id] === opt}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="accent-[#FFCA06] w-4 h-4 cursor-pointer"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {q.type === "CHECKBOX" && (
              <div className="flex flex-col gap-2 mt-2">
                {q.options?.map((opt: string, idx: number) => (
                  <label key={idx} className="flex text-[14px] font-normal items-center gap-2 text-[#2B3034] dark:text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      value={opt}
                      checked={(answers[q.id] || []).includes(opt)}
                      onChange={(e) => handleCheckboxChange(q.id, opt, e.target.checked)}
                      className="accent-[#FFCA06] w-4 h-4 rounded cursor-pointer"
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
                className="w-full mt-1 p-2 border border-gray-200 dark:border-gray-600 rounded-md text-[14px] text-[#495057] dark:text-white outline-none focus:border-yellow-400 bg-white dark:bg-slate-800"
              >
                <option value="" className="dark:bg-slate-800">Select an option...</option>
                {q.options?.map((opt: string, idx: number) => (
                  <option key={idx} value={opt} className="dark:bg-slate-800">{opt}</option>
                ))}
              </select>
            )}

            {q.type === "DATETIME" && (
              <input
                type="datetime-local"
                value={answers[q.id] || ""}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                className="w-full mt-1 p-2 border border-gray-200 dark:border-gray-600 rounded-md text-[14px] text-[#495057] dark:text-white outline-none bg-white dark:bg-slate-800 focus:border-yellow-400"
              />
            )}
          </div>
        ))}

        {!isLoading && (!leadSheets || leadSheets.length === 0) && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No Lead Sheets found. Need to create one in System Settings.
          </div>
        )}

        {selectedSheet && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="bg-[#0E1011] dark:bg-[#FFCA06] text-white dark:text-[#2B3034] px-8 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-[#ffd633] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Lead Sheet
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LeadSheet;
