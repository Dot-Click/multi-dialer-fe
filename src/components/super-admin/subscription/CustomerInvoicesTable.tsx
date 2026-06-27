import { useState, useEffect, useRef } from "react";
import searchIcon from "@/assets/searchIcon.png";
import downarrow from "@/assets/downarrow.png";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllInvoices } from "@/store/slices/subscriptionSlice";
import Loader from "@/components/common/Loader";
import InvoiceDetailModal from "./InvoiceDetailModal";

// "visa" → "Visa", "mastercard" → "Mastercard"
const formatBrand = (brand: string | null) =>
  brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : "Card";

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
}

const CustomSelect = ({ value, onChange, options, placeholder }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-[#F2F2F2] dark:bg-slate-700 h-[40px] px-4 rounded-[11.56px] text-[13.53px] text-[#2C2C2C] dark:text-white w-[150px] cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
      >
        <span className="truncate">{value || placeholder}</span>
        <img
          src={downarrow}
          className={`h-1.5 dark:invert transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-600 rounded-[11.56px] shadow-lg z-50 py-2 max-h-[200px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-1">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`px-4 py-2 text-[13.53px] cursor-pointer hover:bg-[#F2F2F2] dark:hover:bg-slate-700 transition-colors ${
                value === option ? "text-[#2563EB] font-medium bg-blue-50 dark:bg-blue-900/20" : "text-[#2C2C2C] dark:text-white"
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const statusStyles: Record<string, string> = {
  paid: "bg-[#D0FAE5] text-[#428E43]",
  trial: "bg-[#E0F0FF] text-[#1D6FA8]",
  pending: "bg-[#FFF3C4] text-[#9A7B00]",
  failed: "bg-[#FFE2E2] text-[#FB0000]",
  refunded: "bg-gray-100 text-gray-500",
};

const CustomerInvoicesTable = () => {
  const dispatch = useAppDispatch();
  const { allInvoices, allInvoicesLoading, stripeMode } =
    useAppSelector((state) => state.subscriptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [detailInvoiceId, setDetailInvoiceId] = useState<string | null>(null);

  const statuses = ["All Status", "paid", "trial", "pending", "failed", "refunded"];

  useEffect(() => {
    dispatch(fetchAllInvoices());
  }, [dispatch]);

  const formatAmount = (cents: number, currency: string) =>
    `${currency ? currency.toUpperCase() + " " : "$"}${(cents / 100).toFixed(2)}`;

  const filteredData = allInvoices.filter((inv) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (inv.customerName || "").toLowerCase().includes(term) ||
      (inv.customerEmail || "").toLowerCase().includes(term) ||
      (inv.number || "").toLowerCase().includes(term) ||
      inv.customerId.toLowerCase().includes(term);

    const effectiveStatus = inv.isOnTrial ? "trial" : (inv.status ?? "");
    const matchesStatus =
      selectedStatus === "All Status" || effectiveStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 mt-5">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-[20px] font-medium text-[#111] dark:text-white">
          Customer Invoices
        </h1>
        {stripeMode && (
          <span
            className={`px-3 py-1 text-[11.5px] font-medium rounded-full uppercase tracking-wide ${
              stripeMode === "live"
                ? "bg-[#D0FAE5] text-[#428E43]"
                : "bg-[#FFF3C4] text-[#9A7B00]"
            }`}
          >
            {stripeMode === "live" ? "Live" : "Sandbox"}
          </span>
        )}
      </div>

      {/* ===== FILTERS ===== */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex items-center gap-3 bg-[#F2F2F2] dark:bg-slate-700 rounded-[11.56px] px-3 h-[40px] w-full md:w-[60%]">
          <img src={searchIcon} className="h-[16px]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer, email or invoice #..."
            className="bg-transparent w-full outline-none text-[13.53px] text-[#2C2C2C] dark:text-white"
          />
        </div>

        <div className="flex gap-4">
          <CustomSelect
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statuses}
            placeholder="All Status"
          />
        </div>
      </div>

      {/* ===== TABLE ===== */}
      {allInvoicesLoading ? (
        <div className="flex justify-center items-center h-[300px]">
          <Loader fullPage={false} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full min-w-[1000px] border-separate border-spacing-y-3">
              <thead>
                <tr>
                  {[
                    "Customer",
                    "Plan",
                    "Invoice #",
                    "Amount",
                    "Payment Method",
                    "Status",
                    "Date",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-5 py-3 text-left text-[15.03px] bg-[#FAF9FE] dark:bg-slate-900 font-[500] text-[#1D2C45] dark:text-white sticky top-0 z-10"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredData.map((inv) => (
                  <tr
                    key={inv.id}
                    className="bg-[#FAFAFA] dark:bg-slate-700 font-[400] rounded-[9.02px]"
                  >
                    <td className="px-5 py-4 rounded-l-[9.02px] text-[13.53px] text-[#2C2C2C] dark:text-white">
                      <div className="font-medium">{inv.customerName || "N/A"}</div>
                      <div className="text-[11.5px] text-gray-500 dark:text-gray-400">
                        {inv.customerEmail || inv.customerId}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                      {inv.plan}
                    </td>
                    <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                      {inv.number || inv.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                      {inv.status === "paid"
                        ? formatAmount(inv.amount_paid, inv.currency)
                        : formatAmount(inv.amount_due, inv.currency)}
                    </td>
                    <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                      {inv.paymentMethod?.last4 ? (
                        <span className="whitespace-nowrap">
                          {formatBrand(inv.paymentMethod.brand)} •••• {inv.paymentMethod.last4}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {(() => {
                        const effectiveStatus = inv.isOnTrial ? "trial" : (inv.status ?? "");
                        return (
                          <span
                            className={`px-3 py-1 text-[13.53px] rounded-[75.17px] capitalize ${
                              statusStyles[effectiveStatus] ?? "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {effectiveStatus || "—"}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                      {inv.created}
                    </td>
                    <td className="px-5 py-4 rounded-r-[9.02px]">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setDetailInvoiceId(inv.id)}
                          className="text-[13px] font-[500] text-[#2563EB] hover:underline"
                        >
                          View
                        </button>
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

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-500 dark:text-gray-400">
                      No invoices found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>

    <InvoiceDetailModal
      isOpen={detailInvoiceId !== null}
      invoiceId={detailInvoiceId}
      onClose={() => setDetailInvoiceId(null)}
    />
    </>
  );
};

export default CustomerInvoicesTable;
