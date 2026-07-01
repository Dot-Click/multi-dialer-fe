import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCallerIdsByUser, deleteAdminCallerId, updateAdminCallerId, setSelectedUserId } from "@/store/slices/superAdminCallerIdSlice";
import type { CallerIdRecord } from "@/store/slices/superAdminCallerIdSlice";
import AddCallScoutNumberModal from "@/components/admin/systemsettings/AddCallScoutNumberModal";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Phone, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; fullName?: string | null; email?: string | null } | null;
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const PhoneNumbersModal = ({ isOpen, onClose, user }: Props) => {
  const dispatch = useAppDispatch();
  const { callerIds, loading, saving } = useAppSelector((s) => s.superAdminCallerIds);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingCallerId, setEditingCallerId] = useState<CallerIdRecord | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isOpen && user?.id) {
      dispatch(setSelectedUserId(user.id));
      dispatch(fetchCallerIdsByUser(user.id));
    }
  }, [isOpen, user?.id, dispatch]);

  if (!isOpen || !user) return null;

  const handleAddSuccess = () => {
    setAddModalOpen(false);
    dispatch(fetchCallerIdsByUser(user.id));
  };

  const handleOpenEdit = (caller: CallerIdRecord) => {
    setEditingCallerId(caller);
    setEditLabel(caller.label ?? "");
  };

  const handleSaveLabel = async () => {
    if (!editingCallerId) return;
    if (!editLabel.trim()) {
      toast.error("Label is required");
      return;
    }
    const result = await dispatch(updateAdminCallerId({ id: editingCallerId.id, label: editLabel.trim() }));
    if (updateAdminCallerId.fulfilled.match(result)) {
      toast.success("Label updated");
      setEditingCallerId(null);
    } else {
      toast.error((result.payload as string) || "Update failed");
    }
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
    <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-[24px] w-full max-w-[900px] max-h-[85vh] overflow-y-auto custom-scrollbar shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-[18px] font-[700] text-[#1D2C45] dark:text-white">
              Phone Numbers
            </h2>
            <p className="text-[13px] text-gray-500 dark:text-gray-400">
              {user.fullName} ({user.email})
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-2 bg-[#FFCA06] text-[#1D2C45] font-[600] text-[13px] px-4 py-2 rounded-[10px] hover:bg-yellow-400 transition-colors"
            >
              <Plus size={16} />
              Add Number
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader fullPage={false} />
          </div>
        ) : callerIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Phone size={40} className="mb-3 opacity-30" />
            <p className="text-[15px]">No phone numbers for this account</p>
            <button
              onClick={() => setAddModalOpen(true)}
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
                  <tr key={caller.id} className="bg-[#FAFAFA] dark:bg-slate-700 rounded-[9px]">
                    <td className="px-4 py-3 rounded-l-[9px] text-[13px] font-[500] text-[#1D2C45] dark:text-white whitespace-nowrap">
                      {caller.twillioNumber || <span className="text-gray-400 italic">Not set</span>}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#2C2C2C] dark:text-gray-200">
                      {editingCallerId?.id === caller.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            autoFocus
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSaveLabel()}
                            className="h-[30px] w-[140px] rounded-[8px] border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 text-[13px] text-[#1D2C45] dark:text-white outline-none focus:border-[#FFCA06]"
                          />
                          <button
                            onClick={handleSaveLabel}
                            disabled={saving}
                            className="text-[12px] font-[600] text-[#428E43] hover:underline disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCallerId(null)}
                            className="text-[12px] text-gray-500 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        caller.label
                      )}
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
                            title="Edit label"
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

      <AddCallScoutNumberModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={handleAddSuccess}
        userId={user.id}
      />
    </div>
  );
};

export default PhoneNumbersModal;
