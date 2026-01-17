import { useState } from "react";
import bgImage from "@/assets/bg.png";
import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const Login: React.FC = () => {
  const [isAdminLogin, setIsAdminLogin] = useState<boolean>(false);
 const [showCurrent, setShowCurrent] = useState(false);

  const navigate = useNavigate()

  return (
    <div
      className="h-screen w-full bg-cover work-sans bg-center flex justify-end lg:px-40 px-5 items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white h-[21rem] w-[24rem] lg:h-[27rem] lg:w-[25rem] rounded-[32px] flex gap-3 flex-col items-center py-[48px] px-[32px]">
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
          <h1 className="text-xl lg:text-[28px] font-[500] text-black">
            Log in to your account
          </h1>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-3 my-2">
          <Button 
            className={`${
              !isAdminLogin
                ? "bg-[#0E1011] text-white"
                : "bg-transparent text-[#0E1011] hover:text-gray-100"
            } border border-gray-400 hover:bg-[#0E1011] cursor-pointer text-[14px] font-[500]`}
            onClick={() => {setIsAdminLogin(false) 
              navigate("/agent/login")
            }}
          >
            As Agent
          </Button>

          <Button
            className={`${
              isAdminLogin
                ? "bg-[#0E1011] text-white"
                : "bg-transparent text-[#0E1011] hover:text-gray-100"
            } border border-gray-400 hover:bg-[#0E1011] cursor-pointer text-[14px] font-[500]`}
            onClick={() =>{ setIsAdminLogin(true)
              navigate("/admin/login")

            }}
          >
            As Admin
          </Button>
        </div>

        {/* Email Input */}
        {/* Email Input */}
               <div className="bg-gray-200 flex flex-col w-full gap-0.5 px-3 py-1.5 rounded-lg">
                 <label htmlFor="email" className="text-xs text-[#495057] font-medium p-0">
                   Email
                 </label>
                 <input
                   type="email"
                   id="email"
                   placeholder="Enter Your Email"
                   className="bg-transparent p-0 text-xs placeholder:text-xs tracking-wide border-none outline-none focus-visible:ring-0"
                   required
                 />
               </div>
                  <div className="bg-gray-200 flex flex-col w-full gap-1 px-3 py-1.5 rounded-lg">
                         <label htmlFor="currentpassword" className="text-xs text-[#495057] font-medium p-0">
                           Password
                         </label>
                         <div className="flex items-center justify-between">
                           <input
                             type={showCurrent ? "text" : "password"}
                             id="password"
                             placeholder="Enter your password"
                             className="bg-transparent p-0 text-xs placeholder:text-xs tracking-wide border-none outline-none w-full"
                             required
                           />
                           <span
                             className="text-xl text-gray-700 cursor-pointer ml-2"
                             onClick={() => setShowCurrent(!showCurrent)}
                           >
                             {showCurrent ? <VscEyeClosed /> : <VscEye />}
                           </span>
                         </div>
                       </div>
               
               <div className="flex justify-end w-full">
                 <a href="/admin/change-password" className="text-gray-600 text-[0.65rem] lg:text-xs">
                   Forget your password?
                 </a>
               </div>

        {/* Continue Button */}
        <div className="w-full">
          <Button className="w-full bg-[#FFCA06] hover:bg-yellow-500 py-[8px] px-[24px] rounded-[12px] cursor-pointer font-[500] text-[#000000] text-[16px]">
            Log In
          </Button>
        </div>

      
        
      </div>
    </div>
  );
};

export default Login;
