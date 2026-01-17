import addUsericon from "@/assets/addUsericon.png"


const UserManagementHeader = () => {
  return (
    <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col leading-none gap-0">
            <h1 className="text-[#2C2C2C] text-[20px] md:text-[26px]  lg:text-[33.95px] font-[600]">User Management</h1>
            <h3 className="text-[#434343] text-[10px] md:text-[14px]  lg:text-[18px] font-[400]">Total Users: 8</h3>
            
        </div>

    <div>
        <button  className="bg-[#030213] text-[#F9FAFB] px-3 py-2 rounded-[11.56px] flex gap-2 items-center justify-center"> 
            <span>
                <img src={addUsericon} className="h-[13px] md:h-[15px] object-contain"/>
            </span>
            <span className="text-[13px] md:text-[15.41px] font-[400]">Add User</span>
        </button>
    </div>

    </div>
  )
}

export default UserManagementHeader