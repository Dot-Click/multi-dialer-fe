import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TableProvider } from "@/providers/table.provider";
import { TableComponent } from "@/components/common/tablecomponent";
import { Checkbox } from "@/components/ui/checkbox";
import { FiChevronLeft } from "react-icons/fi";
import type { RootState, AppDispatch } from "@/store/store";
import {
  getAllBackupContacts,
  restoreContact,
} from "@/store/slices/contactSlice";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";

// === مرکزی کمپوننٹ ===
const AdminRestoreData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { backupHistory, isLoading } = useSelector(
    (state: RootState) => state.contacts,
  );

  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    dispatch(getAllBackupContacts());
  }, [dispatch]);

  const tableData = useMemo(() => {
    return (backupHistory || []).map((item: any) => {
      const contact = item.contacts?.[0] || {};
      const name = contact.fullName || "-";
      const email = contact.emails?.[0]?.email || "-";
      const phone = contact.phones?.[0]?.number || "-";
      const listName =
        contact.contactlist?.[0]?.name || contact.contactList?.[0]?.name || "-";
      const deletedAt = item.deletedAt
        ? new Date(item.deletedAt).toLocaleString()
        : "-";
      const deletedBy = item.user?.fullName || "-";

      return {
        id: contact.id,
        name,
        email,
        phone,
        listName,
        deletedAt,
        deletedBy,
      };
    });
  }, [backupHistory]);

  const [selectedRows, setSelectedRows] = useState<{ [key: string]: boolean }>(
    {},
  );

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allSelected = tableData.reduce((acc: any, item: any) => {
        acc[item.id] = true;
        return acc;
      }, {});
      setSelectedRows(allSelected);
    } else {
      setSelectedRows({});
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: checked,
    }));
  };

  const handleRestore = async () => {
    const idsToRestore = Object.entries(selectedRows)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);

    if (idsToRestore.length === 0) return;

    setIsRestoring(true);
    const toastId = toast.loading(
      `Restoring ${idsToRestore.length} contact(s)...`,
    );

    try {
      const promises = idsToRestore.map((id) =>
        dispatch(restoreContact(id)).unwrap(),
      );

      await Promise.all(promises);
      toast.success(
        `${idsToRestore.length} contact(s) restored successfully!`,
        {
          id: toastId,
        },
      );
      setSelectedRows({}); // Clear selection on success
    } catch (error: any) {
      toast.error(`Failed to restore contacts: ${error}`, { id: toastId });
    } finally {
      setIsRestoring(false);
    }
  };

  // === ٹیبل کالمز ===
  const columns = useMemo(
    () => [
      {
        id: "select",
        header: () => (
          <div className="flex items-center">
            <Checkbox
              checked={
                tableData.length > 0 && selectedCount === tableData.length
              }
              onCheckedChange={(value) => handleSelectAll(!!value)}
              className="data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-400"
            />
          </div>
        ),
        cell: ({ row }: any) => (
          <div className="flex items-center">
            <Checkbox
              checked={!!selectedRows[row.original.id]}
              onCheckedChange={(value) =>
                handleSelectRow(row.original.id, !!value)
              }
              className="data-[state=checked]:bg-black data-[state=checked]:text-white border-gray-400"
            />
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: () => <span className="font-semibold text-gray-800">Name</span>,
      },
      {
        accessorKey: "email",
        header: () => (
          <span className="font-semibold text-gray-800">Email</span>
        ),
      },
      {
        accessorKey: "phone",
        header: () => (
          <span className="font-semibold text-gray-800">Phone Number</span>
        ),
      },
      {
        accessorKey: "listName",
        header: () => (
          <span className="font-semibold text-gray-800">Contact List</span>
        ),
      },
      {
        accessorKey: "deletedAt",
        header: () => (
          <span className="font-semibold text-gray-800">Deleted At</span>
        ),
      },
      {
        accessorKey: "deletedBy",
        header: () => (
          <span className="font-semibold text-gray-800">Deleted By</span>
        ),
      },
    ],
    [selectedRows, selectedCount, tableData],
  );

  return (
    <section className="min-h-screen pr-3 py-3 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* === ہیڈر === */}
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-medium text-gray-950">
              Restore deleted data
            </h1>
          </div>

          <button
            onClick={handleRestore}
            disabled={selectedCount === 0 || isRestoring}
            className="px-5 py-2 w-28 rounded-lg bg-yellow-400 text-black font-medium text-sm 
                                   hover:bg-yellow-500 disabled:bg-yellow-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isRestoring ? (
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            ) : (
              `Restore (${selectedCount})`
            )}
          </button>
        </header>

        {/* === تفصیل === */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <p className="text-sm text-gray-600 mb-6">
            Any data deleted in the last 30 days can be restored by clicking
            Restore next to the date it was deleted.
          </p>

          {/* === ٹیبل === */}
          <div className="overflow-hidden">
            <div className="overflow-y-auto h-[60vh] custom-scrollbar">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader fullPage={false} />
                </div>
              ) : tableData.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No deleted contacts found.
                </div>
              ) : (
                <TableProvider data={tableData} columns={columns}>
                  {() => <TableComponent />}
                </TableProvider>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === کسٹم اسٹائلز === */}
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
