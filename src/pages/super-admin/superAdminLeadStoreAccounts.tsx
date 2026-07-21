import { useSuperAdminMyPlusLeadsAccounts } from "@/hooks/useSuperAdminLeadStore";

const SuperAdminLeadStoreAccounts = () => {
  const { accounts, isLoading } = useSuperAdminMyPlusLeadsAccounts();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">MyPlusLeads Accounts</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Every MyPlusLeads account entered so far, and which customer purchases each is linked to. New accounts are entered from the Lead Store Requests screen when linking a purchase.
      </p>

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      ) : accounts.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No MyPlusLeads accounts have been entered yet.</p>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-700">
                <th className="px-4 py-3 font-semibold">Account</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Linked Purchases</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.id} className="border-b border-gray-50 dark:border-slate-700/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">{a.label || "—"}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{a.subAccountEmail}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900 dark:text-white">{a.user.fullName || "—"}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{a.user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        a.status === "CONNECTED"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                          : "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {a.leadStores.length > 0 ? a.leadStores.map((ls) => ls.title).join(", ") : "Unlinked"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuperAdminLeadStoreAccounts;
