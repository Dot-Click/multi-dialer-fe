import { useState } from "react";
import bgImage from "@/assets/resetpass-bg.svg";
import logoImage from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const RecoveryPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await authClient.forgetPassword({
        email: email.trim(),
        // better-auth appends ?token=XXX to this URL when emailing the link
        redirectTo: `${window.location.origin}/admin/create-password`,
      });
      setSent(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex justify-end lg:px-40 px-5 items-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white h-fit w-[24rem] lg:h-fit lg:w-100 rounded-xl flex gap-3 flex-col items-center py-7 lg:py-8 px-12">
        {/* Logo */}
        <div>
          <img src={logoImage} alt="Company Logo" className="object-contain w-48" />
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-xl lg:text-[1.65rem] font-semibold text-gray-950">
            Password Recovery
          </h1>
        </div>

        {sent ? (
          <div className="flex flex-col text-center items-center gap-2 my-2">
            <p className="text-sm text-green-600 font-medium">
              ✓ Reset link sent to <strong>{email}</strong>
            </p>
            <p className="text-xs text-gray-500">
              Check your inbox and click the link to set a new password.
              The link expires in 1 hour.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
            {/* Info text */}
            <p className="text-xs lg:text-sm text-gray-600 text-center">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            {/* Email input */}
            <div className="bg-gray-200 flex flex-col w-full gap-0.5 px-3 py-1.5 rounded-lg">
              <label htmlFor="email" className="text-xs font-medium p-0">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent p-0 text-xs placeholder:text-xs tracking-wide border-none outline-none"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            {/* Send button */}
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-yellow-400 hover:bg-yellow-500 cursor-pointer font-semibold text-gray-950 disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send Link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RecoveryPassword;
