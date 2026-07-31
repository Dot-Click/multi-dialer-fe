// Your existing table components
import { TableComponent } from "@/components/common/tablecomponent";
import { Box } from "@/components/ui/box";
import { TableProvider } from "@/providers/table.provider";
// Icons from react-icons
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { BsThreeDots } from 'react-icons/bs';
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActionPlans } from "@/hooks/useSystemSettings";
import toast from "react-hot-toast";

// --- Row action menu — Edit / Delete ---
const ActionsCell = ({ plan }: { plan: any }) => {
    const navigate = useNavigate();
    const { deleteActionPlan } = useActionPlans();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const handleDelete = () => {
        if (!window.confirm(`Delete "${plan.name}"? This cannot be undone.`)) return;
        deleteActionPlan.mutate(plan.id, {
            onSuccess: () => toast.success('Action Plan deleted.'),
            onError: (err: any) => toast.error(err?.response?.data?.message || err?.message || 'Failed to delete plan.'),
        });
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="text-gray-500 dark:text-gray-400 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
                <BsThreeDots size={18} />
            </button>
            {open && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-50">
                    <button
                        onClick={() => { setOpen(false); navigate(`/admin/action-plan/${plan.id}`); }}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <FiEdit2 size={14} /> Edit
                    </button>
                    <button
                        onClick={() => { setOpen(false); handleDelete(); }}
                        className="w-full flex items-center gap-2 px-3.5 py-2.5 text-[13px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <FiTrash2 size={14} /> Delete
                    </button>
                </div>
            )}
        </div>
    );
};

// --- Column Definitions for the Table ---
const columns = [
    {
        accessorKey: "name",
        header: () => <div className="font-semibold dark:text-gray-300">Name</div>,
        cell: (info: any) => <div className="font-medium text-gray-800 dark:text-gray-200">{info.getValue()}</div>,
    },
    {
        accessorKey: "stepsCount", // Assuming backend sends stepsCount
        header: () => <div className="font-semibold dark:text-gray-300">Steps</div>,
        cell: (info: any) => <div className="dark:text-gray-400">{info.row.original._count?.steps ?? info.getValue() ?? 0}</div>,
    },
    {
        accessorKey: "contactCount", // Assuming backend sends contactCount
        header: () => <div className="font-semibold dark:text-gray-300">Contact</div>,
    },
    {
        accessorKey: "updatedAt",
        header: () => <div className="font-semibold dark:text-gray-300">Edit Date</div>,
        cell: (info: any) => <div className="dark:text-gray-400">{new Date(info.getValue()).toLocaleDateString()}</div>
    },
    {
        id: "actions",
        cell: (info: any) => <ActionsCell plan={info.row.original} />,
    },
];


// --- Main ActionPlan Component ---
const ActionPlan = () => {
    const navigate = useNavigate();
    const { data: actionPlans, isLoading, isError, error } = useActionPlans();

    if (isLoading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading Action Plans...</div>;
    if (isError) return <div className="p-8 text-center text-red-500 dark:text-red-400">Error: {(error as any)?.message || 'Failed to fetch action plans'}</div>;

    return (
        <div className="px-4 py-5 bg-white dark:bg-slate-900 rounded-lg min-h-screen">
            <Box className="  w-full h-full ">

                {/* Custom Styles for the table */}
                <style>
                    {`
            /* Custom Scrollbar for the table container */
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }

            /* Table Header Styling */
            table thead tr th {
              background-color: var(--tw-bg-opacity, #F9FAFB) !important; /* Light grey background */
              padding: 12px 16px !important;
              font-size: 13px;
              color: var(--tw-text-opacity, #4B5563) !important; /* Grey text color */
              text-align: left;
              border-bottom: 1px solid var(--tw-border-opacity, #E5E7EB) !important;
            }

            .dark table thead tr th {
                background-color: #0f172a !important; /* slate-900 */
                color: #94a3b8 !important; /* slate-400 */
                border-bottom: 1px solid #1e293b !important; /* slate-800 */
            }

            /* Table Body Styling */
            table tbody tr td {
              padding: 16px 16px !important;
              font-size: 14px;
              color: var(--tw-text-opacity, #374151) !important;
              border-bottom: 1px solid var(--tw-border-opacity, #F3F4F6) !important;
            }

            .dark table tbody tr td {
                color: #cbd5e1 !important; /* slate-300 */
                border-bottom: 1px solid #1e293b !important; /* slate-800 */
            }
            
            /* Remove border from the last row */
            table tbody tr:last-child {
              border-bottom: none !important;
            }

            .dark table tbody tr:hover td {
                background-color: #1e293b !important; /* slate-800 */
            }
          `}
                </style>

                {/* Header Section */}
                <header className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Action Plan</h1>
                    <button onClick={() => navigate("/admin/action-plan")} className="w-full sm:w-auto bg-yellow-400 text-black font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors text-sm">
                        <FiPlus size={18} />
                        Create Action Plan
                    </button>
                </header>

                {/* Table Section */}
                <main>
                    {/* Wrapper for responsiveness and custom scrollbar */}
                    <div className="overflow-x-auto custom-scrollbar">
                        {actionPlans?.length === 0 ? (
                            <div className="text-center py-10 border border-dashed border-gray-300 dark:border-slate-700 rounded-xl">
                                <p className="text-gray-500 dark:text-gray-400">No Action Plans found.</p>
                            </div>
                        ) : (
                            <TableProvider data={actionPlans || []} columns={columns}>
                                {() => <TableComponent />}
                            </TableProvider>
                        )}
                    </div>
                </main>
            </Box>
        </div>
    );
};

export default ActionPlan;
