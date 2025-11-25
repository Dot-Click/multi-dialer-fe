import { useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { GrSplits } from "react-icons/gr";
import { IoAdd, IoFilter } from "react-icons/io5";
import { MdOutlineCall } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import AllContactComponent from "@/components/agent/contact/allcontact";
import FilterModal from "@/components/modal/filtercontactmodal";
import ManageColumnsModal from "@/components/modal/managecolumnmodal";

// ✅ Define type for the Outlet context
type OutletContextType = {
    activeItem: string;
};

const AdminAllContact = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [showColumnsModal, setShowColumnsModal] = useState(false);
    const [assignedToName, setAssignedToName] = useState("John Lord");
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedName, setSelectedName] = useState(assignedToName);
    const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const users = [
        "None",
        "John Lee",
        "Cody Fisher",
        "Marvin McKinney",
        "Cameron Williamson",
        "Devon Lane",
    ];

    const { activeItem } = useOutletContext<OutletContextType>();

    const getBreadcrumb = () => {
        if (activeItem === "allContacts") return "";
        if (activeItem.startsWith("List")) {
            if (["List 01", "List 02"].includes(activeItem))
                return "Folder 1 · " + activeItem;
            return "Folder 2 · " + activeItem;
        }
        if (activeItem.startsWith("group")) {
            return "Groups · " + activeItem;
        }
        if (activeItem.startsWith("Folder")) {
            return activeItem;
        }
        return "";
    };

    const renderHeading = () => {
        if (activeItem === "allContacts") return "Data & Dialer";
        return activeItem;
    };

    const handleSaveAssign = () => {
        if (selectedName === "None") {
            setAssignedToName("Unassigned");
        } else {
            setAssignedToName(selectedName);
        }
        setIsAssignModalOpen(false);
    };

    return (
        <section className="pr-7 flex flex-col gap-3 min-h-screen px-4 sm:px-6 md:px-10 py-4 lg:py-1 lg:px-3 transition-all">
            {/* 🔹 Breadcrumb + Heading */}
            <div className="flex flex-col">
                {getBreadcrumb() && (
                    <span className="text-sm text-[#6c757d] font-[500] mb-1">
                        {getBreadcrumb()}
                    </span>
                )}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    {/* 🔹 Heading + Assigned To */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <h1 className="text-[24px] sm:text-[28px] font-[500]">
                            {renderHeading()}
                        </h1>

                        {/* Only show "Assigned to" when NOT Data & Dialer */}
                        {renderHeading() !== "Data & Dialer" && (
                            <div className="flex items-center gap-2 text-[#495057]">
                                <span className="text-sm font-medium">
                                    Assigned to
                                </span>
                                <span className="text-sm font-semibold">
                                    {assignedToName}
                                </span>
                                <button
                                    onClick={() => setIsAssignModalOpen(true)}
                                    className="text-gray-600 hover:text-gray-800"
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
                            className="flex gap-2 hover:bg-gray-200 rounded-md cursor-pointer px-3 py-2 items-center justify-center bg-transparent"
                        >
                            <IoAdd className="text-xl text-[#495057]" />
                            <span className="text-sm font-[500] text-[#495057] ">
                                New Contact
                            </span>
                        </Link>
                        <div
                            className="flex gap-2 hover:bg-gray-200 rounded-md cursor-pointer px-3 py-2 items-center justify-center bg-transparent"
                            onClick={() => setShowColumnsModal(true)}
                        >
                            <GrSplits className="text-base text-[#495057]" />
                            <span className="text-sm font-[500] text-[#495057]">
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
                        className="bg-[#2B3034] text-lg text-white p-2 rounded-full flex-shrink-0"
                    >
                        <IoFilter />
                    </button>
                </div>

                {/* Dial Button */}
                <button 
                    onClick={() => {
                        if (selectedContacts.length > 0) {
                            // Navigate to contact-info with the first selected contact
                            navigate("/admin/contact-info", {
                                state: { contact: selectedContacts[0] }
                            });
                        }
                    }}
                    disabled={selectedContacts.length === 0}
                    className={`flex gap-2 justify-center items-center bg-[#FFCA06] rounded-lg px-4 py-2 text-sm sm:text-sm font-[600] text-[#2B3034] shadow-sm hover:bg-[#ffcf29] transition-all ${
                        selectedContacts.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    <MdOutlineCall className="text-base" />
                    <span>Dial Selected ({selectedContacts.length})</span>
                </button>
            </div>

            {/* 🔹 Table / Contact List */}
            <div className="flex-1 sm:-ml-10 mt-2">
                <AllContactComponent onSelectionChange={setSelectedContacts} />
            </div>

            {/* 🔹 Modals */}
            {isFilterOpen && <FilterModal onClose={() => setIsFilterOpen(false)} />}
            {showColumnsModal && (
                <ManageColumnsModal onClose={() => setShowColumnsModal(false)} />
            )}

            {/* 🔹 Assign To Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-[380px] rounded-xl shadow-lg p-5 relative">
                        <button
                            onClick={() => setIsAssignModalOpen(false)}
                            className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-lg"
                        >
                            ✕
                        </button>

                        <h2 className="text-lg font-semibold mb-4">Assign to</h2>

                        {/* Search Bar */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg pl-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#FFCA06]"
                            />
                            <IoIosSearch className="absolute right-3 top-2.5 text-gray-500 text-lg" />
                        </div>

                        {/* User List */}
                        <div className="max-h-[280px] custom-scrollbar overflow-y-auto space-y-2 mb-4">
                            {users
                                .filter((u) =>
                                    u.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((user) => (
                                    <label
                                        key={user}
                                        className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer ${
                                            selectedName === user
                                                ? "bg-gray-100"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            className="h-4 w-4 accent-black"
                                            name="assignedUser"
                                            value={user}
                                            checked={selectedName === user}
                                            onChange={() => setSelectedName(user)}
                                        />
                                        <span className="text-base">{user}</span>
                                    </label>
                                ))}
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveAssign}
                            className="w-full bg-[#FFCA06] hover:bg-[#ffd633] text-[#2B3034] font-semibold py-2.5 rounded-lg"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AdminAllContact;
