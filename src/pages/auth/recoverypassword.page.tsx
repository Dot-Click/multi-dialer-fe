import bgImage from "@/assets/bg.png";
import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const RecoveryPassword: React.FC = () => {

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex justify-end lg:px-40 px-5 items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white h-fit w-[24rem] lg:h-fit lg:w-[25rem] rounded-xl flex gap-3 flex-col items-center py-7 lg:py-8 px-12">
        {/* Logo */}
        <div>
          <img
            src={logoImage}
            alt="Company Logo"
            className="object-contain w-48"
          />
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-xl lg:text-[1.65rem] font-semibold text-gray-950">
            Password Recovery
          </h1>
        </div>

        {/* Info Text */}
        <div className="flex flex-col text-center items-center my-1">
          <h1 className="text-xs lg:text-sm text-gray-600">
            Enter your email address and we"ll send you a link to reset your password.
           
          </h1>
         
        </div>

        {/* Code Input */}
        <div className="bg-gray-200 flex flex-col w-full gap-0.5 px-3 py-1.5 rounded-lg">
          <label htmlFor="email" className="text-xs font-medium p-0">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="bg-transparent p-0 text-xs placeholder:text-xs tracking-wide border-none outline-none"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Login Button */}
        <div className="w-full">
          <Button className="w-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer font-semibold text-gray-950">
            Send Link
          </Button>
        </div>

 
      </div>
    </div>
  );
};

export default RecoveryPassword;
