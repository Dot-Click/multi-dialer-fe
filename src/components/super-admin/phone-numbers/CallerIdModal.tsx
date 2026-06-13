import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createAdminCallerId,
  updateAdminCallerId,
  fetchAvailableNumbers,
} from "@/store/slices/superAdminCallerIdSlice";
import type { CallerIdRecord } from "@/store/slices/superAdminCallerIdSlice";
import toast from "react-hot-toast";
import { X, ChevronDown } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  existing?: CallerIdRecord | null;
}

interface FormState {
  label: string;
  countryCode: string;
  numberOfLines: string;
  dialerType: string;
}

const DIALER_TYPES = ["PREDICTIVE", "POWER", "PREVIEW"];

const CallerIdModal = ({ isOpen, onClose, userId, existing }: Props) => {
  const dispatch = useAppDispatch();
  const { saving, availableNumbers, availableNumbersLoading } = useAppSelector(
    (s) => s.superAdminCallerIds
  );

  const [form, setForm] = useState<FormState>({
    label: "",
    countryCode: "+1",
    numberOfLines: "1",
    dialerType: "PREDICTIVE",
  });
  const [selectedNumber, setSelectedNumber] = useState<{ phoneNumber: string; sid: string } | null>(null);
  const [numberDropdownOpen, setNumberDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<{ label?: string; phoneNumber?: string; numberOfLines?: string }>({});

  useEffect(() => {
    if (!isOpen) return;

    if (existing) {
      setForm({
        label: existing.label ?? "",
        countryCode: existing.countryCode ?? "+1",
        numberOfLines: String(existing.numberOfLines ?? 1),
        dialerType: existing.dialerType ?? "PREDICTIVE",
      });
      setSelectedNumber(
        existing.twillioNumber
          ? { phoneNumber: existing.twillioNumber, sid: existing.twillioSid ?? "" }
          : null
      );
    } else {
      setForm({ label: "", countryCode: "+1", numberOfLines: "1", dialerType: "PREDICTIVE" });
      setSelectedNumber(null);
      dispatch(fetchAvailableNumbers(userId));
    }

    setErrors({});
    setNumberDropdownOpen(false);
  }, [isOpen, existing, userId]);

  if (!isOpen) return null;

  const validate = () => {
    const e: typeof errors = {};
    if (!form.label.trim()) e.label = "Label is required";
    const lines = parseInt(form.numberOfLines);
    if (form.numberOfLines && (isNaN(lines) || lines < 1)) e.numberOfLines = "Must be a positive number";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    const payload: any = {
      label: form.label.trim(),
      countryCode: form.countryCode.trim(),
      numberOfLines: parseInt(form.numberOfLines) || 1,
      dialerType: form.dialerType,
    };

    if (selectedNumber?.phoneNumber) payload.twillioNumber = selectedNumber.phoneNumber;
    if (selectedNumber?.sid) payload.twillioSid = selectedNumber.sid;

    if (existing) {
      const result = await dispatch(updateAdminCallerId({ id: existing.id, ...payload }));
      if (updateAdminCallerId.fulfilled.match(result)) {
        toast.success("Phone number updated");
        onClose();
      } else {
        toast.error((result.payload as string) || "Update failed");
      }
    } else {
      const result = await dispatch(createAdminCallerId({ userId, ...payload }));
      if (createAdminCallerId.fulfilled.match(result)) {
        toast.success("Phone number added");
        onClose();
      } else {
        toast.error((result.payload as string) || "Failed to add number");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-slate-800 rounded-[24px] w-full max-w-[480px] mx-4 p-6 shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-[18px] font-[700] text-[#1D2C45] dark:text-white">
            {existing ? "Edit Phone Number" : "Add Phone Number"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-4">

          {/* Phone Number Selector — only for add; show as read-only text for edit */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-[500] text-[#1D2C45] dark:text-gray-300">
              Phone Number {!existing && <span className="text-gray-400 font-[400]">(select from account)</span>}
            </label>

            {existing ? (
              <div className="h-[42px] rounded-[10px] border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 px-3 flex items-center text-[14px] text-gray-500 dark:text-gray-400">
                {existing.twillioNumber || <span className="italic">No number assigned</span>}
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNumberDropdownOpen((o) => !o)}
                  className="w-full h-[42px] rounded-[10px] border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 flex justify-between items-center text-[14px] text-[#1D2C45] dark:text-white"
                >
                  <span className={selectedNumber ? "" : "text-gray-400"}>
                    {availableNumbersLoading
                      ? "Loading numbers…"
                      : selectedNumber
                      ? selectedNumber.phoneNumber
                      : availableNumbers.length === 0
                      ? "No numbers found in this account"
                      : "— Select a number —"}
                  </span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${numberDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {numberDropdownOpen && !availableNumbersLoading && availableNumbers.length > 0 && (
                  <div className="absolute top-11 left-0 w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-[12px] shadow-lg z-50 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {availableNumbers.map((n) => (
                      <div
                        key={n.sid}
                        onClick={() => {
                          setSelectedNumber({ phoneNumber: n.phoneNumber, sid: n.sid });
                          if (!form.label) {
                            setForm((f) => ({ ...f, label: n.friendlyName || n.phoneNumber }));
                          }
                          setNumberDropdownOpen(false);
                        }}
                        className={`px-4 py-2.5 cursor-pointer text-[13px] hover:bg-[#FEFCE8] dark:hover:bg-slate-800 transition-colors
                          ${selectedNumber?.sid === n.sid ? "bg-[#FEFCE8] dark:bg-slate-800 font-[600]" : "text-[#1D2C45] dark:text-white"}`}
                      >
                        <span className="font-[500]">{n.phoneNumber}</span>
                        {n.friendlyName && (
                          <span className="text-gray-400 text-[12px] ml-2">{n.friendlyName}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {errors.phoneNumber && <span className="text-[12px] text-red-500">{errors.phoneNumber}</span>}
          </div>

          {/* Label */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-[500] text-[#1D2C45] dark:text-gray-300">Label *</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => { setForm((f) => ({ ...f, label: e.target.value })); setErrors((er) => ({ ...er, label: undefined })); }}
              placeholder="e.g. Main Sales Line"
              className="h-[42px] rounded-[10px] border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 text-[14px] text-[#1D2C45] dark:text-white outline-none focus:border-[#FFCA06]"
            />
            {errors.label && <span className="text-[12px] text-red-500">{errors.label}</span>}
          </div>

          {/* Country Code + Lines */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-[500] text-[#1D2C45] dark:text-gray-300">Country Code</label>
              <input
                type="text"
                value={form.countryCode}
                onChange={(e) => setForm((f) => ({ ...f, countryCode: e.target.value }))}
                placeholder="+1"
                className="h-[42px] rounded-[10px] border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 text-[14px] text-[#1D2C45] dark:text-white outline-none focus:border-[#FFCA06]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-[500] text-[#1D2C45] dark:text-gray-300">Number of Lines</label>
              <input
                type="number"
                value={form.numberOfLines}
                onChange={(e) => { setForm((f) => ({ ...f, numberOfLines: e.target.value })); setErrors((er) => ({ ...er, numberOfLines: undefined })); }}
                placeholder="1"
                min={1}
                className="h-[42px] rounded-[10px] border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 text-[14px] text-[#1D2C45] dark:text-white outline-none focus:border-[#FFCA06]"
              />
              {errors.numberOfLines && <span className="text-[12px] text-red-500">{errors.numberOfLines}</span>}
            </div>
          </div>

          {/* Dialer Type */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-[500] text-[#1D2C45] dark:text-gray-300">Dialer Type</label>
            <select
              value={form.dialerType}
              onChange={(e) => setForm((f) => ({ ...f, dialerType: e.target.value }))}
              className="h-[42px] rounded-[10px] border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 text-[14px] text-[#1D2C45] dark:text-white outline-none focus:border-[#FFCA06]"
            >
              {DIALER_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-[44px] rounded-[12px] border border-gray-200 dark:border-slate-600 text-[14px] font-[500] text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 h-[44px] rounded-[12px] bg-[#FFCA06] text-[#1D2C45] text-[14px] font-[600] hover:bg-yellow-400 disabled:opacity-60"
            >
              {saving ? "Saving…" : existing ? "Save Changes" : "Add Number"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallerIdModal;
