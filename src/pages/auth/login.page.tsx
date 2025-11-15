import { useState } from "react";
import bgImage from "@/assets/bg.png";
import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [isAdminLogin, setIsAdminLogin] = useState<boolean>(false);

  const navigate = useNavigate()

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex justify-end lg:px-40 px-5 items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white h-[21rem] w-[24rem] lg:h-[22rem] lg:w-[25rem] rounded-xl flex gap-3 flex-col items-center py-10 px-12">
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
          <h1 className="text-xl lg:text-[1.65rem] font-semibold text-gray-950">
            Log in to your account
          </h1>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-3 my-2">
          <Button 
            className={`${
              !isAdminLogin
                ? "bg-gray-950 text-white"
                : "bg-transparent text-gray-950 hover:text-gray-100"
            } border border-gray-400 hover:bg-gray-950 cursor-pointer`}
            onClick={() => {setIsAdminLogin(false) 
              navigate("/agent/login")
            }}
          >
            As Agent
          </Button>

          <Button
            className={`${
              isAdminLogin
                ? "bg-gray-950 text-white"
                : "bg-transparent text-gray-950 hover:text-gray-100"
            } border border-gray-400 hover:bg-gray-950 cursor-pointer`}
            onClick={() =>{ setIsAdminLogin(true)
              navigate("/admin/login")

            }}
          >
            As Admin
          </Button>
        </div>

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

        {/* Continue Button */}
        <div className="w-full">
          <Button className="w-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer font-semibold text-gray-950">
            Continue
          </Button>
        </div>

        {/* Info Text */}
        <div>
          <p className="text-gray-600 text-[0.65rem] lg:text-xs">
            We’ll send you a code to log in to your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
