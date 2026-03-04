import React, { useState, type ChangeEvent } from "react";
import { useMiscFields } from "@/hooks/useSystemSettings";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { FaPlus, FaTimes } from "react-icons/fa";

// Props type
interface AdminMiscModalProps {
    onClose: () => void;
}

const AdminMiscModal: React.FC<AdminMiscModalProps> = ({ onClose }) => {
    const { createMiscField } = useMiscFields();
    const [fieldType, setFieldType] = useState<string>("Date");
    const [fieldName, setFieldName] = useState<string>("");

    const [options, setOptions] = useState<string[]>([
        "First Option",
        "Second Option",
        "Third Option",
    ]);

    const [countFrom, setCountFrom] = useState<number>(1);
    const [countTo, setCountTo] = useState<number>(20);

    const [allowPastDates, setAllowPastDates] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false);

    const fieldOptions = ["Text Field", "Dropdown", "Counter", "Date"];

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAddOption = () => {
        setOptions([...options, ""]);
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleSave = async () => {
        if (!fieldName.trim()) {
            toast.error("Field name is required");
            return;
        }

        setIsSaving(true);

        const typeMap: Record<string, string> = {
            "Text Field": "text",
            "Dropdown": "dropdown",
            "Counter": "counter",
            "Date": "date",
        };


        try {
            await createMiscField.mutateAsync({
                fieldName: fieldName.trim(),
                type: typeMap[fieldType], // ← use mapped value
                options: fieldType === "Dropdown" ? options.filter(o => o.trim() !== "") : [],
                countFrom: fieldType === "Counter" ? countFrom : undefined,
                countTo: fieldType === "Counter" ? countTo : undefined,
                allowPastDates: fieldType === "Date" ? allowPastDates : undefined,
            } as any);
            toast.success("Field created successfully");
            onClose();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to create field");
        } finally {
            setIsSaving(false);
        }
    };

    // Preview Rendering
    const renderPreview = () => {
        switch (fieldType) {
            case "Dropdown":
                return (
                    <div className="relative">
                        <select
                            disabled
                            className="appearance-none bg-white border border-gray-300 rounded-md py-1 px-3 pr-8 leading-tight"
                        >
                            <option>Your Content</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg
                                className="fill-current h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                );

            case "Counter":
                return (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button className="bg-gray-100 rounded-md px-2.5 py-1 text-sm font-bold text-gray-700 hover:bg-gray-200">
                                -
                            </button>
                            <span className="font-semibold w-4 text-center">0</span>
                            <button className="bg-gray-100 rounded-md px-2.5 py-1 text-sm font-bold text-gray-700 hover:bg-gray-200">
                                +
                            </button>
                        </div>
                        <button className="text-gray-500 text-sm font-medium bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200">
                            Reset
                        </button>
                    </div>
                );

            case "Date":
                return <span className="text-gray-500">DD/MM/YYYY 00:00</span>;

            default:
                return <span className="text-gray-500">Your Content</span>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-9999">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Create Misc Field
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="overflow-y-auto px-6 py-6 space-y-5 flex-1">
                    {/* Type Section */}
                    <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">Type</p>
                        <div className="flex flex-col gap-2">
                            {fieldOptions.map((option) => (
                                <label
                                    key={option}
                                    className="flex items-center gap-2 text-gray-700 text-sm"
                                >
                                    <input
                                        type="radio"
                                        name="fieldType"
                                        value={option}
                                        checked={fieldType === option}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            setFieldType(e.target.value)
                                        }
                                        className="accent-black"
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Field Name */}
                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            Field Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter field name"
                            value={fieldName}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setFieldName(e.target.value)
                            }
                            className="w-full bg-transparent text-sm focus:outline-none"
                        />
                    </div>

                    {/* Dropdown Options */}
                    {fieldType === "Dropdown" && (
                        <div>
                            <p className="text-sm font-semibold text-gray-900 mb-2">
                                Option List
                            </p>
                            <div className="space-y-3">
                                {options.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="bg-gray-100 rounded-lg px-4 py-2 flex-1">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Option
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter name for this option"
                                                value={option}
                                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                    handleOptionChange(index, e.target.value)
                                                }
                                                className="w-full bg-transparent text-sm focus:outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleRemoveOption(index)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleAddOption}
                                className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 font-semibold rounded-md hover:bg-gray-200"
                            >
                                <FaPlus size={12} /> Add Option
                            </button>
                        </div>
                    )}

                    {/* Counter Inputs */}
                    {fieldType === "Counter" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-100 rounded-lg px-4 py-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Count from
                                </label>
                                <input
                                    type="number"
                                    value={countFrom}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setCountFrom(Number(e.target.value))
                                    }
                                    className="w-full bg-transparent text-sm focus:outline-none"
                                />
                            </div>
                            <div className="bg-gray-100 rounded-lg px-4 py-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Count to
                                </label>
                                <input
                                    type="number"
                                    value={countTo}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setCountTo(Number(e.target.value))
                                    }
                                    className="w-full bg-transparent text-sm focus:outline-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Date Options */}
                    {fieldType === "Date" && (
                        <label className="flex items-center gap-2 text-gray-700 text-sm">
                            <input
                                type="checkbox"
                                checked={allowPastDates}
                                onChange={() => setAllowPastDates(!allowPastDates)}
                                className="h-4 w-4 rounded accent-black"
                            />
                            Allow selecting past dates
                        </label>
                    )}

                    {/* Preview */}
                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Preview:</p>
                        <div className="flex justify-between items-center text-sm text-gray-800 font-medium">
                            <span>{fieldName || "Your Label"}</span>
                            {renderPreview()}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-center gap-3 border-t border-gray-200 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 w-full bg-gray-100 text-gray-800 font-semibold rounded-md hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 w-full bg-[#FFCA06] text-gray-900 font-semibold rounded-md hover:bg-[#f3c005] disabled:opacity-50 flex items-center justify-center"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminMiscModal;
