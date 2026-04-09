import { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { uploadAttachment, deleteAttachment } from "@/store/slices/contactSlice";
import { FiDownload, FiTrash2, FiPaperclip } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Attachments = () => {
    const dispatch = useAppDispatch();
    const { currentContact } = useAppSelector((state) => state.contacts);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !currentContact) return;

        // Check file size (10 MB limit as per UI)
        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size exceeds 10 MB limit");
            return;
        }

        setIsUploading(true);
        try {
            await dispatch(uploadAttachment({ contactId: currentContact.id, file })).unwrap();
            toast.success("File uploaded successfully");
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error: any) {
            toast.error(error || "Failed to upload file");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this attachment?")) return;
        try {
            await dispatch(deleteAttachment(id)).unwrap();
            toast.success("Attachment deleted");
        } catch (error: any) {
            toast.error(error || "Failed to delete attachment");
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const attachments = currentContact?.attachments || [];

    return (
        <div className='flex gap-6 flex-col min-h-40'>
            <div className="flex justify-between items-center">
                <h1 className='text-[#0E1011] dark:text-white text-[18px] font-medium'>Attachments:</h1>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className='flex bg-[#EBEDF0] dark:bg-gray-700 py-[6px] px-[16px] cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 rounded-[12px] gap-2 items-center justify-center transition-colors disabled:opacity-50'
                >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FiPaperclip className="text-[14px] dark:text-white" />}
                    <span className='text-[#0E1011] dark:text-white text-[14px] font-medium'>
                        {isUploading ? "Uploading..." : "Upload File"}
                    </span>
                    {!isUploading && <span className='text-[12px] font-normal text-[#495057] dark:text-gray-400'>(max 10 MB)</span>}
                </button>
            </div>

            {attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attachments.map((file: any) => (
                        <div key={file.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-750 transition-colors group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex-shrink-0">
                                    <FiPaperclip className="text-[#1D85F0]" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-[14px] font-medium text-[#0E1011] dark:text-white truncate" title={file.fileName}>
                                        {file.fileName}
                                    </span>
                                    <span className="text-[12px] text-gray-500 dark:text-gray-400">
                                        {formatSize(file.fileSize)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                    href={file.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
                                    title="Download"
                                >
                                    <FiDownload size={16} />
                                </a>
                                <button
                                    onClick={() => handleDelete(file.id)}
                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-500"
                                    title="Delete"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className='flex justify-center md:mt-12 gap-2 items-center w-full text-center md:w-[50%] mx-auto flex-col'>
                    <h1 className='text-[#000000] dark:text-white text-[14px] font-medium'>No Data Available</h1>
                    <p className='text-[#848C94] dark:text-gray-400 text-[14px] font-normal'>There have been no attachments uploaded yet</p>
                </div>
            )}
        </div>
    );
};

export default Attachments;