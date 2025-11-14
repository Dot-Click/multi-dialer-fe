import { useState, useMemo } from 'react';
import { TableProvider } from "@/providers/table.provider";
import { TableComponent } from "@/components/common/tablecomponent";
import { Checkbox } from "@/components/ui/checkbox";
import { FiChevronLeft } from "react-icons/fi";

// === ڈیٹا کا اسٹرکچر ===
interface DeletedItem {
    id: number;
    date: string;
    contacts: number;
}

// === نمونہ ڈیٹا ===
const deletedData: DeletedItem[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    date: '18/06/2021 09:13',
    contacts: 64,
}));

// === مرکزی کمپوننٹ ===
const AdminRestoreData = () => {
    const [selectedRows, setSelectedRows] = useState<{ [key: number]: boolean }>({});

    const selectedCount = Object.values(selectedRows).filter(Boolean).length;

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const allSelected = deletedData.reduce((acc, item) => {
                acc[item.id] = true;
                return acc;
            }, {} as { [key: number]: boolean });
            setSelectedRows(allSelected);
        } else {
            setSelectedRows({});
        }
    };

    const handleSelectRow = (id: number, checked: boolean) => {
        setSelectedRows(prev => ({
            ...prev,
            [id]: checked,
        }));
    };

    // === ٹیبل کالمز ===
    const columns = useMemo(() => [
        {
            id: "select",
            header: () => (
                <div className="flex items-center">
                    <Checkbox
                        checked={selectedCount === deletedData.length}
                        onCheckedChange={(value) => handleSelectAll(!!value)}
                        className="data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-400"
                    />
                </div>
            ),
            cell: ({ row }: any) => (
                <div className="flex items-center">
                    <Checkbox
                        checked={!!selectedRows[row.original.id]}
                        onCheckedChange={(value) => handleSelectRow(row.original.id, !!value)}
                        className="data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-400"
                    />
                </div>
            ),
        },
        {
            accessorKey: "date",
            header: () => <span className="font-semibold text-gray-800">Date</span>,
        },
        {
            accessorKey: "contacts",
            header: () => <span className="font-semibold text-gray-800">Number of Exported Contacts</span>,
            cell: (info: any) => <span className="text-gray-600">{info.getValue()}</span>,
        },
    ], [selectedRows, selectedCount]);

    return (
        <section className="min-h-screen pr-3 py-3 font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* === ہیڈر === */}
                <header className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <button className="text-gray-600 hover:text-black">
                            <FiChevronLeft size={20} />
                        </button>
                        <h1 className="text-xl sm:text-2xl font-medium text-gray-950">
                            Restore deleted data
                        </h1>
                    </div>

                    <button
                        disabled={selectedCount === 0}
                        className="px-5 py-2 w-28 rounded-lg bg-yellow-400 text-black font-medium text-sm 
                                   hover:bg-yellow-500 disabled:bg-yellow-300 disabled:cursor-not-allowed"
                    >
                        Restore ({selectedCount})
                    </button>
                </header>

                {/* === تفصیل === */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">

                    <p className="text-sm text-gray-600 mb-6">
                        Any data deleted in the last 30 days can be restored by clicking Restore next to the date it was deleted.
                    </p>

                    {/* === ٹیبل === */}
                    <div className="overflow-hidden">
                        <div className="overflow-y-auto h-[60vh] custom-scrollbar">
                            <TableProvider data={deletedData} columns={columns}>
                                {() => <TableComponent />}
                            </TableProvider>
                        </div>
                    </div>
                </div>
            </div>

            {/* === کسٹم اسٹائلز (NO JSX ERROR NOW) === */}
            <style>{`
                table thead {
                    background-color: #F9FAFB !important;
                }
                table thead tr th {
                    padding: 12px 16px !important;
                    font-size: 12px !important;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-bottom: 1px solid #E5E7EB !important;
                }
                table thead tr th:first-child {
                    width: 60px;
                }

                table tbody tr td {
                    padding: 14px 16px !important;
                    font-size: 14px !important;
                    color: #4B5563;
                }
                table tbody tr {
                    border-bottom: 1px solid #F3F4F6 !important;
                }
                table tbody tr:last-child {
                    border-bottom: none !important;
                }
            `}</style>
        </section>
    );
};

export default AdminRestoreData;
