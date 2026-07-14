import { useEffect, useState } from "react";
import { FiCheckCircle, FiLoader, FiMail } from "react-icons/fi";
import toast from "react-hot-toast";
import { useSmtpSettings, type SmtpConfigFormValues } from "@/hooks/useSmtpSettings";

const EMPTY_FORM: SmtpConfigFormValues = {
  host: "",
  port: 587,
  secure: true,
  username: "",
  password: "",
  fromName: "",
  fromEmail: "",
};

const SmtpIntegration = () => {
  const { data: config, isLoading, saveAndTest, testConfig } = useSmtpSettings();
  const [form, setForm] = useState<SmtpConfigFormValues>(EMPTY_FORM);

  useEffect(() => {
    if (!config) return;
    setForm({
      host: config.host,
      port: config.port,
      secure: config.secure,
      username: config.username,
      password: "", // Never prefill the real password — leave blank unless changing it.
      fromName: config.fromName,
      fromEmail: config.fromEmail,
    });
  }, [config]);

  const handleChange = (field: keyof SmtpConfigFormValues, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAndTest = async () => {
    if (!form.host || !form.username || !form.fromEmail || !form.fromName) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!config && !form.password) {
      toast.error("Password is required to set up SMTP.");
      return;
    }

    try {
      const result: any = await saveAndTest(form);
      if (result?.success === false || result?.data?.error) {
        toast.error(result?.data?.message || result?.message || "SMTP test failed. Check your settings.");
      } else {
        toast.success("SMTP connection verified successfully!");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save or verify SMTP settings.");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex justify-center">
        <FiLoader className="animate-spin text-gray-400" size={24} />
      </div>
    );
  }

  const pending = testConfig.isPending;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
        <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center p-3 shrink-0">
          <FiMail size={36} className="text-gray-400" />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Email Sending (SMTP)</h3>
            {config?.isVerified && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                <FiCheckCircle size={12} /> Verified
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-lg">
            Connect your own SMTP server so emails your agents send come from your company's domain instead of the shared default.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">SMTP Host</label>
          <input
            type="text"
            value={form.host}
            onChange={(e) => handleChange("host", e.target.value)}
            placeholder="smtp.example.com"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Port</label>
          <input
            type="number"
            value={form.port}
            onChange={(e) => handleChange("port", Number(e.target.value))}
            placeholder="587"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="user@example.com"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder={config ? "••••••" : "Enter password"}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Default From Name</label>
          <input
            type="text"
            value={form.fromName}
            onChange={(e) => handleChange("fromName", e.target.value)}
            placeholder="Acme Realty"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Default From Email</label>
          <input
            type="email"
            value={form.fromEmail}
            onChange={(e) => handleChange("fromEmail", e.target.value)}
            placeholder="hello@acmerealty.com"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3 sm:col-span-2">
          <button
            type="button"
            onClick={() => handleChange("secure", !form.secure)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.secure ? "bg-yellow-400" : "bg-gray-300 dark:bg-slate-600"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.secure ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Secure (TLS/SSL)</span>
        </div>
      </div>

      <button
        onClick={handleSaveAndTest}
        disabled={pending}
        className="w-full sm:w-auto px-6 py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-lg hover:shadow-yellow-400/20 text-sm disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {pending ? <FiLoader className="animate-spin" /> : null}
        {pending ? "Testing..." : "Save & Test"}
      </button>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 leading-relaxed max-w-lg">
        Emails sent by agents will use this connection. Replies will be routed to the individual agent's email automatically.
      </p>
    </div>
  );
};

export default SmtpIntegration;
