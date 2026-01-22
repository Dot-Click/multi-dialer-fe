import { useState } from "react";
import { IoClose } from "react-icons/io5";
import downarrow from "@/assets/downarrow.png";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddUserModal = ({ isOpen, onClose }: AddUserModalProps) => {
  // Dropdown states
  const [roleOpen, setRoleOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Values states
  const [selectedRole, setSelectedRole] = useState("Select Role");
  const [selectedStatus, setSelectedStatus] = useState("Select Status");

  const roleOptions = ["Admin", "Super Admin", "Manager", "Team Lead", "Agent"];
  const statusOptions = ["Active", "Pending", "Suspended", "Expiring Soon"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white w-full max-w-[450px] rounded-[24px] shadow-xl relative animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h2 className="text-[#111] text-[20px] font-[600]">Add New User</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <IoClose className="text-[22px] text-gray-500" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 flex flex-col gap-4">
          
          {/* Username */}
          <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
            <label className="text-[#6B7280] text-[12px] font-[500]">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              className="bg-transparent outline-none text-[#111] text-[15px] font-[400]"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2">
            <label className="text-[#6B7280] text-[12px] font-[500]">Email</label>
            <input
              type="email"
              placeholder="Enter email address"
              className="bg-transparent outline-none text-[#111] text-[15px] font-[400]"
            />
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <div 
              onClick={() => { setRoleOpen(!roleOpen); setStatusOpen(false); }}
              className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2 cursor-pointer"
            >
              <label className="text-[#6B7280] text-[12px] font-[500]">Role</label>
              <div className="flex justify-between items-center">
                <span className={`text-[15px] ${selectedRole === "Select Role" ? "text-[#9CA3AF]" : "text-[#111]"}`}>
                  {selectedRole}
                </span>
                <img src={downarrow} alt="arrow" className={`h-1.5 transition-transform ${roleOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
            
            {roleOpen && (
              <div className="absolute top-[60px] left-0 w-full bg-white shadow-2xl rounded-[12px] z-50 border border-gray-100 overflow-hidden py-1">
                {roleOptions.map((role) => (
                  <div 
                    key={role}
                    className="px-4 py-2 hover:bg-[#F3F4F6] cursor-pointer text-[14px] text-[#111]"
                    onClick={() => { setSelectedRole(role); setRoleOpen(false); }}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <div 
              onClick={() => { setStatusOpen(!statusOpen); setRoleOpen(false); }}
              className="flex flex-col gap-1 bg-[#F3F4F6] rounded-[12px] px-4 py-2 cursor-pointer"
            >
              <label className="text-[#6B7280] text-[12px] font-[500]">Status</label>
              <div className="flex justify-between items-center">
                <span className={`text-[15px] ${selectedStatus === "Select Status" ? "text-[#9CA3AF]" : "text-[#111]"}`}>
                  {selectedStatus}
                </span>
                <img src={downarrow} alt="arrow" className={`h-1.5 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {statusOpen && (
              <div className="absolute top-[60px] left-0 w-full bg-white shadow-2xl rounded-[12px] z-50 border border-gray-100 overflow-hidden py-1">
                {statusOptions.map((status) => (
                  <div 
                    key={status}
                    className="px-4 py-2 hover:bg-[#F3F4F6] cursor-pointer text-[14px] text-[#111]"
                    onClick={() => { setSelectedStatus(status); setStatusOpen(false); }}
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-5 flex gap-3 work-sans border-t border-gray-100">
          <button 
            onClick={onClose}
            className="flex-1 bg-[#F3F4F6] text-[#374151] font-[500] py-3 rounded-[12px] hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            className="flex-1 bg-[#FFCA06] text-[#000000] font-[500] py-3 rounded-[12px] hover:bg-[#eab700] transition-colors"
          >
            Add User
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddUserModal;