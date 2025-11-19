import { useState } from "react";
import { Search, Filter, MoreHorizontal, ChevronDown, Plus, X } from "lucide-react";

export default function Page() {
  const [openFilter, setOpenFilter] = useState(false);
  const [openRoleDropdown, setOpenRoleDropdown] = useState<number | null>(null);

  const users = [
    { id: 1, name: "Kathryn Murphy", email: "michael.mitic@example.com", status: "Active", lastLogin: "09/09/2025", role: "Owner" },
    { id: 2, name: "Kathryn Murphy", email: "michael.mitic@example.com", status: "Active", lastLogin: "09/09/2025", role: "Admin" },
    { id: 3, name: "Kathryn Murphy", email: "michael.mitic@example.com", status: "Deactivated", lastLogin: "09/09/2025", role: "Agent" },
    { id: 4, name: "Kathryn Murphy", email: "michael.mitic@example.com", status: "Active", lastLogin: "09/09/2025", role: "Owner" },
  ];

  const roles = ["All Roles", "Owner", "Admin", "Agent"];


  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl font-semibold">User Management</h1>

        <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 px-4 py-2 rounded-lg font-medium transition">
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
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white border rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* LEFT SIDE */}
            <div>

              {/* NAME + BADGE + LAST LOGIN */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">

                {/* Name + Badge */}
                <div className="flex items-center gap-2">
                  <p className="font-medium">{user.name}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-800 text-white"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>

                {/* Last Login */}
                <div className="flex flex-col leading-tight mt-2 sm:mt-0">
                  <p className="text-xs text-gray-500">Last login</p>
                  <p className="text-sm font-semibold">{user.lastLogin}</p>
                </div>

              </div>

              {/* Email */}
              <p className="text-sm text-gray-500 mt-1">{user.email}</p>
            </div>

            {/* RIGHT SIDE */}
            <div className="relative flex items-center gap-4 md:gap-6">
              
              {/* ROLE DROPDOWN */}
              <button
                onClick={() => setOpenRoleDropdown(user.id === openRoleDropdown ? null : user.id)}
                className="flex items-center gap-1 border rounded-lg px-3 py-1 bg-white hover:bg-gray-50 transition text-sm"
              >
                {user.role} <ChevronDown size={16} />
              </button>

              {/* DROPDOWN MENU */}
              {openRoleDropdown === user.id && (
                <div className="absolute right-14 top-10 bg-white border rounded-lg shadow-lg w-36 z-20">
                  {roles.map((r) => (
                    <button
                      key={r}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              )}

              <button>
                <MoreHorizontal size={22} className="text-gray-600" />
              </button>
            </div>
          </div>
        ))}
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
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span>{r}</span>
                  </label>
                ))}
              </div>

              {/* STATUS */}
              <h3 className="font-medium mb-2">Status</h3>
              <div className="space-y-2 mb-2">
                {["All Statuses", "Active", "Deactivated"].map((s) => (
                  <label key={s} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
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

    </div>
  );
}
