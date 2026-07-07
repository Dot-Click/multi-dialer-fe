import { useState, useEffect, useRef } from "react";
import searchIcon from "@/assets/searchIcon.png";
import downarrow from "@/assets/downarrow.png";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllSubscriptions, type Subscription } from "@/store/slices/subscriptionSlice";
import Loader from "@/components/common/Loader";
import ChangePlanModal from "./ChangePlanModal";
import InvoicesModal from "./InvoicesModal";


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

const SubscriptionTable = () => {
  const dispatch = useAppDispatch();
  const { subscriptions, loading } = useAppSelector((state) => state.subscriptions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("All Plans");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [changePlanSub, setChangePlanSub] = useState<Subscription | null>(null);
  const [invoicesSub, setInvoicesSub] = useState<Subscription | null>(null);

  const plans = ["All Plans", "STARTER", "PROFESSIONAL", "ENTERPRISE"];
  const statuses = ["All Status", "ACTIVE", "TRIAL", "CANCELLED", "EXPIRED", "PENDING"];

  useEffect(() => {
    dispatch(getAllSubscriptions());
  }, [dispatch]);

  const getEffectiveStatus = (item: Subscription) => {
    const isCancelled = ["CANCELLED", "CANCELED", "canceled"].includes(item.status);
    const isOnTrial = item.user?.trialStatus === "ACTIVE" && !item.user?.isSubscribed;
    return isOnTrial && !isCancelled ? "TRIAL" : item.status;
  };

  const getPaymentStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
      case "PAID":
        return "bg-[#D0FAE5] text-[#428E43]";
      case "TRIAL":
        return "bg-[#E0F0FF] text-[#1D6FA8]";
      case "PENDING":
        return "bg-[#FFF3C4] text-[#9A7B00]";
      case "CANCELLED":
        return "bg-[#F3F4F6] text-[#6B7280]";
      case "EXPIRED":
      case "OVERDUE":
        return "bg-[#FFE2E2] text-[#FB0000]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredData = subscriptions.filter((item) => {
    const username = item.user?.fullName || "";
    const matchesSearch =
      username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.stripeCustomerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlan =
      selectedPlan === "All Plans" || item.plan.toUpperCase() === selectedPlan.toUpperCase();

    const effectiveStatus = getEffectiveStatus(item);
    const matchesStatus =
      selectedStatus === "All Status" || effectiveStatus.toUpperCase() === selectedStatus.toUpperCase();

    return matchesSearch && matchesPlan && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader fullPage={false} />
      </div>
    );
  }

  return (
    <>
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 mt-5">
      <h1 className="text-[20px] font-medium text-[#111] dark:text-white mb-4">
        Subscription List
      </h1>

      {/* ===== FILTERS ===== */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex items-center gap-3 bg-[#F2F2F2] dark:bg-slate-700 rounded-[11.56px] px-3 h-[40px] w-full md:w-[60%]">
          <img src={searchIcon} className="h-[16px]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user name or customer ID..."
            className="bg-transparent w-full outline-none text-[13.53px] text-[#2C2C2C] dark:text-white"
          />
        </div>

        <div className="flex gap-4">
          <CustomSelect
            value={selectedPlan}
            onChange={setSelectedPlan}
            options={plans}
            placeholder="All Plans"
          />
          <CustomSelect
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={statuses}
            placeholder="All Status"
          />
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          <table className="w-full min-w-[1200px] border-separate border-spacing-y-3">
            <thead>
              <tr>
                {[
                  "Username",
                  "Plan",
                  "Stripe Customer ID",
                  "Card",
                  "Agents",
                  "Status",
                  "Billing Cycle",
                  "Start Date",
                  "End Date",
                  "Action",
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
              {filteredData.map((row) => (
                <tr
                  key={row.id}
                  className="bg-[#FAFAFA] dark:bg-slate-700 font-[400] rounded-[9.02px]"
                >
                  <td className="px-5 py-4 rounded-l-[9.02px] text-[13.53px] font-medium text-[#2C2C2C] dark:text-white">
                    {row.user?.fullName || "N/A"}
                  </td>
                  <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                    {row.plan}
                  </td>
                  <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                    {row.stripeCustomerId || "N/A"}
                  </td>
                  <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white whitespace-nowrap">
                    {row.cardBrand && row.cardLast4 ? (
                      <span>
                        {row.cardBrand.toUpperCase()} •••• {row.cardLast4}
                        {row.cardExpMonth && row.cardExpYear && (
                          <span className="text-gray-400"> ({String(row.cardExpMonth).padStart(2, "0")}/{String(row.cardExpYear).slice(-2)})</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-400">No card on file</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                    {row.usersCount}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 text-[13.53px] rounded-[75.17px] ${getPaymentStatusStyles(
                        getEffectiveStatus(row),
                      )}`}
                    >
                      {getEffectiveStatus(row)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                    {row.billingCycle}
                  </td>
                  <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                    {new Date(row.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                    {row.endDate ? new Date(row.endDate).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="px-5 py-4 rounded-r-[9.02px]">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setChangePlanSub(row)}
                        className="text-[13px] font-[500] text-[#2563EB] hover:underline whitespace-nowrap"
                      >
                        Change Plan
                      </button>
                      <button
                        onClick={() => setInvoicesSub(row)}
                        className="text-[13px] font-[500] text-[#6B7280] hover:text-[#2563EB] hover:underline whitespace-nowrap"
                      >
                        Invoices
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-10 text-gray-500 dark:text-gray-400">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ChangePlanModal
      isOpen={changePlanSub !== null}
      subscription={changePlanSub}
      onClose={() => setChangePlanSub(null)}
      onSuccess={() => dispatch(getAllSubscriptions())}
    />
    <InvoicesModal
      isOpen={invoicesSub !== null}
      subscription={invoicesSub}
      onClose={() => setInvoicesSub(null)}
    />
    </>
  );
};

export default SubscriptionTable;
