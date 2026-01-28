import { useEffect, useState } from "react";
import bgImage from "@/assets/bg.png";
import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login, setAuthData, logout } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

const Login: React.FC = () => {
  const [isAdminLogin, setIsAdminLogin] = useState<boolean>(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, role: currentRole } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      if (currentRole === 'AGENT') navigate("/");
      else if (currentRole === 'ADMIN') navigate("/admin");
    }
  }, [isAuthenticated, currentRole, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Step 1: Login call
      const loginAction = await dispatch(login({ email, password }));

      if (login.rejected.match(loginAction)) {
        const errorMsg = loginAction.payload as string;
        toast.error(errorMsg || "Login failed");
        return;
      }

      const payload = loginAction.payload;
      const token = payload.token;

      // The login response includes user.role or session.role
      const userRole = payload.user?.role || payload.session?.role;

      // Step 2: Role validation
      if (!payload || !userRole || userRole !== 'AGENT') {
        dispatch(logout());
        toast.error("No agent found with this email");
        return;
      }

      // Step 3: Save session & role to localStorage
      dispatch(setAuthData({ token, role: 'AGENT', session: payload }));

      toast.success("Login successful");

      // Step 4: Redirect
      navigate("/");

    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div
        className="h-screen w-full bg-cover work-sans bg-center flex justify-end lg:px-40 px-5 items-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="bg-white h-[27rem] w-[25rem] lg:h-[27rem] lg:w-[25rem] rounded-[32px] flex flex-col items-center gap-3 py-[48px] px-[32px] shadow-lg">
          <img src={logoImage} alt="Logo" className="object-contain w-48" />
          <h1 className="text-xl lg:text-[28px] font-[500] text-black">Log in to your account</h1>

          <div className="flex gap-3 my-2">
            <Button
              className={`${!isAdminLogin ? "bg-[#0E1011] text-white" : "bg-transparent text-[#0E1011] hover:text-gray-100"} border border-gray-400 hover:bg-[#0E1011] cursor-pointer text-[14px] font-[500]`}
              onClick={() => { setIsAdminLogin(false); navigate("/agent/login"); }}
            >
              As Agent
            </Button>
            <Button
              className={`${isAdminLogin ? "bg-[#0E1011] text-white" : "bg-transparent text-[#0E1011] hover:text-gray-100"} border border-gray-400 hover:bg-[#0E1011] cursor-pointer text-[14px] font-[500]`}
              onClick={() => { setIsAdminLogin(true); navigate("/admin/login"); }}
            >
              As Admin
            </Button>
          </div>

          <form className="w-full flex flex-col gap-3" onSubmit={handleLogin}>
            <div className="bg-gray-200 flex flex-col w-full gap-0.5 px-3 py-1.5 rounded-lg">
              <label htmlFor="email" className="text-xs text-[#495057] font-medium p-0">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter Your Email"
                className="bg-transparent p-0 text-xs placeholder:text-xs tracking-wide border-none outline-none focus-visible:ring-0"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="bg-gray-200 flex flex-col w-full gap-1 px-3 py-1.5 rounded-lg">
              <label htmlFor="password" className="text-xs text-[#495057] font-medium p-0">Password</label>
              <div className="flex items-center justify-between">
                <input
                  type={showCurrent ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  className="bg-transparent p-0 text-xs placeholder:text-xs tracking-wide border-none outline-none w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="text-xl text-gray-700 cursor-pointer ml-2" onClick={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <VscEyeClosed /> : <VscEye />}
                </span>
              </div>
            </div>

            <div className="flex justify-end w-full">
              <a href="/agent/change-password" className="text-gray-600 text-[0.65rem] lg:text-xs">Forget your password?</a>
            </div>

            <Button type="submit" className="w-full bg-[#FFCA06] hover:bg-yellow-500 py-[8px] px-[24px] rounded-[12px] cursor-pointer font-[500] text-[#000000] text-[16px]">
              Log In
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
