
import { useState } from 'react';
import UserManagementHeader from '@/components/super-admin/user-management/UserManagementHeader'
import searchIcon from "@/assets/searchIcon.png"
import downarrow from "@/assets/downarrow.png"
import tableIcon from "@/assets/tableIcon.png"
import { BsThreeDotsVertical } from 'react-icons/bs';

interface User {
    name: string;
    email: string;
    role: string;
    status: 'Active' | 'Pending' | 'Suspended' | 'Expiring Soon';
    lastLogin: string;
}

const users: User[] = [
    { name: "Amanda Davis", email: "amanda.davis@multidialer.com", role: "Agent", status: "Pending", lastLogin: "Never" },
    { name: "Christopher Brown", email: "christopher.brown@multidialer.com", role: "Manager", status: "Expiring Soon", lastLogin: "Dec 29, 2025" },
    { name: "David Thompson", email: "david.thompson@multidialer.com", role: "Team Lead", status: "Active", lastLogin: "Dec 29, 2025" },
    { name: "Emily Rodriguez", email: "emily.rodriguez@multidialer.com", role: "Manager", status: "Active", lastLogin: "Dec 28, 2025" },
    { name: "Jessica Martinez", email: "jessica.martinez@multidialer.com", role: "Agent", status: "Active", lastLogin: "Dec 27, 2025" },
    { name: "Michael Chen", email: "michael.chen@multidialer.com", role: "Admin", status: "Active", lastLogin: "Dec 29, 2025" },
    { name: "Robert Williams", email: "robert.williams@multidialer.com", role: "Agent", status: "Suspended", lastLogin: "Dec 20, 2025" },
    { name: "Sarah Johnson", email: "sarah.johnson@multidialer.com", role: "Super Admin", status: "Active", lastLogin: "Dec 29, 2025" },
];

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'Active': return 'bg-[#D0FAE5] text-[#428E43]';
        case 'Pending': return 'bg-[#FEF9C2] text-[#BA5F44]';
        case 'Suspended': return 'bg-[#FEE9EA] text-[#C10057]';
        case 'Expiring Soon': return 'bg-[#FFF0E6] text-[#D43500]';
        default: return '';
    }
};

const SuperAdminUserManagement = () => {
    // States for Search and Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [selectedRole, setSelectedRole] = useState("All Roles");
    
    // States for Dropdown visibility
    const [statusOpen, setStatusOpen] = useState(false);
    const [roleOpen, setRoleOpen] = useState(false);

    // Filter Logic
    const filteredUsers = users.filter((user) => {
        const matchesSearch = 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.status.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = selectedStatus === "All Status" || user.status === selectedStatus;
        const matchesRole = selectedRole === "All Roles" || user.role === selectedRole;

        return matchesSearch && matchesStatus && matchesRole;
    });

    const statusOptions = ["All Status", "Active", "Pending", "Suspended", "Expiring Soon"];
    const roleOptions = ["All Roles", "Admin", "Super Admin", "Manager", "Team Lead", "Agent"];

    return (
        <section className="w-full min-h-screen flex flex-col gap-2 px-6 py-6 outfit bg-[#F5F6FA]">
            <UserManagementHeader />

            {/* Search bar  */}
            <div className="bg-[#FFFFFF] flex flex-col md:flex-row gap-5 md:gap-2 md:justify-between md:items-center w-full rounded-[13.48px] px-5 py-4">
                
                <div className='w-full md:w-[65%] bg-[#F2F2F2] h-[40px] flex justify-start items-center gap-3 rounded-[11.56px] px-3 py-2'>
                    <span>
                        <img src={searchIcon} alt="searchIcon" className='h-[17.343202590942383] object-contain' />
                    </span>
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent outline-none text-[#6C6D72] text-[13.73px] font-[400]" 
                        placeholder='Search by name, email, role, or status...' 
                    />
                </div>

                <div className="flex justify-start items-center gap-6">
                    {/* Status Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => { setStatusOpen(!statusOpen); setRoleOpen(false); }}
                            className='bg-[#F2F2F2] px-3 py-2 h-[40px] flex rounded-[11.56px] w-[150px] justify-between items-center gap-2 cursor-pointer'
                        >
                            <span className='text-[#030213] text-[15.41px] font-[400]'>{selectedStatus}</span>
                            <img src={downarrow} alt="arrow" className={`h-1.5 object-contain transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {statusOpen && (
                            <div className="absolute top-11 left-0 w-full bg-white shadow-lg rounded-lg z-50 border border-gray-100 overflow-hidden">
                                {statusOptions.map((opt) => (
                                    <div 
                                        key={opt}
                                        className="px-4 py-2 hover:bg-[#F2F2F2] cursor-pointer text-[14px] text-[#030213]"
                                        onClick={() => { setSelectedStatus(opt); setStatusOpen(false); }}
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
                            onClick={() => { setRoleOpen(!roleOpen); setStatusOpen(false); }}
                            className='bg-[#F2F2F2] px-3 py-2 h-[40px] flex rounded-[11.56px] w-[150px] justify-between items-center gap-2 cursor-pointer'
                        >
                            <span className='text-[#030213] text-[15.41px] font-[400]'>{selectedRole}</span>
                            <img src={downarrow} alt="arrow" className={`h-1.5 object-contain transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {roleOpen && (
                            <div className="absolute top-11 left-0 w-full bg-white shadow-lg rounded-lg z-50 border border-gray-100 overflow-hidden">
                                {roleOptions.map((opt) => (
                                    <div 
                                        key={opt}
                                        className="px-4 py-2 hover:bg-[#F2F2F2] cursor-pointer text-[14px] text-[#030213]"
                                        onClick={() => { setSelectedRole(opt); setRoleOpen(false); }}
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
            <div className="bg-white rounded-2xl p-5 mt-5">
                <h1 className="text-[20px] font-medium text-[#111] mb-4">User List</h1>

                <div className="overflow-x-auto">
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        <table className="w-full min-w-[900px] border-separate border-spacing-y-3">
                            <thead>
                                <tr>
                                    {['User Name', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map((head, i) => (
                                        <th key={head} className="px-5 py-3 text-left text-[15.03px] bg-[#FAF9FE] font-[500] text-[#1D2C45] sticky top-0 z-10">
                                            <div className="flex items-center gap-2">
                                                {head}
                                                {i < 5 && <img src={tableIcon} className="h-3.5 object-contain" alt="sort" />}
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.email} className="bg-[#FAFAFA] font-[400] rounded-[9.02px]">
                                            <td className="px-5 py-4 rounded-l-[9.02px] text-[13.53px] font-[400] text-[#2C2C2C]">{user.name}</td>
                                            <td className="px-5 py-4 text-[13.53px] font-[400] text-[#2C2C2C]">{user.email}</td>
                                            <td className="px-5 py-4 text-[13.53px] font-[400] text-[#2C2C2C]">{user.role}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-3 py-1 font-[400] text-[13.53px] font-[400] rounded-[75.17px] ${getStatusStyles(user.status)}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-[400] text-[13.53px] text-[#2C2C2C]">{user.lastLogin}</td>
                                            <td className="px-5 py-4 text-center">
                                                <button className="text-gray-400 hover:text-gray-700">
                                                    <span className="text-xl leading-none"><BsThreeDotsVertical /></span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center py-10 text-gray-500">No users found.</td>
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