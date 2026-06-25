import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import downarrow from "@/assets/downarrow.png";
import { updateUser, setUserPassword, updateUserSubscription } from "@/store/slices/userSlice";
import { fetchPlans, type Plan } from "@/store/slices/subscriptionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import toast from "react-hot-toast";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user: {
    id: string;
    fullName?: string;
    email?: string;
    role?: string;
    status?: string;
    userSubscriptions?: { plan: string; status: string }[];
    billings?: { planName: string | null }[];
  } | null;
}

const EditUserModal = ({ isOpen, onClose, onSuccess, user }: EditUserModalProps) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);
  const { plans } = useAppSelector((state) => state.subscriptions);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [roleOpen, setRoleOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Select Role");
  const [selectedStatus, setSelectedStatus] = useState("Select Status");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const roleOptions = ["Agent", "Admin", "Owner"];
  const statusOptions = ["Active", "Pending", "Suspended", "Expiring Soon"];

  // Load plans when modal opens
  useEffect(() => {
    if (isOpen && plans.length === 0) {
      dispatch(fetchPlans());
    }
  }, [isOpen]);

  // Populate fields when the user prop changes
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setSelectedRole(user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : "Select Role");
      setSelectedStatus(user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1).toLowerCase().replace(/_/g, " ") : "Select Status");
      setSelectedPlanId(null);
      setNewPassword("");
      setShowPassword(false);
      setLocalError("");
    }
  }, [user]);

  // Pre-select the user's current plan once both user data and plans list are available
  useEffect(() => {
    if (!user || plans.length === 0) return;
    const currentPlanName =
      user.billings?.[0]?.planName ||
      user.userSubscriptions?.[0]?.plan ||
      null;
    if (!currentPlanName) return;
    const match = plans.find(
      (p: Plan) => p.name?.toLowerCase() === currentPlanName.toLowerCase()
    );
    if (match) {
      setSelectedPlanId(match.monthlyStripePriceId || match.priceId || match.id);
    }
  }, [user, plans]);

  const handleSave = async () => {
    setLocalError("");

    if (!fullName.trim()) { setLocalError("Name is required"); return; }
    if (!email.trim()) { setLocalError("Email is required"); return; }
    if (selectedRole === "Select Role") { setLocalError("Please select a role"); return; }
    if (selectedStatus === "Select Status") { setLocalError("Please select a status"); return; }
    if (newPassword && newPassword.length < 8) { setLocalError("Password must be at least 8 characters"); return; }

    try {
      const result = await dispatch(updateUser({
        id: user!.id,
        data: {
          fullName: fullName.trim(),
          email: email.trim(),
          role: selectedRole.toUpperCase(),
          status: selectedStatus.toUpperCase().replace(/\s+/g, "_"),
        },
      }));

      if (updateUser.fulfilled.match(result)) {
        // Change password via dedicated endpoint if provided
        if (newPassword) {
          const pwResult = await dispatch(setUserPassword({ id: user!.id, password: newPassword }));
          if (setUserPassword.rejected.match(pwResult)) {
            toast.error((pwResult.payload as string) || "Failed to update password");
            return;
          }
        }
        // Update subscription plan if changed
        if (selectedPlanId) {
          const subResult = await dispatch(updateUserSubscription({ id: user!.id, planId: selectedPlanId }));
          if (updateUserSubscription.rejected.match(subResult)) {
            toast.error((subResult.payload as string) || "Failed to update subscription");
            return;
          }
        }
        toast.success("User updated successfully");
        onClose();
        onSuccess?.();
      } else {
        setLocalError((result.payload as string) || "Failed to update user");
      }
    } catch {
      setLocalError("An unexpected error occurred");
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-[450px] rounded-[24px] shadow-xl relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-[#111] dark:text-white text-[20px] font-[600]">Edit User</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <IoClose className="text-[22px] text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          {localError && <p className="text-red-500 text-xs">{localError}</p>}

          {/* Full Name */}
          <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2">
            <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              className="bg-transparent outline-none text-[#111] dark:text-white text-[15px] font-[400]"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2">
            <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="bg-transparent outline-none text-[#111] dark:text-white text-[15px] font-[400]"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2">
            <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">
              New Password <span className="text-[10px] text-[#9CA3AF]">(leave blank to keep current)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="bg-transparent outline-none text-[#111] dark:text-white text-[15px] font-[400] flex-1"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-[#9CA3AF] hover:text-[#6B7280] dark:hover:text-gray-300 transition-colors shrink-0"
              >
                {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
              </button>
            </div>
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <div
              onClick={() => { setRoleOpen(!roleOpen); setStatusOpen(false); }}
              className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2 cursor-pointer"
            >
              <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">Role</label>
              <div className="flex justify-between items-center">
                <span className={`text-[15px] ${selectedRole === "Select Role" ? "text-[#9CA3AF]" : "text-[#111] dark:text-white"}`}>
                  {selectedRole}
                </span>
                <img src={downarrow} alt="arrow" className={`h-1.5 transition-transform dark:invert ${roleOpen ? "rotate-180" : ""}`} />
              </div>
            </div>
            {roleOpen && (
              <div className="absolute top-[60px] left-0 w-full bg-white dark:bg-slate-800 shadow-2xl rounded-[12px] z-50 border border-gray-100 dark:border-slate-700 overflow-hidden py-1">
                {roleOptions.map((r) => (
                  <div key={r} className="px-4 py-2 hover:bg-[#F3F4F6] dark:hover:bg-slate-700 cursor-pointer text-[14px] text-[#111] dark:text-white"
                    onClick={() => { setSelectedRole(r); setRoleOpen(false); }}>
                    {r}
                  </div>
                ))}
              </div>
            )}
            {selectedRole === "Owner" && (
              <p className="text-[11px] text-amber-500 dark:text-amber-400 mt-1 px-1">
                Super role — grants full platform access. Use with caution.
              </p>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <div
              onClick={() => { setStatusOpen(!statusOpen); setRoleOpen(false); setPlanOpen(false); }}
              className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2 cursor-pointer"
            >
              <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">Status</label>
              <div className="flex justify-between items-center">
                <span className={`text-[15px] ${selectedStatus === "Select Status" ? "text-[#9CA3AF]" : "text-[#111] dark:text-white"}`}>
                  {selectedStatus}
                </span>
                <img src={downarrow} alt="arrow" className={`h-1.5 transition-transform dark:invert ${statusOpen ? "rotate-180" : ""}`} />
              </div>
            </div>
            {statusOpen && (
              <div className="absolute top-[60px] left-0 w-full bg-white dark:bg-slate-800 shadow-2xl rounded-[12px] z-50 border border-gray-100 dark:border-slate-700 overflow-hidden py-1">
                {statusOptions.map((s) => (
                  <div key={s} className="px-4 py-2 hover:bg-[#F3F4F6] dark:hover:bg-slate-700 cursor-pointer text-[14px] text-[#111] dark:text-white"
                    onClick={() => { setSelectedStatus(s); setStatusOpen(false); }}>
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subscription Plan Dropdown */}
          <div className="relative">
            <div
              onClick={() => { setPlanOpen(!planOpen); setRoleOpen(false); setStatusOpen(false); }}
              className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2 cursor-pointer"
            >
              <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">
                Subscription Plan <span className="text-[10px] text-[#9CA3AF]">(change only if needed)</span>
              </label>
              <div className="flex justify-between items-center">
                <span className={`text-[15px] ${!selectedPlanId ? "text-[#9CA3AF]" : "text-[#111] dark:text-white"}`}>
                  {selectedPlanId
                    ? plans.find((p: Plan) => p.priceId === selectedPlanId || p.monthlyStripePriceId === selectedPlanId || p.id === selectedPlanId)?.name ?? selectedPlanId
                    : "No change"}
                </span>
                <img src={downarrow} alt="arrow" className={`h-1.5 transition-transform dark:invert ${planOpen ? "rotate-180" : ""}`} />
              </div>
            </div>
            {planOpen && (
              <div className="absolute top-[60px] left-0 w-full bg-white dark:bg-slate-800 shadow-2xl rounded-[12px] z-50 border border-gray-100 dark:border-slate-700 overflow-hidden py-1 max-h-[180px] overflow-y-auto">
                <div
                  className="px-4 py-2 hover:bg-[#F3F4F6] dark:hover:bg-slate-700 cursor-pointer text-[14px] text-[#9CA3AF]"
                  onClick={() => { setSelectedPlanId(null); setPlanOpen(false); }}
                >
                  No change
                </div>
                {plans.map((p: Plan) => {
                  const priceId = p.monthlyStripePriceId || p.priceId || p.id;
                  return (
                    <div
                      key={priceId}
                      className="px-4 py-2 hover:bg-[#F3F4F6] dark:hover:bg-slate-700 cursor-pointer text-[14px] text-[#111] dark:text-white"
                      onClick={() => { setSelectedPlanId(priceId); setPlanOpen(false); }}
                    >
                      {p.name}
                      {p.monthlyAmount != null && (
                        <span className="ml-2 text-[12px] text-[#6B7280]">
                          ${Number(p.monthlyAmount || 0).toLocaleString()}/mo
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 flex gap-3 border-t border-gray-100 dark:border-slate-700">
          <button type="button" onClick={onClose} disabled={loading}
            className="flex-1 bg-[#F3F4F6] dark:bg-slate-700 text-[#374151] dark:text-white font-[500] py-3 rounded-[12px] hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button type="button" onClick={handleSave} disabled={loading}
            className="flex-1 bg-[#FFCA06] text-[#000000] font-[500] py-3 rounded-[12px] hover:bg-[#eab700] transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
