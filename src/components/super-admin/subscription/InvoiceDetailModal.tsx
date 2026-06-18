import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchInvoiceDetail, clearInvoiceDetail } from "@/store/slices/subscriptionSlice";
import Loader from "@/components/common/Loader";

interface InvoiceDetailModalProps {
  isOpen: boolean;
  invoiceId: string | null;
  onClose: () => void;
}

const InvoiceDetailModal = ({ isOpen, invoiceId, onClose }: InvoiceDetailModalProps) => {
  const dispatch = useAppDispatch();
  const invoice = useAppSelector((state) => state.subscriptions.invoiceDetail);
  const loading = useAppSelector((state) => state.subscriptions.invoiceDetailLoading);

  useEffect(() => {
    if (isOpen && invoiceId) {
      dispatch(fetchInvoiceDetail(invoiceId));
    }
    return () => {
      dispatch(clearInvoiceDetail());
    };
  }, [isOpen, invoiceId, dispatch]);

  if (!isOpen) return null;

  const cur = (invoice?.currency || "usd").toUpperCase();
  const money = (cents: number) =>
    `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-slate-800 w-full max-w-[760px] rounded-[16px] shadow-xl relative animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors z-10"
        >
          <IoClose className="text-[22px] text-gray-500 dark:text-gray-400" />
        </button>

        <div className="overflow-y-auto custom-scrollbar flex-1">
          {loading || !invoice ? (
            <div className="flex justify-center items-center h-[320px]">
              <Loader fullPage={false} />
            </div>
          ) : (
            <div className="px-10 py-9 text-[#1A1A1A] dark:text-gray-100">
              {/* Header: title + seller name */}
              <div className="flex justify-between items-start gap-4 mb-8">
                <h1 className="text-[30px] font-[700] leading-none">Invoice</h1>
                <span className="text-[22px] font-[500] text-gray-400 dark:text-gray-400 text-right">
                  {invoice.accountName || "—"}
                </span>
              </div>

              {/* Meta rows */}
              <div className="text-[13.5px] leading-[1.7] mb-7">
                <div className="flex">
                  <span className="w-[120px] font-[600]">Invoice number</span>
                  <span>{invoice.number || invoice.id}</span>
                </div>
                <div className="flex">
                  <span className="w-[120px] font-[600]">Date of issue</span>
                  <span>{invoice.created || "—"}</span>
                </div>
                <div className="flex">
                  <span className="w-[120px] font-[600]">Date due</span>
                  <span>{invoice.dueDate || invoice.created || "—"}</span>
                </div>
              </div>

              {/* Seller + Bill to */}
              <div className="grid grid-cols-2 gap-8 mb-9 text-[13.5px] leading-[1.7]">
                <div>
                  <p className="font-[700] mb-0.5">{invoice.accountName || "—"}</p>
                  {invoice.sellerAddressLines.map((l, i) => (
                    <p key={i} className="text-[#444] dark:text-gray-300">{l}</p>
                  ))}
                  {invoice.sellerPhone && (
                    <p className="text-[#444] dark:text-gray-300">{invoice.sellerPhone}</p>
                  )}
                </div>
                <div>
                  <p className="font-[700] mb-0.5">Bill to</p>
                  <p className="text-[#444] dark:text-gray-300">{invoice.customerName || "—"}</p>
                  {invoice.customerAddressLines.map((l, i) => (
                    <p key={i} className="text-[#444] dark:text-gray-300">{l}</p>
                  ))}
                  {invoice.customerPhone && (
                    <p className="text-[#444] dark:text-gray-300">{invoice.customerPhone}</p>
                  )}
                  {invoice.customerEmail && (
                    <p className="text-[#444] dark:text-gray-300">{invoice.customerEmail}</p>
                  )}
                </div>
              </div>

              {/* Amount due headline */}
              <h2 className="text-[22px] font-[700] mb-2">
                {money(invoice.amountDue > 0 ? invoice.amountDue : invoice.total)} {cur}
                {(invoice.dueDate || invoice.created) && (
                  <span> due {invoice.dueDate || invoice.created}</span>
                )}
              </h2>
              {invoice.hosted_invoice_url && (
                <a
                  href={invoice.hosted_invoice_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] font-[500] text-[#635BFF] hover:underline"
                >
                  Pay online
                </a>
              )}

              {/* Line items */}
              <table className="w-full mt-8 text-[13.5px]">
                <thead>
                  <tr className="border-b border-gray-300 dark:border-slate-600">
                    <th className="text-left font-[600] pb-2">Description</th>
                    <th className="text-right font-[600] pb-2 w-[60px]">Qty</th>
                    <th className="text-right font-[600] pb-2 w-[110px]">Unit price</th>
                    <th className="text-right font-[600] pb-2 w-[110px]">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-5 text-center text-gray-400">No line items</td>
                    </tr>
                  ) : (
                    invoice.lineItems.map((li) => (
                      <tr key={li.id} className="align-top">
                        <td className="py-3 pr-4">
                          <div>{li.description || "—"}</div>
                          {li.periodStart && li.periodEnd && (
                            <div className="text-[#777] dark:text-gray-400 text-[12.5px]">
                              {li.periodStart} – {li.periodEnd}
                            </div>
                          )}
                        </td>
                        <td className="py-3 text-right">{li.quantity ?? 1}</td>
                        <td className="py-3 text-right">{money(li.unitAmount)}</td>
                        <td className="py-3 text-right">{money(li.amount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-2 ml-auto w-full sm:w-[55%]">
                <div className="flex justify-between py-2 border-t border-gray-200 dark:border-slate-600 text-[13.5px]">
                  <span>Subtotal</span>
                  <span>{money(invoice.subtotal)}</span>
                </div>
                {invoice.tax > 0 && (
                  <div className="flex justify-between py-2 border-t border-gray-200 dark:border-slate-600 text-[13.5px]">
                    <span>Tax</span>
                    <span>{money(invoice.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-t border-gray-200 dark:border-slate-600 text-[13.5px]">
                  <span>Total</span>
                  <span>{money(invoice.total)}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200 dark:border-slate-600 text-[13.5px] font-[700]">
                  <span>Amount due</span>
                  <span>{money(invoice.amountDue > 0 ? invoice.amountDue : invoice.total)} {cur}</span>
                </div>
                {invoice.amountPaid > 0 && (
                  <div className="flex justify-between py-2 text-[13.5px] text-[#428E43]">
                    <span>Amount paid</span>
                    <span>{money(invoice.amountPaid)}</span>
                  </div>
                )}
              </div>

              {/* Payment method */}
              {invoice.paymentMethod?.last4 && (
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-slate-600 text-[13.5px]">
                  <span className="font-[600]">Paid with </span>
                  {invoice.paymentMethod.brand && (
                    <span className="capitalize">{invoice.paymentMethod.brand} </span>
                  )}
                  <span className="tracking-[0.15em] text-gray-400">••••</span>{" "}
                  <span>{invoice.paymentMethod.last4}</span>
                  {invoice.paymentMethod.expMonth && invoice.paymentMethod.expYear && (
                    <span className="text-gray-400">
                      {" "}({String(invoice.paymentMethod.expMonth).padStart(2, "0")}/
                      {String(invoice.paymentMethod.expYear).slice(-2)})
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-10 py-4 border-t border-gray-100 dark:border-slate-700 flex-shrink-0 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            {invoice?.hosted_invoice_url && (
              <a
                href={invoice.hosted_invoice_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-[500] text-[#2563EB] hover:underline"
              >
                Open in Stripe
              </a>
            )}
            {invoice?.invoice_pdf && (
              <a
                href={invoice.invoice_pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-[500] text-[#2563EB] hover:underline"
              >
                Download PDF
              </a>
            )}
          </div>
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

export default InvoiceDetailModal;
