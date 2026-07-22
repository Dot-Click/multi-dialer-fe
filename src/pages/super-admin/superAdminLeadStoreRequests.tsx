import { useState } from "react";
import { useSuperAdminLeadStoreRequests, useSuperAdminMyPlusLeadsAccounts, useAccountPackages } from "@/hooks/useSuperAdminLeadStore";
import type { LeadStoreRequest } from "@/hooks/useSuperAdminLeadStore";
import { FiX } from "react-icons/fi";

const StatusBadge = ({ status }: { status: LeadStoreRequest["status"] }) => {
  const styles: Record<string, string> = {
    PENDING_SETUP: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400",
    ACTIVE: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
    CANCELLED: "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300",
  };
  return <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${styles[status]}`}>{status.replace("_", " ")}</span>;
};

const LinkAccountModal = ({ request, onClose }: { request: LeadStoreRequest; onClose: () => void }) => {
  const { linkAccount } = useSuperAdminLeadStoreRequests();
  const { accounts } = useSuperAdminMyPlusLeadsAccounts();
  const [selectedConfigId, setSelectedConfigId] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [error, setError] = useState("");
  const { packages, isLoading: isLoadingPackages, isError: packagesFailed, error: packagesError } = useAccountPackages(selectedConfigId || null);

  const sameCustomerAccounts = accounts.filter((a) => a.user.id === request.user.id);

  const handleSelectAccount = (configId: string) => {
    setSelectedConfigId(configId);
    setSelectedPackage("");
    setError("");
  };

  const handleSave = () => {
    if (!selectedConfigId) {
      setError("Select an account to link.");
      return;
    }
    if (!selectedPackage) {
      setError("Select which data package to assign.");
      return;
    }
    linkAccount.mutate(
      { leadStoreId: request.id, myPlusLeadsConfigId: selectedConfigId, assignedPackage: selectedPackage },
      { onSuccess: onClose },
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[1300] p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full p-8 relative border dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600">
          <FiX size={18} className="text-gray-600 dark:text-gray-300" />
        </button>

        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1">Link MyPlusLeads Account</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {request.service.name} for {request.user.fullName || request.user.email}
        </p>

        {sameCustomerAccounts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No MyPlusLeads accounts are registered for this customer yet. Add one from the <span className="font-bold">Accounts</span> tab first, then come back here to link it.
          </p>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Account</label>
              <select
                value={selectedConfigId}
                onChange={(e) => handleSelectAccount(e.target.value)}
                className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 dark:text-white mt-1"
              >
                <option value="">Select account…</option>
                {sameCustomerAccounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label || a.subAccountEmail || a.id}
                  </option>
                ))}
              </select>
            </div>

            {selectedConfigId && (
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Data package to assign
                </label>
                {isLoadingPackages ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Fetching packages from MyPlusLeads…</p>
                ) : packagesFailed ? (
                  <p className="text-sm text-red-500 mt-1">{packagesError || "Failed to fetch packages for this account."}</p>
                ) : packages.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This account has no listings yet — nothing to assign.</p>
                ) : (
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="w-full border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-slate-900 dark:text-white mt-1"
                  >
                    <option value="">Select package…</option>
                    {packages.map((p) => (
                      <option key={p.package} value={p.package}>
                        {p.package} ({p.count} leads)
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
        )}

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700">
            Cancel
          </button>
          {sameCustomerAccounts.length > 0 && (
            <button
              onClick={handleSave}
              disabled={linkAccount.isPending}
              className="px-5 py-2.5 rounded-lg text-sm font-bold bg-yellow-400 hover:bg-yellow-500 text-black disabled:opacity-60"
            >
              {linkAccount.isPending ? "Linking…" : "Link & Sync"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SuperAdminLeadStoreRequests = () => {
  const { requests, isLoading, unlinkAccount } = useSuperAdminLeadStoreRequests();
  const [linkingRequest, setLinkingRequest] = useState<LeadStoreRequest | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Lead Store Requests</h1>

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      ) : requests.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No Lead Store purchases yet.</p>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-slate-700">
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Linked Account</th>
                <th className="px-4 py-3 font-semibold">Purchased</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 dark:border-slate-700/50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 dark:text-white">{r.user.fullName || "—"}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{r.user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{r.service.name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                    {r.billingPaused && <div className="text-[10px] text-red-500 font-bold mt-1">BILLING PAUSED</div>}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {r.myPlusLeadsConfig ? (
                      <>
                        <div>{r.myPlusLeadsConfig.label || r.myPlusLeadsConfig.subAccountEmail}</div>
                        {r.assignedPackage && <div className="text-xs text-gray-500 dark:text-gray-400">Package: {r.assignedPackage}</div>}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    {r.status === "CANCELLED" ? null : r.myPlusLeadsConfig ? (
                      <button
                        onClick={() => unlinkAccount.mutate(r.id)}
                        className="text-xs font-bold text-gray-500 hover:text-red-600"
                      >
                        Reassign
                      </button>
                    ) : (
                      <button
                        onClick={() => setLinkingRequest(r)}
                        className="text-xs font-bold text-yellow-600 hover:underline"
                      >
                        Link Account
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {linkingRequest && <LinkAccountModal request={linkingRequest} onClose={() => setLinkingRequest(null)} />}
    </div>
  );
};

export default SuperAdminLeadStoreRequests;
