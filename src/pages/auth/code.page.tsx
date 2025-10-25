import { useState, useEffect } from "react";
import bgImage from "@/assets/bg.png";
import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";

const Code: React.FC = () => {
  const [timer, setTimer] = useState<number>(30); // 30 seconds countdown
  const [canResend, setCanResend] = useState<boolean>(false);

  // Countdown effect
  useEffect(() => {
    let countdown: ReturnType<typeof setInterval> | undefined;
    if (timer > 0) {
      countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (countdown) clearInterval(countdown);
    };
  }, [timer]);

  // Handle resend click
  const handleResend = (): void => {
    setCanResend(false);
    setTimer(30);
    console.log("Resend code triggered!");
  };

  // Format time like 00:30
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex justify-end lg:px-40 px-5 items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white h-fit w-[24rem] lg:h-[22rem] lg:w-[25rem] rounded-xl flex gap-3 flex-col items-center py-7 lg:py-8 px-12">
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
            Log in to your account
          </h1>
        </div>

        {/* Info Text */}
        <div className="flex flex-col items-center my-1">
          <h1 className="text-xs lg:text-sm text-gray-600">
            We’ve sent a code to{" "}
            <span className="font-medium text-gray-950">
              email@example.com.
            </span>
          </h1>
          <h1 className="text-xs lg:text-sm text-gray-600">
            Enter it below to log in to your account.
          </h1>
        </div>

        {/* Code Input */}
        <div className="bg-gray-200 flex flex-col w-full gap-0.5 px-3 py-1.5 rounded-lg">
          <label htmlFor="codeinput" className="text-xs font-medium p-0">
            Code
          </label>
          <input
            type="text"
            id="codeinput"
            className="bg-transparent p-0 text-xs placeholder:text-xs tracking-wide border-none outline-none"
            placeholder="Enter Code"
            required
          />
        </div>

        {/* Login Button */}
        <div className="w-full">
          <Button className="w-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer font-semibold text-gray-950">
            Login
          </Button>
        </div>

        {/* Timer or Resend Button */}
        <div className="mt-1">
          {canResend ? (
            <Button
              onClick={handleResend}
              className="w-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer font-semibold text-gray-950 text-xs lg:text-sm"
            >
              Resend Code
            </Button>
          ) : (
            <p className="text-gray-600 text-[0.65rem] lg:text-xs">
              Resend code in{" "}
              <span className="font-medium text-gray-950">
                {formatTime(timer)}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Code;
