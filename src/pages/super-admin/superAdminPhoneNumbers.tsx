import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCallerIdsByUser, deleteAdminCallerId, setSelectedUserId } from "@/store/slices/superAdminCallerIdSlice";
import type { CallerIdRecord } from "@/store/slices/superAdminCallerIdSlice";
import { getAllUsers } from "@/store/slices/userSlice";
import CallerIdModal from "@/components/super-admin/phone-numbers/CallerIdModal";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Phone } from "lucide-react";
import downarrow from "@/assets/downarrow.png";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const SuperAdminPhoneNumbers = () => {
  const dispatch = useAppDispatch();
  const { callerIds, selectedUserId, loading } = useAppSelector((s) => s.superAdminCallerIds);
  const { users } = useAppSelector((s) => s.user);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCallerId, setEditingCallerId] = useState<CallerIdRecord | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Load owner-role users for the selector
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const ownerUsers = users.filter((u) => u.role === "OWNER" || u.role === "ADMIN");

  const selectedUser = ownerUsers.find((u) => u.id === selectedUserId);

  const handleSelectUser = (userId: string) => {
    dispatch(setSelectedUserId(userId));
    dispatch(fetchCallerIdsByUser(userId));
    setUserDropdownOpen(false);
  };

  const handleOpenAdd = () => {
    setEditingCallerId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (caller: CallerIdRecord) => {
    setEditingCallerId(caller);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    const result = await dispatch(deleteAdminCallerId(id));
    setDeleting(false);
    if (deleteAdminCallerId.fulfilled.match(result)) {
      toast.success("Caller ID deleted");
    } else {
      toast.error((result.payload as string) || "Delete failed");
    }
    setConfirmDeleteId(null);
  };

  return (
    <section className="w-full min-h-screen flex flex-col gap-4 px-6 py-6 outfit dark:bg-slate-900 bg-[#F5F6FA]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-[24px] font-[700] text-[#1D2C45] dark:text-white">Phone Numbers</h1>
          <p className="text-[14px] text-gray-500 dark:text-gray-400">
            Manage outbound caller IDs per account
          </p>
        </div>

        {selectedUserId && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[#FFCA06] text-[#1D2C45] font-[600] text-[14px] px-4 py-2.5 rounded-[12px] hover:bg-yellow-400 transition-colors"
          >
            <Plus size={16} />
            Add Number
          </button>
        )}
      </div>

      {/* Account Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-[16px] px-5 py-4 shadow-sm">
        <p className="text-[13px] font-[500] text-gray-500 dark:text-gray-400 mb-2">Select Account</p>
        <div className="relative w-full max-w-sm">
          <button
            onClick={() => setUserDropdownOpen((o) => !o)}
            className="w-full h-[42px] bg-[#F2F2F2] dark:bg-slate-900 rounded-[11px] px-4 flex justify-between items-center text-[14px] text-[#1D2C45] dark:text-white"
          >
            <span>{selectedUser ? `${selectedUser.fullName} (${selectedUser.email})` : "— Choose an account —"}</span>
            <img
              src={downarrow}
              alt="arrow"
              className={`h-1.5 object-contain transition-transform ${userDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {userDropdownOpen && (
            <div className="absolute top-11 left-0 w-full bg-white dark:bg-slate-900 shadow-lg rounded-[12px] z-50 border border-gray-100 dark:border-slate-700 overflow-hidden max-h-[240px] overflow-y-auto custom-scrollbar">
              {ownerUsers.length === 0 ? (
                <div className="px-4 py-3 text-[13px] text-gray-400">No accounts found</div>
              ) : (
                ownerUsers.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUser(u.id)}
                    className={`px-4 py-2.5 cursor-pointer text-[13px] hover:bg-[#FEFCE8] dark:hover:bg-slate-800 transition-colors
                      ${u.id === selectedUserId ? "bg-[#FEFCE8] dark:bg-slate-800 font-[600]" : "text-[#1D2C45] dark:text-white"}`}
                  >
                    <span className="font-[500]">{u.fullName}</span>
                    <span className="text-gray-400 ml-2 text-[12px]">{u.email}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-[16px] px-5 py-4 shadow-sm">
        {!selectedUserId ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Phone size={40} className="mb-3 opacity-30" />
            <p className="text-[15px]">Select an account above to view its phone numbers</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader fullPage={false} />
          </div>
        ) : callerIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Phone size={40} className="mb-3 opacity-30" />
            <p className="text-[15px]">No phone numbers for this account</p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 flex items-center gap-2 bg-[#FFCA06] text-[#1D2C45] font-[600] text-[13px] px-4 py-2 rounded-[10px] hover:bg-yellow-400"
            >
              <Plus size={14} /> Add First Number
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-separate border-spacing-y-2">
              <thead>
                <tr>
                  {["Number", "Label", "Country", "Lines", "Dialer Type", "Status", "Added", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[13px] font-[500] text-[#1D2C45] dark:text-white bg-[#FAF9FE] dark:bg-slate-900 first:rounded-l-[8px] last:rounded-r-[8px] sticky top-0 z-10"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {callerIds.map((caller) => (
                  <tr
                    key={caller.id}
                    className="bg-[#FAFAFA] dark:bg-slate-700 rounded-[9px]"
                  >
                    <td className="px-4 py-3 rounded-l-[9px] text-[13px] font-[500] text-[#1D2C45] dark:text-white whitespace-nowrap">
                      {caller.twillioNumber || <span className="text-gray-400 italic">Not set</span>}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#2C2C2C] dark:text-gray-200">
                      {caller.label}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#2C2C2C] dark:text-gray-200">
                      {caller.countryCode}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#2C2C2C] dark:text-gray-200">
                      {caller.numberOfLines}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#2C2C2C] dark:text-gray-200">
                      {caller.dialerType || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {caller.twillioSid ? (
                        <span className="px-2.5 py-1 rounded-full text-[12px] font-[500] bg-[#D0FAE5] text-[#428E43]">
                          Provisioned
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[12px] font-[500] bg-[#F2F2F2] text-gray-500">
                          Manual
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-gray-400 whitespace-nowrap">
                      {formatDate(caller.createdAt)}
                    </td>
                    <td className="px-4 py-3 rounded-r-[9px]">
                      {confirmDeleteId === caller.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-red-500 font-[500]">Delete?</span>
                          <button
                            onClick={() => handleDelete(caller.id)}
                            disabled={deleting}
                            className="text-[12px] font-[600] text-red-600 hover:underline disabled:opacity-50"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[12px] text-gray-500 hover:underline"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(caller)}
                            className="p-1.5 rounded-[8px] hover:bg-gray-100 dark:hover:bg-slate-600 text-gray-500 dark:text-gray-300"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(caller.id)}
                            className="p-1.5 rounded-[8px] hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedUserId && (
        <CallerIdModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          userId={selectedUserId}
          existing={editingCallerId}
        />
      )}
    </section>
  );
};

export default SuperAdminPhoneNumbers;
