import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/store/hooks";
import api from "@/lib/axios";

type ManagedUser = {
  id: string;
  fullName?: string | null;
  name?: string | null;
  email?: string;
  role?: string | null;
  status?: string | null;
  lastLogin?: string | null;
  createdById?: string | null;
};

const ROLE_FILTERS = ["All Roles", "Admin", "Agent"];
const ROLE_OPTIONS = ["Admin", "Agent"];

export default function Page() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<number | null>(null);
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Agent");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Shown when creating an agent hits the plan's seat cap but the plan
  // offers a paid overage seat — confirms the charge before retrying
  // creation with the purchased seat attached.
  const [seatPurchase, setSeatPurchase] = useState<{
    open: boolean;
    priceCents: number | null;
    purchasing: boolean;
  }>({ open: false, priceCents: null, purchasing: false });

  const { session } = useAppSelector((state) => state.auth);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await api.get("/user");
      setUsers(res.data?.data || []);
    } catch (err: any) {
      console.error("Fetch Users Error:", err);
      toast.error(
        err.response?.data?.message || err.message || "Failed to fetch users",
      );
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchUsers();
    }
  }, [session?.user?.id]);

  const closeModal = () => {
    setOpenUserModal(false);
    setEditingUser(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("Agent");
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("Agent");
    setOpenActionMenu(null);
    setOpenRoleDropdown(null);
    setOpenUserModal(true);
  };

  const openEditModal = (user: ManagedUser) => {
    setEditingUser(user);
    setFullName(user.fullName || user.name || "");
    setEmail(user.email || "");
    const normalizedRole = user.role?.toUpperCase();
    setRole(normalizedRole === "ADMIN" ? "Admin" : "Agent");
    setPassword("");
    setOpenActionMenu(null);
    setOpenRoleDropdown(null);
    setOpenUserModal(true);
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const isEditing = Boolean(editingUser);
    if (!fullName || !email || (!isEditing && !password)) {
      toast.error(
        isEditing ? "Please fill in all required fields" : "Please fill in all fields",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && editingUser) {
        await api.put(`/user/${editingUser.id}`, {
          fullName,
          email,
          role: role.toUpperCase(),
          ...(password ? { password } : {}),
        });
        toast.success("User updated successfully");
      } else {
        const result = await authClient.admin.createUser({
          name: fullName,
          email,
          password,
          data: {
            role: role.toUpperCase(),
            createdById: session?.user?.id,
          },
        });

        if (result?.error) {
          throw new Error(result.error.message || "Failed to create user");
        }

        toast.success("User created successfully");
      }

      closeModal();
      fetchUsers();
    } catch (err: any) {
      const message = err.message || "An unexpected error occurred";

      // Seat cap hit, but this plan offers paid overage seats (backend only
      // uses this exact phrasing when extraAgentSeatPriceCents is set) — offer
      // to purchase one instead of just failing.
      if (!isEditing && message.includes("Purchase an extra seat")) {
        setOpenUserModal(false);
        setSeatPurchase({ open: true, priceCents: null, purchasing: false });
        try {
          const res = await api.get("/plan-limits/mine");
          setSeatPurchase((s) => ({ ...s, priceCents: res.data?.data?.extraAgentSeatPriceCents ?? null }));
        } catch {
          // Price display is best-effort; the purchase call itself still works without it.
        }
        return;
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmSeatPurchaseAndCreateAgent = async () => {
    setSeatPurchase((s) => ({ ...s, purchasing: true }));
    try {
      const purchaseRes = await api.post("/agent-seats/purchase");
      const { stripeSubscriptionItemId, agentSeatMonthlyPriceCents } = purchaseRes.data?.data || {};

      const result = await authClient.admin.createUser({
        name: fullName,
        email,
        password,
        data: {
          role: role.toUpperCase(),
          createdById: session?.user?.id,
          stripeAgentSeatItemId: stripeSubscriptionItemId,
          agentSeatMonthlyPriceCents,
        },
      });

      if (result?.error) {
        throw new Error(result.error.message || "Failed to create agent after purchasing the seat");
      }

      toast.success("Extra agent seat purchased and agent created");
      setSeatPurchase({ open: false, priceCents: null, purchasing: false });
      closeModal();
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to purchase the extra seat");
      setSeatPurchase((s) => ({ ...s, purchasing: false }));
    }
  };

  const handleUpdateUserRole = async (user: ManagedUser, nextRole: string) => {
    try {
      await api.put(`/user/${user.id}`, { role: nextRole });
      toast.success(`Role updated to ${nextRole}`);
      setOpenRoleDropdown(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to update role");
    }
  };

  return (
    <div className="pr-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl font-semibold dark:text-white">
          User Management
        </h1>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 dark:text-black px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-5">
        <div className="flex items-center bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg px-4 py-2 shadow-sm w-full sm:max-w-md">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email"
            className="ml-2 w-full outline-none bg-transparent dark:text-white dark:placeholder-gray-400"
          />
        </div>

        <button
          onClick={() => setOpenFilter(true)}
          className="p-2 border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition"
        >
          <Filter size={20} className="dark:text-gray-300" />
        </button>

        <button className="flex items-center gap-1 sm:ml-auto text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition">
          Sort by <ChevronDown size={16} />
        </button>
      </div>

      {/* USER LIST */}
      <div className="mt-6 space-y-3">
        {isLoadingUsers ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-gray-400" size={32} />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl shadow-sm">
            No users found.
          </div>
        ) : (
          users.map((user, idx) => {
            const currentRole = (user.role || "AGENT").toUpperCase();

            return (
              <div
                key={user.id}
                className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* LEFT SIDE */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.fullName || user.name || "Unnamed User"}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          user.status === "Active" ||
                          user.status === "ACTIVE" ||
                          !user.status
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-800 text-white dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {user.status || "ACTIVE"}
                      </span>
                    </div>

                    <div className="flex flex-col leading-tight mt-2 sm:mt-0">
                      <p className="text-[10px] uppercase font-bold text-gray-400">
                        Last login
                      </p>
                      <p className="text-sm font-semibold dark:text-gray-300">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {user.email}
                  </p>
                </div>

                {/* RIGHT SIDE */}
                <div className="relative flex items-center justify-end gap-4 md:gap-6 min-w-[140px]">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        setOpenRoleDropdown(
                          openRoleDropdown === idx ? null : idx,
                        );
                        setOpenActionMenu(null);
                      }}
                      className="flex items-center gap-2 border dark:border-slate-700 rounded-lg px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition text-sm font-medium dark:text-white"
                    >
                      {currentRole}{" "}
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>

                    {openRoleDropdown === idx && (
                      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-xl w-40 z-20 overflow-hidden">
                        {ROLE_OPTIONS.map((r) => (
                          <button
                            key={r}
                            onClick={() => handleUpdateUserRole(user, r.toUpperCase())}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm font-medium transition-colors border-b dark:border-slate-700 last:border-none dark:text-white"
                          >
                            {r.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setOpenActionMenu(openActionMenu === user.id ? null : user.id);
                        setOpenRoleDropdown(null);
                      }}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition relative"
                    >
                      <MoreHorizontal size={20} className="text-gray-400" />
                    </button>

                    {openActionMenu === user.id && (
                      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-xl w-44 z-20 overflow-hidden">
                        <button
                          onClick={() => openEditModal(user)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700 text-sm font-medium transition-colors dark:text-white"
                        >
                          Edit User
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FILTER MODAL POPUP */}
      {openFilter && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-30">
          <div className="bg-white dark:bg-slate-800 w-80 sm:w-96 rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
              <h2 className="text-lg font-semibold dark:text-white">Filter</h2>
              <button
                className="dark:text-gray-300 dark:hover:text-white transition"
                onClick={() => setOpenFilter(false)}
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              <h3 className="font-medium mb-2 dark:text-gray-200">Role</h3>
              <div className="space-y-2 mb-4">
                {ROLE_FILTERS.map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2 dark:text-gray-300"
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 accent-black dark:accent-yellow-400 h-4"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>

              <h3 className="font-medium mb-2 dark:text-gray-200">Status</h3>
              <div className="space-y-2 mb-2">
                {["All Statuses", "Active", "Deactivated"].map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2 dark:text-gray-300"
                  >
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 accent-black dark:accent-yellow-400 h-4"
                    />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-between p-4 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-800">
              <button
                onClick={() => setOpenFilter(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 transition"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 dark:text-black transition">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT USER MODAL */}
      {openUserModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-30">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl max-h-[95vh] overflow-hidden flex flex-col p-6 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-white">
                {editingUser ? "Edit User" : "Add User"}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 dark:text-gray-300 dark:hover:text-white rounded-full transition"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmitUser} className="space-y-4">
              <div className="bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-transparent border-none outline-none text-sm dark:text-white dark:placeholder-gray-400 py-1"
                  required
                />
              </div>

              <div className="bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent border-none outline-none text-sm dark:text-white dark:placeholder-gray-400 py-1"
                  required
                />
              </div>

              {!editingUser && (
                <div className="bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-yellow-400 transition">
                  <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                    Temporary Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter temporary password"
                    className="w-full bg-transparent border-none outline-none text-sm dark:text-white dark:placeholder-gray-400 py-1"
                    required
                  />
                </div>
              )}

              <div className="bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <label className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
                  User Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm dark:text-white [&>option]:dark:bg-slate-800 py-1 cursor-pointer appearance-none"
                >
                  {ROLE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-yellow-400 dark:text-black font-semibold hover:bg-yellow-500 transition flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      {editingUser ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    editingUser ? "Update User" : "Add User"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEAT PURCHASE CONFIRMATION MODAL */}
      {seatPurchase.open && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-40">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl shadow-xl p-6 animate-fadeIn">
            <h2 className="text-lg font-semibold dark:text-white mb-2">
              Agent Seat Limit Reached
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              You've used all the agent seats included in your plan. Adding another agent costs{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {seatPurchase.priceCents != null ? `$${(seatPurchase.priceCents / 100).toFixed(2)}/mo` : "an extra fee"}
              </span>
              . Proceed with the charge?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSeatPurchase({ open: false, priceCents: null, purchasing: false })}
                disabled={seatPurchase.purchasing}
                className="flex-1 py-3 rounded-xl bg-gray-200 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600 font-semibold hover:bg-gray-300 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmSeatPurchaseAndCreateAgent}
                disabled={seatPurchase.purchasing}
                className="flex-1 py-3 rounded-xl bg-yellow-400 dark:text-black font-semibold hover:bg-yellow-500 transition flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {seatPurchase.purchasing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  "Pay & Add Agent"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
