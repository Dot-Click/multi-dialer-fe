import { useState, useEffect, useRef, useMemo, Fragment } from "react";
import { ChevronRight, ChevronDown, CornerDownRight } from "lucide-react";
import UserManagementHeader from "@/components/super-admin/user-management/UserManagementHeader";
import UserInvoicesModal from "@/components/super-admin/user-management/UserInvoicesModal";
import PhoneNumbersModal from "@/components/super-admin/user-management/PhoneNumbersModal";
import EditUserModal from "@/components/modal/editUserModal";
import ChangeCardModal from "@/components/super-admin/subscription/ChangeCardModal";
import searchIcon from "@/assets/searchIcon.png";
import downarrow from "@/assets/downarrow.png";
import tableIcon from "@/assets/tableIcon.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useUser } from "@/hooks/useUser";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { getAllUsers } from "@/store/slices/userSlice";
import Loader from "@/components/common/Loader";

const getStatusStyles = (status?: string | null) => {
  const normalizedStatus = status?.toUpperCase() || "";
  switch (normalizedStatus) {
    case "ACTIVE":
      return "bg-[#D0FAE5] text-[#428E43]";
    case "PENDING":
      return "bg-[#FEF9C2] text-[#BA5F44]";
    case "SUSPENDED":
      return "bg-[#FEE9EA] text-[#C10057]";
    case "EXPIRING SOON":
      return "bg-[#FFF0E6] text-[#D43500]";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const formatStatus = (status?: string | null) => {
  if (!status) return "-";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const SuperAdminUserManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user,
  );
  const { deleteUser } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedRole, setSelectedRole] = useState("All Roles");

  const [statusOpen, setStatusOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [openMenuUserId, setOpenMenuUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [invoicesUser, setInvoicesUser] = useState<any | null>(null);
  const [phoneNumbersUser, setPhoneNumbersUser] = useState<any | null>(null);
  const [changeCardUser, setChangeCardUser] = useState<any | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLTableCellElement | null }>({});

  const fetchUsers = async () => {
    dispatch(getAllUsers());
  };

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuUserId && menuRefs.current[openMenuUserId]) {
        if (!menuRefs.current[openMenuUserId]?.contains(event.target as Node)) {
          setOpenMenuUserId(null);
        }
      }
    };

    if (openMenuUserId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuUserId]);

  const [expandedAdmins, setExpandedAdmins] = useState<Set<string>>(new Set());

  const toggleAdmin = (adminId: string) => {
    setExpandedAdmins((prev) => {
      const next = new Set(prev);
      next.has(adminId) ? next.delete(adminId) : next.add(adminId);
      return next;
    });
  };

  const matchesText = (u: any) => {
    const q = searchTerm.toLowerCase();
    if (!q) return true;
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q) ||
      u.status?.toLowerCase().includes(q)
    );
  };

  // Group agents under the admin that created them.
  const agentsByAdmin = useMemo(() => {
    const map: Record<string, any[]> = {};
    users.forEach((u: any) => {
      if ((u.role || "").toUpperCase() === "AGENT" && u.createdById) {
        (map[u.createdById] ||= []).push(u);
      }
    });
    return map;
  }, [users]);

  // When searching or filtering by Agent, auto-expand so matches are visible.
  const forceExpand = !!searchTerm || selectedRole.toUpperCase() === "AGENT";

  // Top-level rows are admins/owners; their agents render nested underneath.
  const visibleAdmins = users.filter((user) => {
    const role = (user.role || "").toUpperCase();
    if (role !== "ADMIN" && role !== "OWNER") return false;

    const matchesStatus =
      selectedStatus === "All Status" ||
      user.status?.toUpperCase() === selectedStatus.toUpperCase();
    const matchesRole =
      selectedRole === "All Roles" ||
      selectedRole.toUpperCase() === "AGENT" ||
      role === selectedRole.toUpperCase();

    const agents = agentsByAdmin[user.id] || [];
    const matchesSearch = matchesText(user) || agents.some(matchesText);

    return matchesStatus && matchesRole && matchesSearch;
  });

  const renderRow = (
    user: any,
    opts: { isAgent?: boolean; agentCount?: number; expanded?: boolean } = {},
  ) => {
    const { isAgent = false, agentCount = 0, expanded = false } = opts;
    const role = (user.role || "").toUpperCase();
    const isAdmin = !isAgent && (role === "ADMIN" || role === "OWNER");
    return (
      <tr
        key={user.id || user.email}
        className={`font-[400] rounded-[9.02px] ${
          isAgent
            ? "bg-[#F4F5F9] dark:bg-slate-800/70"
            : "bg-[#FAFAFA] dark:bg-slate-700"
        }`}
      >
        <td
          className={`px-5 py-4 rounded-l-[9.02px] text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white ${
            isAgent ? "pl-10" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            {isAdmin && agentCount > 0 ? (
              <button
                onClick={() => toggleAdmin(user.id)}
                className="text-gray-500 hover:text-gray-800 dark:text-gray-300 shrink-0"
                title={expanded ? "Hide agents" : "Show agents"}
              >
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : isAgent ? (
              <CornerDownRight size={14} className="text-gray-400 shrink-0" />
            ) : (
              <span className="inline-block w-4 shrink-0" />
            )}
            <button
              onClick={() => setInvoicesUser(user)}
              className="text-[#2563EB] hover:underline font-[500] text-left"
              title="View invoice history"
            >
              {user.fullName}
            </button>
          </div>
        </td>
        <td className="px-5 py-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
          {user.email}
        </td>
        <td className="px-5 py-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
          {formatStatus(user.role || "")}
        </td>
        <td className="px-5 py-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
          {isAdmin ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4338CA] dark:bg-indigo-900/40 dark:text-indigo-300 font-[500]">
              {agentCount} {agentCount === 1 ? "agent" : "agents"}
            </span>
          ) : (
            "—"
          )}
        </td>
        <td className="px-5 py-4">
          <span
            className={`px-3 py-1 font-[400] text-[13.53px] font-[400] rounded-[75.17px] ${getStatusStyles(user.status || "")}`}
          >
            {formatStatus(user.status || "")}
          </span>
        </td>
        <td className="px-5 py-4 font-[400] text-[13.53px] text-[#2C2C2C] dark:text-white">
          {formatDate(user?.lastLogin)}
        </td>
        <td
          ref={(el) => {
            menuRefs.current[user.id] = el;
          }}
          className="px-5 py-4 text-center relative"
        >
          <button
            onClick={() =>
              setOpenMenuUserId(openMenuUserId === user.id ? null : user.id)
            }
            className="text-gray-400 hover:text-gray-700"
          >
            <span className="text-xl leading-none">
              <BsThreeDotsVertical />
            </span>
          </button>

          {openMenuUserId === user.id && (
            <div className="absolute right-5 top-1/2 bg-white dark:bg-slate-900 shadow-lg rounded-lg z-50 border dark:border-gray-700 border-gray-100 overflow-hidden py-1 w-32">
              <button
                onClick={() => { setInvoicesUser(user); setOpenMenuUserId(null); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-white text-[14px] font-medium transition-colors"
              >
                Invoices
              </button>
              <button
                onClick={() => { setEditingUser(user); setOpenMenuUserId(null); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-white text-[14px] font-medium transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => { setPhoneNumbersUser(user); setOpenMenuUserId(null); }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-white text-[14px] font-medium transition-colors"
              >
                Phone Numbers
              </button>
              <button
                onClick={() => {
                  // Agents have no billing of their own — the subscription (and the
                  // Stripe customer to attach a card to) lives on the admin who
                  // created them, so resolve to that account instead.
                  const billingOwner = isAgent
                    ? users.find((u: any) => u.id === user.createdById) || user
                    : user;
                  setChangeCardUser(billingOwner);
                  setOpenMenuUserId(null);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-white text-[14px] font-medium transition-colors"
              >
                Change Card
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-800 text-red-600 text-[14px] font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  };

  const statusOptions = [
    "All Status",
    "Active",
    "Pending",
    "Suspended",
    "Expiring Soon",
  ];
  const roleOptions = ["All Roles", "Admin", "Agent", "Owner"];

  const handleDelete = async (userId: string) => {
    const success = await deleteUser(userId);
    if (success) {
      await fetchUsers();
    }
    setOpenMenuUserId(null);
  };

  return (
    <section className="w-full min-h-screen flex flex-col gap-2 px-6 py-6 outfit dark:bg-slate-900 bg-[#F5F6FA]">
      <UserManagementHeader
        totalUsers={users.length}
        onUserAdded={fetchUsers}
      />

      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={fetchUsers}
      />

      <UserInvoicesModal
        isOpen={!!invoicesUser}
        user={invoicesUser}
        onClose={() => setInvoicesUser(null)}
      />

      <PhoneNumbersModal
        isOpen={!!phoneNumbersUser}
        user={phoneNumbersUser}
        onClose={() => setPhoneNumbersUser(null)}
      />

      <ChangeCardModal
        isOpen={!!changeCardUser}
        target={
          changeCardUser
            ? {
                userId: changeCardUser.id,
                fullName: changeCardUser.fullName,
                cardBrand: changeCardUser.userSubscriptions?.[0]?.cardBrand ?? null,
                cardLast4: changeCardUser.userSubscriptions?.[0]?.cardLast4 ?? null,
              }
            : null
        }
        onClose={() => setChangeCardUser(null)}
        onSuccess={fetchUsers}
      />

      {/* Search bar  */}
      <div className="bg-[#FFFFFF] dark:bg-slate-800 flex flex-col md:flex-row gap-5 md:gap-2 md:justify-between md:items-center w-full rounded-[13.48px] px-5 py-4">
        <div className="w-full md:w-[65%] bg-[#F2F2F2] dark:bg-slate-900 h-[40px] flex justify-start items-center gap-3 rounded-[11.56px] px-3 py-2">
          <span>
            <img
              src={searchIcon}
              alt="searchIcon"
              className="h-[17.343202590942383] object-contain"
            />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-[#6C6D72]  dark:text-white text-[13.73px] font-[400]"
            placeholder="Search by name, email, role, or status..."
          />
        </div>

        <div className="flex justify-start items-center gap-6">
          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setStatusOpen(!statusOpen);
                setRoleOpen(false);
              }}
              className="bg-[#F2F2F2] dark:bg-slate-900 px-3 py-2 h-[40px] flex rounded-[11.56px] w-[150px] justify-between items-center gap-2 cursor-pointer"
            >
              <span className="text-[#030213] dark:text-white text-[15.41px] font-[400]">
                {selectedStatus}
              </span>
              <img
                src={downarrow}
                alt="arrow"
                className={`h-1.5 object-contain transition-transform ${statusOpen ? "rotate-180" : ""}`}
              />
            </button>

            {statusOpen && (
              <div className="absolute top-11 left-0 w-full bg-white dark:bg-slate-900 shadow-lg rounded-lg z-50 border dark:border-gray-700 border-gray-100 overflow-hidden">
                {statusOptions.map((opt) => (
                  <div
                    key={opt}
                    className="px-4 py-2 hover:bg-[#F2F2F2] dark:hover:bg-slate-800 cursor-pointer text-[14px] text-[#030213] dark:text-white"
                    onClick={() => {
                      setSelectedStatus(opt);
                      setStatusOpen(false);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleOpen(!roleOpen);
                setStatusOpen(false);
              }}
              className="bg-[#F2F2F2] dark:bg-slate-900 px-3 py-2 h-[40px] flex rounded-[11.56px] w-[150px] justify-between items-center gap-2 cursor-pointer"
            >
              <span className="text-[#030213] dark:text-white text-[15.41px] font-[400]">
                {selectedRole}
              </span>
              <img
                src={downarrow}
                alt="arrow"
                className={`h-1.5 object-contain transition-transform ${roleOpen ? "rotate-180" : ""}`}
              />
            </button>

            {roleOpen && (
              <div className="absolute top-11 left-0 w-full bg-white dark:bg-slate-900 shadow-lg rounded-lg z-50 border dark:border-gray-700 border-gray-100 overflow-hidden">
                {roleOptions.map((opt) => (
                  <div
                    key={opt}
                    className="px-4 py-2 hover:bg-[#F2F2F2] dark:hover:bg-slate-800 cursor-pointer text-[14px] text-[#030213] dark:text-white"
                    onClick={() => {
                      setSelectedRole(opt);
                      setRoleOpen(false);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 mt-5">
        <h1 className="text-[20px] font-medium text-[#111] dark:text-white mb-4">
          User List
        </h1>

        <div className="overflow-x-auto">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full min-w-[900px] border-separate border-spacing-y-3">
              <thead>
                <tr>
                  {[
                    "User Name",
                    "Email",
                    "Role",
                    "Agents",
                    "Status",
                    "Last Login",
                    "Actions",
                  ].map((head, i) => (
                    <th
                      key={head}
                      className="px-5 py-3 text-left text-[15.03px] bg-[#FAF9FE] dark:bg-slate-900 font-[500] text-[#1D2C45] dark:text-white sticky top-0 z-10"
                    >
                      <div className="flex items-center gap-2">
                        {head}
                        {i < 6 && (
                          <img
                            src={tableIcon}
                            className="h-3.5 object-contain"
                            alt="sort"
                          />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7}>
                      <Loader fullPage={false} />
                    </td>
                  </tr>
                ) : visibleAdmins.length > 0 ? (
                  visibleAdmins.map((admin) => {
                    const agents = agentsByAdmin[admin.id] || [];
                    const shownAgents = searchTerm
                      ? agents.filter(matchesText)
                      : agents;
                    const expanded =
                      (expandedAdmins.has(admin.id) || forceExpand) &&
                      shownAgents.length > 0;
                    return (
                      <Fragment key={admin.id || admin.email}>
                        {renderRow(admin, {
                          agentCount: agents.length,
                          expanded,
                        })}
                        {expanded &&
                          shownAgents.map((agent) =>
                            renderRow(agent, { isAgent: true }),
                          )}
                      </Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-10 text-gray-500 dark:text-white"
                    >
                      {error ? `Error: ${error}` : "No users found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuperAdminUserManagement;
