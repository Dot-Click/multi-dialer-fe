import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FiEye, FiEyeOff, FiRefreshCw } from "react-icons/fi";
import downarrow from "@/assets/downarrow.png";
import { createUser } from "@/store/slices/userSlice";
import { fetchPlans } from "@/store/slices/subscriptionSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { generateSecurePassword } from "@/components/common/password";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AddUserModal = ({ isOpen, onClose, onSuccess }: AddUserModalProps) => {
  const dispatch = useAppDispatch();
  const { loading, error: apiError } = useAppSelector((state) => state.user);
  const { plans, loading: plansLoading } = useAppSelector((state) => state.subscriptions);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState("");

  // Dropdown states
  const [roleOpen, setRoleOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);

  // Values states
  const [selectedRole, setSelectedRole] = useState("Select Role");
  const [selectedStatus, setSelectedStatus] = useState("Select Status");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPlanLabel, setSelectedPlanLabel] = useState("Select Subscription Plan");
  const [localError, setLocalError] = useState("");

  const roleOptions = ["Agent", "Admin"];
  const statusOptions = ["Active", "Pending", "Suspended", "Expiring Soon"];

  // Fetch plans when modal opens
  useEffect(() => {
    if (isOpen && plans.length === 0) {
      dispatch(fetchPlans());
    }
  }, [isOpen, dispatch, plans.length]);

  // Build plan options from fetched Stripe plans
  // Prefer monthlyStripePriceId, fall back to priceId
  const planOptions = plans
    .filter((p) => p.isActive && (p.monthlyStripePriceId || p.priceId))
    .map((p) => ({
      label: `${p.displayName || p.name} — $${p.monthlyAmount}/mo`,
      priceId: p.monthlyStripePriceId || p.priceId,
    }));

  const handleAddUser = async () => {
    setLocalError("");

    if (!fullName || !email || selectedRole === "Select Role" || selectedStatus === "Select Status") {
      setLocalError("Please fill in all fields");
      return;
    }
    if (!password) {
      setLocalError("Please set a password for this user");
      return;
    }
    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters");
      return;
    }
    if (!selectedPlanId) {
      setLocalError("Please select a subscription plan");
      return;
    }

    try {
      const resultAction = await dispatch(
        createUser({
          fullName,
          email,
          role: selectedRole.toUpperCase(),
          status: selectedStatus.toUpperCase().replace(/\s+/g, "_"),
          password,
          planId: selectedPlanId,
          ...(companyName.trim() ? { companyName: companyName.trim() } : {}),
        }),
      );

      if (createUser.fulfilled.match(resultAction)) {
        onClose();
        if (onSuccess) onSuccess();
        // Reset form
        setFullName("");
        setEmail("");
        setPassword("");
        setCompanyName("");
        setSelectedRole("Select Role");
        setSelectedStatus("Select Status");
        setSelectedPlanId(null);
        setSelectedPlanLabel("Select Subscription Plan");
      }
    } catch (err) {
      console.error("User creation failed:", err);
    }
  };

  const closeAllDropdowns = () => {
    setRoleOpen(false);
    setStatusOpen(false);
    setPlanOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-[450px] rounded-[24px] shadow-xl relative animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-[#111] dark:text-white text-[20px] font-[600]">Add New User</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <IoClose className="text-[22px] text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 flex flex-col gap-4">
          {localError && <p className="text-red-500 text-xs">{localError}</p>}
          {apiError && <p className="text-red-500 text-xs">{apiError}</p>}

          {/* Username */}
          <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2">
            <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">Username</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter username"
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
              placeholder="Enter email address"
              className="bg-transparent outline-none text-[#111] dark:text-white text-[15px] font-[400]"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2">
            <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">Password</label>
            <div className="flex items-center gap-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set a password"
                className="bg-transparent outline-none text-[#111] dark:text-white text-[15px] font-[400] flex-1 min-w-0"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0" tabIndex={-1}>
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
              <button type="button" onClick={() => setPassword(generateSecurePassword())} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0" title="Generate secure password" tabIndex={-1}>
                <FiRefreshCw size={15} />
              </button>
            </div>
          </div>

          {/* Subscription Plan Dropdown */}
          <div className="relative">
            <div
              onClick={() => { setPlanOpen(!planOpen); setRoleOpen(false); setStatusOpen(false); }}
              className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2 cursor-pointer"
            >
              <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">
                Subscription Plan
              </label>
              <div className="flex justify-between items-center">
                <span className={`text-[15px] ${!selectedPlanId ? "text-[#9CA3AF]" : "text-[#111] dark:text-white"}`}>
                  {plansLoading ? "Loading plans…" : selectedPlanLabel}
                </span>
                <img src={downarrow} alt="arrow" className={`h-1.5 transition-transform dark:invert ${planOpen ? "rotate-180" : ""}`} />
              </div>
            </div>

            {planOpen && (
              <div className="absolute top-[60px] left-0 w-full bg-white dark:bg-slate-800 shadow-2xl rounded-[12px] z-50 border border-gray-100 dark:border-slate-700 overflow-hidden py-1 max-h-48 overflow-y-auto">
                {planOptions.length === 0 ? (
                  <div className="px-4 py-3 text-[13px] text-gray-400">
                    {plansLoading ? "Loading…" : "No active plans found"}
                  </div>
                ) : (
                  planOptions.map((opt) => (
                    <div
                      key={opt.priceId}
                      className={`px-4 py-2.5 hover:bg-[#F3F4F6] dark:hover:bg-slate-700 cursor-pointer text-[14px] ${selectedPlanId === opt.priceId ? "text-yellow-600 font-semibold" : "text-[#111] dark:text-white"}`}
                      onClick={() => {
                        setSelectedPlanId(opt.priceId);
                        setSelectedPlanLabel(opt.label);
                        setPlanOpen(false);
                      }}
                    >
                      {opt.label}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <div
              onClick={() => { setRoleOpen(!roleOpen); setStatusOpen(false); setPlanOpen(false); }}
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
                {roleOptions.map((role) => (
                  <div key={role} className="px-4 py-2 hover:bg-[#F3F4F6] dark:hover:bg-slate-700 cursor-pointer text-[14px] text-[#111] dark:text-white"
                    onClick={() => { setSelectedRole(role); setRoleOpen(false); }}>
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Company Name */}
          <div className="flex flex-col gap-1 bg-[#F3F4F6] dark:bg-slate-700 rounded-[12px] px-4 py-2">
            <label className="text-[#6B7280] dark:text-gray-400 text-[12px] font-[500]">Company Name (Optional)</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="bg-transparent outline-none text-[#111] dark:text-white text-[15px] font-[400]"
            />
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
                {statusOptions.map((status) => (
                  <div key={status} className="px-4 py-2 hover:bg-[#F3F4F6] dark:hover:bg-slate-700 cursor-pointer text-[14px] text-[#111] dark:text-white"
                    onClick={() => { setSelectedStatus(status); setStatusOpen(false); }}>
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 flex gap-3 border-t border-gray-100 dark:border-slate-700">
          <button type="button" onClick={() => { closeAllDropdowns(); onClose(); }} disabled={loading}
            className="flex-1 bg-[#F3F4F6] dark:bg-slate-700 text-[#374151] dark:text-white font-[500] py-3 rounded-[12px] hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button type="button" onClick={handleAddUser} disabled={loading}
            className="flex-1 bg-[#FFCA06] text-[#000000] font-[500] py-3 rounded-[12px] hover:bg-[#eab700] transition-colors flex items-center justify-center disabled:opacity-50">
            {loading ? "Creating User..." : "Add User"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
