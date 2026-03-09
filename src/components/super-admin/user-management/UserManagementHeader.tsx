import { useState } from "react";
import addUsericon from "@/assets/addUsericon.png";
import AddUserModal from "@/components/modal/addUserModal";

interface UserManagementHeaderProps {
  totalUsers: number;
  onUserAdded: () => void;
}

const UserManagementHeader = ({ totalUsers, onUserAdded }: UserManagementHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col leading-none gap-0">
          <h1 className="text-[#2C2C2C] dark:text-white text-[20px] md:text-[26px] lg:text-[33.95px] font-[600]">
            User Management
          </h1>
          <h3 className="text-[#434343] dark:text-white text-[10px] md:text-[14px] lg:text-[18px] font-[400]">
            Total Users: {totalUsers}
          </h3>
        </div>

        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#030213] dark:bg-slate-800 text-[#F9FAFB] dark:text-white px-3 py-2 rounded-[11.56px] flex gap-2 items-center justify-center hover:bg-opacity-90 transition-all"
          >
            <span>
              <img src={addUsericon} className="h-[13px] md:h-[15px] object-contain" alt="add" />
            </span>
            <span className="text-[13px] md:text-[15.41px] font-[400]">Add User</span>
          </button>
        </div>
      </div>

      {/* Modal Component */}
      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={onUserAdded}
      />
    </>
  );
};

export default UserManagementHeader;