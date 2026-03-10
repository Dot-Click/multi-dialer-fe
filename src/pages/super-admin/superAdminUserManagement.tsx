import { useState, useEffect, useRef } from "react";
import UserManagementHeader from "@/components/super-admin/user-management/UserManagementHeader";
import searchIcon from "@/assets/searchIcon.png";
import downarrow from "@/assets/downarrow.png";
import tableIcon from "@/assets/tableIcon.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useUser, type User } from "@/hooks/useUser";
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.status?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === "All Status" ||
      user.status?.toUpperCase() === selectedStatus.toUpperCase();
    const matchesRole =
      selectedRole === "All Roles" ||
      user.role?.toUpperCase() === selectedRole.toUpperCase();

    return matchesSearch && matchesStatus && matchesRole;
  });

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
                        {i < 5 && (
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
                    <td colSpan={6}>
                      <Loader fullPage={false} />
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id || user.email}
                      className="bg-[#FAFAFA] dark:bg-slate-700 font-[400] rounded-[9.02px]"
                    >
                      <td className="px-5 py-4 rounded-l-[9.02px] text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                        {user.fullName}
                      </td>
                      <td className="px-5 py-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                        {user.email}
                      </td>
                      <td className="px-5 py-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                        {formatStatus(user.role || "")}
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
                            setOpenMenuUserId(
                              openMenuUserId === user.id ? null : user.id,
                            )
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
                              onClick={() => {
                                handleDelete(user.id);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 text-[14px] font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
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
