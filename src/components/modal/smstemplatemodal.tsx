import React from "react";

interface SMSTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SMSTemplateModal: React.FC<SMSTemplateModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 px-4"
            onClick={onClose}
        >
            <div
                className="p-5 border w-full max-w-md mx-auto shadow-lg rounded-xl bg-white max-h-[80vh] custom-scrollbar overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Create SMS Template</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                <div className="space-y-5">
                    <div className="bg-gray-50 flex flex-col gap-1 border border-gray-100 rounded-lg focus:ring-yellow-500 px-3 py-2  focus:border-yellow-500">
                        <label className="block  text-xs font-medium text-gray-700">Template Name</label>
                        <input
                            type="text"
                            className=" text-gray-900 text-sm placeholder:text-sm block w-full "
                            placeholder="Enter template name"
                        />
                    </div>

                  

                    <div className="bg-gray-50 flex flex-col gap-1 border border-gray-100 rounded-lg focus:ring-yellow-500 px-3 py-2  focus:border-yellow-500">
                        <label className="block  text-xs font-medium text-gray-700">Content</label>
                        <textarea
                            rows={4}
                            className=" text-gray-900  resize-none text-sm placeholder:text-sm block w-full "
                            placeholder="Enter SMS text"
                        ></textarea>
                    </div>
                </div>

                <div className="flex items-center justify-center pt-4 gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 w-full bg-gray-100 text-gray-800 font-medium text-sm rounded-lg hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="text-gray-950 w-full bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-8 py-2.5 text-center"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SMSTemplateModal;
