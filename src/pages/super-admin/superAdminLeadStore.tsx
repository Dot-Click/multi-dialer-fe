import { useState } from "react";
import SuperAdminLeadStoreRequests from "./superAdminLeadStoreRequests";
import SuperAdminLeadStoreAccounts from "./superAdminLeadStoreAccounts";

const TABS = [
  { key: "requests", label: "Requests" },
  { key: "accounts", label: "Accounts" },
] as const;

const SuperAdminLeadStore = () => {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("requests");

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === t.key
                ? "bg-yellow-400 text-black"
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "requests" ? <SuperAdminLeadStoreRequests /> : <SuperAdminLeadStoreAccounts />}
    </div>
  );
};

export default SuperAdminLeadStore;
