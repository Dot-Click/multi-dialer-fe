import { useState } from "react";
import bgImage from "@/assets/bg.png";
import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const AdminChangePassword: React.FC = () => {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex justify-end lg:px-40 px-5 items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white h-fit w-[24rem] lg:w-[25rem] rounded-4xl flex flex-col gap-4 items-center py-10 px-12">
        {/* Logo */}
        <div>
          <img
            src={logoImage}
            alt="Company Logo"
            className="object-contain w-48"
          />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl lg:text-[1.65rem] font-semibold text-red-400">
            Change Password
          </h1>
        </div>



        {/* New Password */}
        <div className="flex flex-col w-full gap-1">
          <div className="bg-gray-200 flex flex-col gap-1 px-3 py-1.5 rounded-lg">
            <label htmlFor="newpassword" className="text-xs text-red-400 font-medium p-0">
              New Password
            </label>
            <div className="flex items-center justify-between">
              <input
                type={showNew ? "text" : "password"}
                id="newpassword"
                placeholder="Create new password"
                className="bg-transparent p-0 text-xs placeholder:text-xs tracking-wide border-none outline-none w-full"
                required
              />
              <span
                className="text-xl text-gray-700 cursor-pointer ml-2"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <VscEyeClosed /> : <VscEye />}
              </span>
            </div>
          </div>
          {/* Password Rule Hint (white background) */}
          <p className="text-[0.6rem] text-gray-500 ml-1">
            At least 8 characters, 1 uppercase, 1 lowercase, 1 number
          </p>
        </div>

        {/* Confirm New Password */}
        <div className="bg-gray-200 flex flex-col w-full gap-1 px-3 py-1.5 rounded-lg">
          <label htmlFor="confirmpassword" className="text-xs text-red-400 font-medium p-0">
            Confirm New Password
          </label>
          <div className="flex items-center justify-between">
            <input
              type={showConfirm ? "text" : "password"}
              id="confirmpassword"
              placeholder="Re-enter new password"
              className="bg-transparent p-0 text-xs placeholder:text-xs tracking-wide border-none outline-none w-full"
              required
            />
            <span
              className="text-xl text-gray-700 cursor-pointer ml-2"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <VscEyeClosed /> : <VscEye />}
            </span>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="w-full">
          <Button className="w-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer font-semibold text-gray-950">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminChangePassword;
