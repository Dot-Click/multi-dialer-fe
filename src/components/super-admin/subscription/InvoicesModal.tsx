import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInvoices, type Subscription } from "@/store/slices/subscriptionSlice";
import Loader from "@/components/common/Loader";

interface InvoicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
}

const statusStyles: Record<string, string> = {
  paid: "bg-[#D0FAE5] text-[#428E43]",
  open: "bg-[#FFF3C4] text-[#9A7B00]",
  void: "bg-gray-100 text-gray-500",
  uncollectible: "bg-[#FFE2E2] text-[#FB0000]",
};

const InvoicesModal = ({ isOpen, onClose, subscription }: InvoicesModalProps) => {
  const dispatch = useAppDispatch();
  const invoices = useAppSelector((state) =>
    subscription?.stripeCustomerId ? state.subscriptions.invoices[subscription.stripeCustomerId] : undefined
  );
  const loading = useAppSelector((state) =>
    subscription?.stripeCustomerId ? state.subscriptions.invoicesLoading[subscription.stripeCustomerId] : false
  );

  useEffect(() => {
    if (isOpen && subscription?.stripeCustomerId && invoices === undefined) {
      dispatch(fetchInvoices(subscription.stripeCustomerId));
    }
  }, [isOpen, subscription?.stripeCustomerId]);

  if (!isOpen || !subscription) return null;

  const formatAmount = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-[780px] rounded-[24px] shadow-xl relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 dark:border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-[#111] dark:text-white text-[20px] font-[600]">Invoices</h2>
            <p className="text-[#6B7280] dark:text-gray-400 text-[13px] mt-0.5">
              {subscription.user?.fullName || subscription.userId} — {subscription.stripeCustomerId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <IoClose className="text-[22px] text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto custom-scrollbar flex-1 p-6">
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <Loader fullPage={false} />
            </div>
          ) : !invoices || invoices.length === 0 ? (
            <div className="flex justify-center items-center h-[200px] text-gray-400 text-[14px]">
              No invoices found
            </div>
          ) : (
            <table className="w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  {["Invoice #", "Date", "Amount", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[13px] font-[600] text-[#1D2C45] dark:text-white bg-[#FAF9FE] dark:bg-slate-900 first:rounded-l-[8px] last:rounded-r-[8px]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="bg-[#FAFAFA] dark:bg-slate-700">
                    <td className="px-4 py-3 text-[13px] text-[#2C2C2C] dark:text-white rounded-l-[8px]">
                      {inv.number || inv.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#2C2C2C] dark:text-white">
                      {inv.created}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#2C2C2C] dark:text-white">
                      {inv.status === "paid"
                        ? formatAmount(inv.amount_paid)
                        : formatAmount(inv.amount_due)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-[12px] rounded-full capitalize ${
                          statusStyles[inv.status ?? ""] ?? "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {inv.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 rounded-r-[8px]">
                      <div className="flex items-center gap-3">
                        {inv.hosted_invoice_url ? (
                          <a
                            href={inv.hosted_invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] font-[500] text-[#2563EB] hover:underline"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-[13px] text-gray-300">View</span>
                        )}
                        {inv.invoice_pdf ? (
                          <a
                            href={inv.invoice_pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] font-[500] text-[#2563EB] hover:underline"
                          >
                            PDF
                          </a>
                        ) : (
                          <span className="text-[13px] text-gray-300">PDF</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="bg-[#F3F4F6] dark:bg-slate-700 text-[#374151] dark:text-white font-[500] px-6 py-2.5 rounded-[12px] hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors text-[14px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoicesModal;
