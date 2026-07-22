import { useState } from "react";
import { useSuperAdminMyPlusLeadsAccounts, useSuperAdminCustomers, useSuperAdminPortalAccounts } from "@/hooks/useSuperAdminLeadStore";
import type { MyPlusLeadsAccount } from "@/hooks/useSuperAdminLeadStore";
import { FiX } from "react-icons/fi";

const RegisterAccountModal = ({ onClose }: { onClose: () => void }) => {
  const { registerAccount } = useSuperAdminMyPlusLeadsAccounts();
  const { customers } = useSuperAdminCustomers();
  const { portalAccounts, isLoading: isLoadingPortalAccounts, isError: portalAccountsFailed, error: portalAccountsError } = useSuperAdminPortalAccounts();
  const [userId, setUserId] = useState("");
  const [selectedPortalAccountId, setSelectedPortalAccountId] = useState("");
  const [label, setLabel] = useState("");
  const [subAccountEmail, setSubAccountEmail] = useState("");
  const [subAccountPassword, setSubAccountPassword] = useState("");
  const [subAccountId, setSubAccountId] = useState("");
  const [error, setError] = useState("");

  const handleSelectPortalAccount = (portalAccountId: string) => {
    setSelectedPortalAccountId(portalAccountId);
    const account = portalAccounts.find((a) => a.id === portalAccountId);
    if (account) {
      setSubAccountEmail(account.email);
      setSubAccountId(account.id);
      setLabel(account.name);
    }
  };

  const handleSave = () => {
    if (!userId || !subAccountEmail || !subAccountPassword) {
      setError("Customer, account, and password are required.");
      return;
    }
    registerAccount.mutate(
      { userId, subAccountEmail, subAccountPassword, subAccountId: subAccountId || undefined, label: label || undefined },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[1300] p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full p-8 relative border dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600">
          <FiX size={18} className="text-gray-600 dark:text-gray-300" />
        </button>

        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">Register MyPlusLeads Account</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Records the login for an account you already created on MyPlusLeads' own site. This never creates anything on MyPlusLeads — it only stores credentials here so we can pull leads.
        </p>

        <div className="space-y-3">
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 dark:text-white"
          >
            <option value="">Select customer…</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName || c.email} ({c.email})
              </option>
            ))}
          </select>

          <div>
            {isLoadingPortalAccounts ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Fetching your MyPlusLeads accounts…</p>
            ) : portalAccountsFailed ? (
              <p className="text-sm text-red-500">{portalAccountsError || "Failed to fetch accounts from MyPlusLeads."}</p>
            ) : (
              <select
                value={selectedPortalAccountId}
                onChange={(e) => handleSelectPortalAccount(e.target.value)}
                className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 dark:text-white"
              >
                <option value="">Select MyPlusLeads account…</option>
                {portalAccounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.email} ({a.status})
                  </option>
                ))}
              </select>
            )}
          </div>

          <input
            placeholder="Label (optional, e.g. FSBO Bundle)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 dark:text-white"
          />
          <input
            placeholder="MyPlusLeads sub-account email"
            value={subAccountEmail}
            onChange={(e) => setSubAccountEmail(e.target.value)}
            className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 dark:text-white"
          />
          <input
            type="password"
            placeholder="MyPlusLeads sub-account password"
            value={subAccountPassword}
            onChange={(e) => setSubAccountPassword(e.target.value)}
            className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 dark:text-white"
          />
          <input
            placeholder="Sub-account ID (optional)"
            value={subAccountId}
            onChange={(e) => setSubAccountId(e.target.value)}
            className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 dark:text-white"
          />
        </div>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={registerAccount.isPending}
            className="px-5 py-2.5 rounded-lg text-sm font-bold bg-yellow-400 hover:bg-yellow-500 text-black disabled:opacity-60"
          >
            {registerAccount.isPending ? "Saving…" : "Save Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditAccountModal = ({ account, onClose }: { account: MyPlusLeadsAccount; onClose: () => void }) => {
  const { updateAccount } = useSuperAdminMyPlusLeadsAccounts();
  const [label, setLabel] = useState(account.label || "");
  const [subAccountEmail, setSubAccountEmail] = useState(account.subAccountEmail || "");
  const [subAccountPassword, setSubAccountPassword] = useState("");
  const [subAccountId, setSubAccountId] = useState(account.subAccountId || "");
  const [error, setError] = useState("");

  const handleSave = () => {
    if (!subAccountEmail) {
      setError("Email is required.");
      return;
    }
    updateAccount.mutate(
      {
        configId: account.id,
        subAccountEmail,
        subAccountPassword: subAccountPassword || undefined,
        subAccountId: subAccountId || undefined,
        label: label || undefined,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[1300] p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full p-8 relative border dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600">
          <FiX size={18} className="text-gray-600 dark:text-gray-300" />
        </button>

        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">Edit MyPlusLeads Account</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Fix a mis-entered credential — the new password (if changed) is re-validated against MyPlusLeads before saving.
        </p>

        <div className="space-y-3">
          <input
            placeholder="Label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 dark:text-white"
          />
          <input
            placeholder="MyPlusLeads sub-account email"
            value={subAccountEmail}
            onChange={(e) => setSubAccountEmail(e.target.value)}
            className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 dark:text-white"
          />
          <input
            type="password"
            placeholder="New password (leave blank to keep current)"
            value={subAccountPassword}
            onChange={(e) => setSubAccountPassword(e.target.value)}
            className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 dark:text-white"
          />
          <input
            placeholder="Sub-account ID (optional)"
            value={subAccountId}
            onChange={(e) => setSubAccountId(e.target.value)}
            className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 dark:text-white"
          />
        </div>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={updateAccount.isPending}
            className="px-5 py-2.5 rounded-lg text-sm font-bold bg-yellow-400 hover:bg-yellow-500 text-black disabled:opacity-60"
          >
            {updateAccount.isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

const SuperAdminLeadStoreAccounts = () => {
  const { accounts, isLoading } = useSuperAdminMyPlusLeadsAccounts();
  const [isAdding, setIsAdding] = useState(false);
  const [editingAccount, setEditingAccount] = useState<MyPlusLeadsAccount | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">MyPlusLeads Accounts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Every MyPlusLeads account you've registered, and which customer purchases each is linked to.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2.5 rounded-lg text-sm font-bold bg-yellow-400 hover:bg-yellow-500 text-black shrink-0"
        >
          Register Account
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      ) : accounts.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No MyPlusLeads accounts have been registered yet.</p>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-700">
                <th className="px-4 py-3 font-semibold">Account</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Linked Purchases</th>
                <th className="px-4 py-3 font-semibold"></th>
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
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setEditingAccount(a)} className="text-xs font-bold text-yellow-600 hover:underline">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isAdding && <RegisterAccountModal onClose={() => setIsAdding(false)} />}
      {editingAccount && <EditAccountModal account={editingAccount} onClose={() => setEditingAccount(null)} />}
    </div>
  );
};

export default SuperAdminLeadStoreAccounts;
