import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { GrSplits } from "react-icons/gr";
import { IoAdd, IoFilter } from "react-icons/io5";
import { MdOutlineCall } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import AllContactComponent from "@/components/agent/contact/allcontact";
import FilterModal from "@/components/modal/filtercontactmodal";
import ManageColumnsModal from "@/components/modal/managecolumnmodal";
import CreateCallSettingModal from "@/components/admin/systemsettings/CreateCallSettingModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { assignAgentsToList } from "@/store/slices/contactSlice";
import { authClient } from "@/lib/auth-client";
import { fetchContactLists } from "@/store/slices/contactSlice";
import toast from "react-hot-toast";

// ✅ Define type for the Outlet context
type OutletContextType = {
    activeItem: { type: string; id?: string; name: string };
    selectedContacts: any[];
    setSelectedContacts: (contacts: any[]) => void;
};

const AdminAllContact = () => {
    const dispatch = useAppDispatch();
    const { lists } = useAppSelector((state) => state.contacts);
    const { session } = useAppSelector((state) => state.auth);

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showColumnsModal, setShowColumnsModal] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isDialSettingOpen, setIsDialSettingOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [realUsers, setRealUsers] = useState<any[]>([]);
    const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);

    const { activeItem, selectedContacts, setSelectedContacts } = useOutletContext<OutletContextType>();

    // Fetch users for assignment
    const fetchUsers = async () => {
        if (!session?.user?.id) return;
        setIsLoadingUsers(true);
        try {
            const { data, error } = await authClient.admin.listUsers({
                query: { limit: 100 }
            });
            if (error) {
                toast.error(error.message || "Failed to fetch users");
            } else if (data) {
                // Show users created by this admin or with role AGENT
                const filtered = data.users?.filter((u: any) =>
                    u.createdById === session.user.id
                ) || [];
                setRealUsers(filtered);
            }
        } catch (err: any) {
            console.error("Fetch Users Error:", err);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        if (session?.user?.id) {
            // fetchUsers();
            dispatch(fetchContactLists());
        }
    }, [session?.user?.id]);

    useEffect(() => {
        if (isAssignModalOpen) {
            // Refresh users if modal opens
            fetchUsers();
            // Pre-select currently assigned agents
            if (activeItem.type === "list" && activeItem.id) {
                const currentList = lists.find(l => l.id === activeItem.id);
                if (currentList) {
                    setSelectedAgentIds(currentList.agentIds || []);
                }
            }
        }
    }, [isAssignModalOpen]);

    const getBreadcrumb = () => {
        if (activeItem.type === "allContacts") return "";
        if (activeItem.type === "list") return "Calling Lists · " + activeItem.name;
        if (activeItem.type === "group") return "Groups · " + activeItem.name;
        if (activeItem.type === "folder") return "Calling Lists · " + activeItem.name;
        return "";
    };

    const renderHeading = () => {
        if (activeItem.type === "allContacts") return "Data & Dialer";
        return activeItem.name;
    };

    const getAssignedToText = () => {
        if (activeItem.type !== "list" || !activeItem.id) return "";
        const currentList = lists.find(l => l.id === activeItem.id);
        if (!currentList || !currentList.agentIds || currentList.agentIds.length === 0) return "Unassigned";

        // This is tricky because we might not have all user names in memory
        // For now, if we have realUsers, we can find names, otherwise show "X Agents"
        const assignedNames = currentList.agentIds.map(id => {
            const u = realUsers.find(user => user.id === id);
            return u ? (u.fullName || u.name) : "Agent";
        }).filter(Boolean);

        if (assignedNames.length === 0) return `${currentList.agentIds.length} Agent(s)`;
        if (assignedNames.length === 1) return assignedNames[0];
        return `${assignedNames[0]} + ${assignedNames.length - 1} more`;
    };

    const handleSaveAssign = async () => {
        if (activeItem.type !== "list" || !activeItem.id) return;

        try {
            await dispatch(assignAgentsToList({
                listId: activeItem.id,
                agentIds: selectedAgentIds
            })).unwrap();
            toast.success("Agents assigned successfully");
            setIsAssignModalOpen(false);
        } catch (error: any) {
            toast.error(error || "Failed to assign agents");
        }
    };

    const toggleAgentSelection = (agentId: string) => {
        setSelectedAgentIds(prev =>
            prev.includes(agentId)
                ? prev.filter(id => id !== agentId)
                : [...prev, agentId]
        );
    };

    return (
        <section className="pr-7 flex flex-col gap-3 min-h-screen px-4 sm:px-6 md:px-10 py-4 lg:py-1 lg:px-3 transition-all">
            {/* 🔹 Breadcrumb + Heading */}
            <div className="flex flex-col">
                {getBreadcrumb() && (
                    <span className="text-sm text-[#6c757d] font-medium mb-1">
                        {getBreadcrumb()}
                    </span>
                )}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    {/* 🔹 Heading + Assigned To */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-[24px] sm:text-[28px] font-medium text-[#0E1011]">
                            {renderHeading()}
                        </h1>

                        {/* Only show "Assigned to" when type is list */}
                        {activeItem.type === "list" && (
                            <div className="flex items-center gap-2 text-[#495057]">
                                <span className="text-sm font-medium">
                                    Assigned to
                                </span>
                                <span className="text-sm font-semibold text-[#0E1011]">
                                    {getAssignedToText()}
                                </span>
                                <button
                                    onClick={() => setIsAssignModalOpen(true)}
                                    className="text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    <FiEdit className="text-base" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Manage Columns + New Contact Buttons */}
                    <div className="flex items-center gap-5">
                        <Link
                            to="/admin/create-contact"
                            className="flex gap-2 hover:bg-gray-200 rounded-md cursor-pointer px-3 py-2 items-center justify-center bg-transparent transition-colors text-[#495057]"
                        >
                            <IoAdd className="text-xl" />
                            <span className="text-sm font-medium">
                                New Contact
                            </span>
                        </Link>
                        <div
                            className="flex gap-2 hover:bg-gray-200 rounded-md cursor-pointer px-3 py-2 items-center justify-center bg-transparent transition-colors text-[#495057]"
                            onClick={() => setShowColumnsModal(true)}
                        >
                            <GrSplits className="text-base" />
                            <span className="text-sm font-medium">
                                Manage Columns
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 Search + Filter + Dial button */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 w-full">
                {/* Search + Filter */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="bg-white flex items-center justify-between w-full sm:w-[40vw] rounded-full border border-[#D8DCE1] py-1.5 px-4">
                        <input
                            type="search"
                            placeholder="Search by name, email, phone number..."
                            className="w-full placeholder:text-sm text-sm outline-none"
                        />
                        <IoIosSearch className="text-2xl text-gray-600" />
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(true)}
                        className="bg-[#2B3034] text-lg text-white p-2 rounded-full shrink-0"
                    >
                        <IoFilter />
                    </button>
                </div>

                {/* Dial Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (selectedContacts.length > 0) {
                            setIsDialSettingOpen(true);
                        }
                    }}
                    disabled={selectedContacts.length === 0}
                    className={`flex gap-2 justify-center items-center bg-[#FFCA06] rounded-lg px-4 py-2 text-sm sm:text-sm font-semibold text-[#2B3034] shadow-sm hover:bg-[#ffcf29] transition-all ${selectedContacts.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    <MdOutlineCall className="text-base" />
                    <span>Dial Selected ({selectedContacts.length})</span>
                </button>
            </div>

            {/* 🔹 Table / Contact List */}
            <div className="flex-1 sm:-ml-10 mt-2">
                <AllContactComponent
                    onSelectionChange={setSelectedContacts}
                    listId={activeItem.type === 'list' ? activeItem.id : undefined}
                />
            </div>

            {/* 🔹 Modals */}
            {isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} />}
            {showColumnsModal && (
                <ManageColumnsModal onClose={() => setShowColumnsModal(false)} />
            )}
            <CreateCallSettingModal
                selectedContacts={selectedContacts}
                isOpen={isDialSettingOpen}
                onClose={() => setIsDialSettingOpen(false)}
            />

            {/* 🔹 Assign To Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[380px] rounded-xl shadow-lg p-5 relative">
                        <button
                            onClick={() => setIsAssignModalOpen(false)}
                            className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-lg transition-colors"
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-semibold mb-4 text-[#0E1011]">Assign to Agents</h2>

                        {/* Search Bar */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search agents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg pl-3 pr-10 py-2 text-sm outline-none focus:ring-1 focus:ring-[#FFCA06] transition-all"
                            />
                            <IoIosSearch className="absolute right-3 top-2.5 text-gray-400 text-lg" />
                        </div>

                        {/* User List */}
                        <div className="max-h-[280px] custom-scrollbar overflow-y-auto space-y-1 mb-6 pr-1">
                            {isLoadingUsers ? (
                                <div className="flex justify-center py-10 text-gray-400 text-sm italic">
                                    Loading agents...
                                </div>
                            ) : realUsers.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    No agents found
                                </div>
                            ) : (
                                realUsers
                                    .filter((u) => {
                                        const name = u.fullName || u.name || "";
                                        return name.toLowerCase().includes(searchTerm.toLowerCase());
                                    })
                                    .map((user) => (
                                        <label
                                            key={user.id}
                                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${selectedAgentIds.includes(user.id)
                                                ? "bg-[#F7F7F7]"
                                                : "hover:bg-gray-50"
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 accent-[#0E1011] rounded cursor-pointer"
                                                checked={selectedAgentIds.includes(user.id)}
                                                onChange={() => toggleAgentSelection(user.id)}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-medium text-[#0E1011]">
                                                    {user.fullName || user.name || "Unnamed User"}
                                                </span>
                                                <span className="text-[11px] text-gray-500 uppercase tracking-tight">
                                                    {user.role}
                                                </span>
                                            </div>
                                        </label>
                                    ))
                            )}
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveAssign}
                            className="w-full bg-[#FFCA06] hover:bg-[#ffd633] text-[#2B3034] font-semibold py-3 rounded-lg shadow-sm transition-all duration-200 transform active:scale-[0.98]"
                        >
                            Save Assignments
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AdminAllContact;
