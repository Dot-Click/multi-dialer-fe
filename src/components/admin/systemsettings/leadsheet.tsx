import React, { useRef, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import { useLeadSheets } from "@/hooks/useSystemSettings";

// ── Lead Sheet Item ──────────────────────────────────────────────────────────

interface LeadSheetItemProps {
    id: string;
    name: string;
    questionCount: number;
    updatedAt?: string;
    onEdit: (id: string) => void;
    onDelete: (id: string, name: string) => void;
}

const LeadSheetItem: React.FC<LeadSheetItemProps> = ({
    id, name, questionCount, updatedAt, onEdit, onDelete
}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const formatted = updatedAt
        ? new Date(updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex justify-between items-center transition hover:shadow-md hover:border-gray-300 gap-3">
            <div className="flex items-center gap-3 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm truncate">{name}</h3>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600 whitespace-nowrap shrink-0">
                    {questionCount} {questionCount === 1 ? "question" : "questions"}
                </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                {formatted && (
                    <span className="text-xs text-gray-400 hidden sm:block">{formatted}</span>
                )}

                {/* Actions menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((o) => !o)}
                        className="text-gray-400 p-2 rounded-full hover:bg-gray-100"
                    >
                        <BsThreeDots size={18} />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg w-36 py-1 overflow-hidden">
                            <button
                                onClick={() => { onEdit(id); setMenuOpen(false); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                <FiEdit2 size={14} />
                                Edit
                            </button>
                            <button
                                onClick={() => { onDelete(id, name); setMenuOpen(false); }}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                            >
                                <FiTrash2 size={14} />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Main LeadSheet Component ─────────────────────────────────────────────────

const LeadSheet: React.FC = () => {
    const navigate = useNavigate();
    const {
        data: leadSheets,
        isLoading,
        isError,
        error,
        deleteLeadSheet,
    } = useLeadSheets();

    const handleEdit = (id: string) => navigate(`/admin/add-lead-sheet?id=${id}`);

    const handleDelete = (id: string, name: string) => {
        Modal.confirm({
            title: "Delete Lead Sheet",
            content: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            okText: "Delete",
            okButtonProps: { danger: true },
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    await deleteLeadSheet.mutateAsync(id);
                    message.success("Lead Sheet deleted.");
                } catch (err: any) {
                    message.error(err?.response?.data?.message || "Failed to delete lead sheet.");
                }
            },
        });
    };

    if (isLoading) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg min-h-[200px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mr-3" />
                Loading Lead Sheets...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-8 text-center text-red-500 bg-white rounded-lg">
                Error: {(error as any)?.message || "Failed to fetch lead sheets"}
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen px-4 py-5 rounded-lg">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Lead Sheet</h1>
                    <Link
                        to="/admin/add-lead-sheet"
                        className="w-full sm:w-auto bg-yellow-400 text-black font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors text-sm shadow-sm"
                    >
                        <FiPlus size={18} />
                        Add Lead Sheet
                    </Link>
                </header>

                {/* List */}
                <main className="space-y-4">
                    {!leadSheets || leadSheets.length === 0 ? (
                        <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl">
                            <p className="text-gray-500 mb-3">No Lead Sheets found.</p>
                            <Link
                                to="/admin/add-lead-sheet"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-sm rounded-lg"
                            >
                                <FiPlus size={16} />
                                Create your first Lead Sheet
                            </Link>
                        </div>
                    ) : (
                        leadSheets.map((sheet: any) => (
                            <LeadSheetItem
                                key={sheet.id}
                                id={sheet.id}
                                name={sheet.title}
                                questionCount={sheet.questions?.length ?? 0}
                                updatedAt={sheet.updatedAt}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </main>
            </div>
        </div>
    );
};

export default LeadSheet;
