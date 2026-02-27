import { useEffect, useState } from "react";
import { Search, Filter, MoreHorizontal, ChevronDown, Plus, X, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import { useAppSelector } from "@/store/hooks";

export default function Page() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<number | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Agent");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // const session = authClient.useSession()
  const { session } = useAppSelector((state) => state.auth);

  console.log("SESSION:-", session)

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: { limit: 20 }
      });
      if (error) {
        toast.error(error.message || "Failed to fetch users");
      } else if (data) {
        // Filter users created by the logged-in admin
        const filteredUsers = data.users?.filter((u: any) => u.createdById === session?.user?.id) || [];
        setUsers(filteredUsers);
      }
    } catch (err: any) {
      console.error("Fetch Users Error:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchUsers();
    }
  }, [session?.user?.id]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await authClient.admin.createUser({
        name: fullName,
        email,
        password,
        data: {
          role,
          createdById: session?.user?.id
        }
      }, {
        onSuccess: () => {
          toast.success("User created successfully");
          console.log("USERS:-", users);
          setOpenAddUser(false);
          setFullName("");
          setEmail("");
          setPassword("");
          setRole("Agent");
          fetchUsers();
        },
        onError: (error) => {
          toast.error(error.error.message || "Failed to create user");
          console.log(error)
        }
      });

      // if (error) {
      //   toast.error(error.message || "Failed to create user");
      //   // console.error("Create User Error:", error);
      //   console.log(error)
      // } else {
      //   toast.success("User created successfully");
      //   setOpenAddUser(false);
      //   setFullName("");
      //   setEmail("");
      //   setPassword("");
      //   setRole("Agent");
      //   fetchUsers();
      // }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const roles = ["All Roles", "Owner", "Admin", "Agent"];


  return (
    <div className="pr-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl font-semibold">User Management</h1>

        <button
          onClick={() => setOpenAddUser(true)}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-lg font-medium transition"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-5">
        <div className="flex items-center bg-white border rounded-lg px-4 py-2 shadow-sm w-full sm:max-w-md">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email"
            className="ml-2 w-full outline-none"
          />
        </div>

        {/* FILTER ICON → OPENS MODAL */}
        <button
          onClick={() => setOpenFilter(true)}
          className="p-2 border bg-white rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <Filter size={20} />
        </button>

        <button className="flex items-center gap-1 sm:ml-auto text-sm text-gray-600 hover:text-gray-800 transition">
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
          <div className="text-center py-10 text-gray-500 bg-white border rounded-xl shadow-sm">No users found.</div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* LEFT SIDE */}
              <div className="flex-1">

                {/* NAME + BADGE + LAST LOGIN */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">

                  {/* Name + Badge */}
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{user.fullName || user.name || "Unnamed User"}</p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${user.status === "Active" || user.status === "ACTIVE" || !user.status
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-800 text-white"
                        }`}
                    >
                      {user.status || "ACTIVE"}
                    </span>
                  </div>

                  {/* Last Login */}
                  <div className="flex flex-col leading-tight mt-2 sm:mt-0">
                    <p className="text-[10px] uppercase font-bold text-gray-400">Last login</p>
                    <p className="text-sm font-semibold">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                    </p>
                  </div>

                </div>

                {/* Email */}
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
              </div>

              {/* RIGHT SIDE */}
              <div className="relative flex items-center justify-end gap-4 md:gap-6 min-w-[140px]">

                {/* ROLE DROPDOWN */}
                <button
                  onClick={() => setOpenRoleDropdown(user.id === openRoleDropdown ? null : user.id)}
                  className="flex items-center gap-2 border rounded-lg px-3 py-1.5 bg-white hover:bg-gray-50 transition text-sm font-medium"
                >
                  {user.role || "AGENT"} <ChevronDown size={14} className="text-gray-400" />
                </button>

                {/* DROPDOWN MENU */}
                {openRoleDropdown === user.id && (
                  <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-xl w-40 z-20 overflow-hidden">
                    {["OWNER", "ADMIN", "AGENT"].map((r) => (
                      <button
                        key={r}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium transition-colors border-b last:border-none"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                )}

                <button className="p-1 hover:bg-gray-100 rounded-lg transition">
                  <MoreHorizontal size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===========================
          FILTER MODAL POPUP
      ============================ */}
      {openFilter && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-30">
          <div className="bg-white w-80 sm:w-96 rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">

            {/* HEADER */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Filter</h2>
              <button onClick={() => setOpenFilter(false)}>
                <X size={22} />
              </button>
            </div>

            {/* CONTENT */}
            <div className="p-4 overflow-y-auto">

              {/* ROLE */}
              <h3 className="font-medium mb-2">Role</h3>
              <div className="space-y-2 mb-4">
                {roles.map((r) => (
                  <label key={r} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 accent-black h-4" />
                    <span>{r}</span>
                  </label>
                ))}
              </div>

              {/* STATUS */}
              <h3 className="font-medium mb-2">Status</h3>
              <div className="space-y-2 mb-2">
                {["All Statuses", "Active", "Deactivated"].map((s) => (
                  <label key={s} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 accent-black h-4" />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* FOOTER BUTTONS */}
            <div className="flex justify-between p-4 border-t bg-gray-50">
              <button
                onClick={() => setOpenFilter(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300">
                Confirm
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===========================
          ADD USER MODAL POPUP
      ============================ */}
      {openAddUser && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-30">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl max-h-[95vh] overflow-hidden flex flex-col p-6 animate-fadeIn">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add User</h2>
              <button
                onClick={() => setOpenAddUser(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* FORM */}
            <form onSubmit={handleAddUser} className="space-y-4">

              {/* FULL NAME */}
              <div className="bg-gray-100 px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-transparent border-none outline-none text-sm py-1"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="bg-gray-100 px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent border-none outline-none text-sm py-1"
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="bg-gray-100 px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Temporary Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-none outline-none text-sm py-1"
                  required
                />
              </div>

              {/* ROLE */}
              <div className="bg-gray-100 px-4 py-2 rounded-xl focus-within:ring-2 focus-within:ring-yellow-400 transition">
                <label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">User Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm py-1 cursor-pointer appearance-none"
                >
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Agent">Agent</option>
                </select>
              </div>

              {/* FOOTER BUTTONS */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setOpenAddUser(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-200 font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-yellow-400 font-semibold hover:bg-yellow-500 transition flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Adding...
                    </>
                  ) : (
                    "Add User"
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

