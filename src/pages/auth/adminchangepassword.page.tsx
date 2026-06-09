import { useState } from "react";
import bgImage from "@/assets/resetpass-bg.svg";
import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import api from "@/lib/axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const AdminChangePassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token. Please request a new link.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // better-auth reset-password endpoint
      await api.post("/auth/reset-password", {
        newPassword,
        token,
      });
      toast.success("Password reset successfully! Redirecting to login…");
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex justify-end lg:px-40 px-5 items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white h-fit w-[24rem] lg:w-[25rem] rounded-4xl flex flex-col gap-4 items-center py-10 px-12">
        {/* Logo */}
        <div>
          <img src={logoImage} alt="Company Logo" className="object-contain w-48" />
        </div>

        {/* Title */}
        <div>
          <h1 className="text-xl lg:text-[1.65rem] font-semibold text-black">
            Create New Password
          </h1>
        </div>

        {!token ? (
          <div className="text-center">
            <p className="text-sm text-red-500">
              This reset link is invalid or has already been used.
            </p>
            <a href="/admin/password-recovery" className="text-xs text-yellow-600 underline mt-2 inline-block">
              Request a new link
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
            {/* New Password */}
            <div className="flex flex-col w-full gap-1">
              <div className="bg-gray-200 flex flex-col gap-1 px-3 py-1.5 rounded-lg">
                <label htmlFor="newpassword" className="text-xs text-[#495057] font-medium p-0">
                  New Password
                </label>
                <div className="flex items-center justify-between">
                  <input
                    type={showNew ? "text" : "password"}
                    id="newpassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create new password"
                    className="bg-transparent p-0 text-xs placeholder:text-xs tracking-wide border-none outline-none w-full"
                    required
                    disabled={loading}
                  />
                  <span className="text-xl text-gray-700 cursor-pointer ml-2" onClick={() => setShowNew(!showNew)}>
                    {showNew ? <VscEyeClosed /> : <VscEye />}
                  </span>
                </div>
              </div>
              <p className="text-[0.6rem] text-gray-500 ml-1">
                At least 8 characters, 1 uppercase, 1 lowercase, 1 number
              </p>
            </div>

            {/* Confirm Password */}
            <div className="bg-gray-200 flex flex-col w-full gap-1 px-3 py-1.5 rounded-lg">
              <label htmlFor="confirmpassword" className="text-xs text-[#495057] font-medium p-0">
                Confirm New Password
              </label>
              <div className="flex items-center justify-between">
                <input
                  type={showConfirm ? "text" : "password"}
                  id="confirmpassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="bg-transparent p-0 text-xs placeholder:text-xs tracking-wide border-none outline-none w-full"
                  required
                  disabled={loading}
                />
                <span className="text-xl text-gray-700 cursor-pointer ml-2" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <VscEyeClosed /> : <VscEye />}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer font-semibold text-gray-950 disabled:opacity-50"
            >
              {loading ? "Saving…" : "Confirm"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminChangePassword;
