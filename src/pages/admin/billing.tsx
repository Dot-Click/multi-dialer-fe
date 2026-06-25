import {
  Users,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Box } from "@/components/ui/box";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSubscriptions } from "@/store/slices/subscriptionSlice";
import { format, addMonths, subMonths, addYears, startOfMonth, endOfMonth } from "date-fns";
import toast from "react-hot-toast";
import api from "@/lib/axios";

interface BillingInvoice {
  id: string;
  number: string | null;
  plan: string;
  amount_paid: number;
  amount_due: number;
  currency: string;
  status: string;
  createdAt: string;
  created: string;
  hosted_invoice_url: string | null;
  invoice_pdf: string | null;
}

const Billing = () => {
  const dispatch = useAppDispatch();
  const [billingLoading, setBillingLoading] = useState(false);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  // null = "All Dates"; otherwise filter to that month
  const [filterMonth, setFilterMonth] = useState<Date | null>(null);

  const { subscriptions, loading, error } = useAppSelector(
    (state) => state.subscriptions,
  );

  useEffect(() => {
    dispatch(fetchSubscriptions());
    loadInvoices();
  }, [dispatch]);

  const loadInvoices = async () => {
    setInvoicesLoading(true);
    try {
      const res = await api.get("/billing/invoices/all");
      if (res.data.success) {
        setInvoices(res.data.data.invoices ?? []);
      }
    } catch (err: any) {
      console.error("[Billing] Failed to load invoices:", err);
    } finally {
      setInvoicesLoading(false);
    }
  };

  const filteredInvoices = filterMonth
    ? invoices.filter((inv) => {
        const d = new Date(inv.createdAt);
        return d >= startOfMonth(filterMonth) && d <= endOfMonth(filterMonth);
      })
    : invoices;

  const filterLabel = filterMonth ? format(filterMonth, "MMM yyyy") : "All Dates";

  const stepFilterMonth = (direction: "prev" | "next") => {
    if (filterMonth === null) {
      // Start from current month and go in the chosen direction
      setFilterMonth(direction === "prev" ? subMonths(new Date(), 1) : new Date());
    } else {
      setFilterMonth(direction === "prev" ? subMonths(filterMonth, 1) : addMonths(filterMonth, 1));
    }
  };

  const resetFilterMonth = () => setFilterMonth(null);

  const formatCurrency = (amount: string | undefined) => {
    if (!amount) return "$0";
    return amount.startsWith("$") ? amount : `$${amount}`;
  };

  const formatCents = (cents: number, currency = "usd") => {
    const dollars = cents / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(dollars);
  };

  const formatPlan = (plan: string) => {
    return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
  };

  const getStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === "PAID" || s === "ACTIVE") {
      return (
        <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-100 rounded-full px-3 py-1 text-xs font-medium">
          {status}
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-700 border-0 hover:bg-yellow-100 rounded-full px-3 py-1 text-xs font-medium">
        {status}
      </Badge>
    );
  };

  const sortedSubscriptions = [...subscriptions].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  const activeSubscription =
    sortedSubscriptions.find((s) => s.status.toLowerCase() === "active") ||
    sortedSubscriptions[0];

  const calculateUnitPrice = (amount: string | undefined, count: number) => {
    if (!amount || count === 0) return "0";
    const numAmount = parseFloat(amount.replace(/[^0-9.]/g, ""));
    return (numAmount / count).toFixed(0);
  };

  const calculateNextPaymentDate = (subscription: any) => {
    if (!subscription?.startDate) return "N/A";
    try {
      const date = new Date(subscription.startDate);
      if (subscription.billingCycle?.toLowerCase() === "yearly") {
        return format(addYears(date, 1), "MM/dd/yyyy");
      }
      return format(addMonths(date, 1), "MM/dd/yyyy");
    } catch (e) {
      return "N/A";
    }
  };

  const calculateTotalHistoryCost = () => {
    const totalCents = invoices.reduce((sum, inv) => sum + (inv.amount_paid || 0), 0);
    return (totalCents / 100).toFixed(2);
  };

  const handleManageBilling = async () => {
    setBillingLoading(true);
    try {
      const res = await api.get("/billing/portal");
      if (res.data.success && res.data.data.url) {
        window.location.href = res.data.data.url;
      } else {
        toast.error(res.data.message || "Failed to retrieve billing portal URL");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || error.message || "Failed to connect to billing portal";
      toast.error(errMsg);
    } finally {
      setBillingLoading(false);
    }
  };

  const handleDownloadInvoice = (inv: BillingInvoice) => {
    const url = inv.invoice_pdf || inv.hosted_invoice_url;
    if (!url) {
      toast.error("No PDF available for this invoice.");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleExport = () => {
    if (filteredInvoices.length === 0) {
      toast.error("No invoices to export.");
      return;
    }

    const headers = ["Invoice", "Plan", "Amount", "Date", "Status"];
    const rows = filteredInvoices.map((inv) => [
      inv.number ?? inv.id.slice(0, 12),
      inv.plan,
      formatCents(inv.amount_paid, inv.currency),
      format(new Date(inv.createdAt), "MM/dd/yyyy"),
      inv.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `billing-history-${filterMonth ? format(filterMonth, "yyyy-MM") : "all"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Export downloaded.");
  };

  return (
    <Box className="p-4 sm:p-6 min-h-screen">
      {/* Header Section */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-white mb-2">
          Billing
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Payment proceed automatically every month.
        </p>
      </div>

      {/* Current Plan Details Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <Badge className="bg-yellow-100 text-yellow-800 border-0 hover:bg-yellow-100 px-3 py-1 text-xs font-medium">
            {activeSubscription
              ? formatPlan(activeSubscription.plan) + " Plan"
              : "No Plan"}
          </Badge>
          <Button
            onClick={handleManageBilling}
            disabled={billingLoading}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 dark:text-black rounded-lg px-4 py-2 font-medium w-full sm:w-auto"
          >
            {billingLoading ? (
              <Loader2 className="size-4 animate-spin mr-2" />
            ) : (
              <CreditCard className="size-4 mr-2" />
            )}
            Manage Billing
          </Button>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              $
              {activeSubscription
                ? calculateUnitPrice(
                    activeSubscription.amount,
                    activeSubscription.usersCount,
                  )
                : "0"}
            </span>
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              /user/month
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 dark:bg-slate-700 rounded-lg flex-shrink-0">
              <Users className="size-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Users
              </div>
              <div className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {activeSubscription?.usersCount || 0}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 dark:bg-slate-700 rounded-lg flex-shrink-0">
              <CreditCard className="size-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Total cost
              </div>
              <div className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                ${calculateTotalHistoryCost()}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 dark:bg-slate-700 rounded-lg flex-shrink-0">
              <Calendar className="size-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Next Payment Date
              </div>
              <div className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                {activeSubscription
                  ? calculateNextPaymentDate(activeSubscription)
                  : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing History Section */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
              Billing History
            </h2>
            <div className="flex items-center gap-2 px-2 sm:px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-700 w-full sm:w-auto justify-center">
              <button
                onClick={() => stepFilterMonth("prev")}
                className="hover:text-gray-900 dark:hover:text-white text-gray-500 dark:text-gray-400 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={resetFilterMonth}
                className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white min-w-[80px] text-center transition-colors"
                title="Click to reset to All Dates"
              >
                {filterLabel}
              </button>
              <button
                onClick={() => stepFilterMonth("next")}
                className="hover:text-gray-900 dark:hover:text-white text-gray-500 dark:text-gray-400 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            className="rounded-md border-gray-200 dark:border-slate-700 dark:bg-slate-700 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 w-full sm:w-auto"
          >
            <Download className="size-4" />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
          {invoicesLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="animate-spin size-8 text-gray-400" />
            </div>
          ) : (
            <Table>
              <TableHeader className="sticky top-0 bg-white dark:bg-slate-800 z-10">
                <TableRow className="border-b border-gray-200 dark:border-slate-700 hover:bg-transparent dark:hover:bg-transparent">
                  <TableHead className="w-12 px-2 sm:px-4 py-3">
                    <Checkbox className="dark:border-white" />
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">
                    Invoice
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">
                    Plan
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">
                    Amount
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">
                    Date
                  </TableHead>
                  <TableHead className="text-gray-700 dark:text-gray-300 font-medium px-2 sm:px-4 py-3 whitespace-nowrap">
                    Status
                  </TableHead>
                  <TableHead className="w-12 px-2 sm:px-4 py-3"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv) => (
                    <TableRow
                      key={inv.id}
                      className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    >
                      <TableCell className="px-2 sm:px-4 py-4">
                        <Checkbox className="dark:border-white" />
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-4 text-sm sm:text-base">
                        #{inv.number ?? inv.id.slice(0, 12)}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-4 text-sm sm:text-base">
                        {formatPlan(inv.plan)}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 font-medium px-2 sm:px-4 py-4 text-sm sm:text-base">
                        {formatCents(inv.amount_paid, inv.currency)}
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300 px-2 sm:px-4 py-4 text-sm sm:text-base whitespace-nowrap">
                        {format(new Date(inv.createdAt), "MM/dd/yyyy")}
                      </TableCell>
                      <TableCell className="px-2 sm:px-4 py-4">
                        {getStatusBadge(inv.status)}
                      </TableCell>
                      <TableCell className="px-2 sm:px-4 py-4">
                        <button
                          onClick={() => handleDownloadInvoice(inv)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-md transition-colors"
                          title="Download invoice PDF"
                        >
                          <Download className="size-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-10 text-gray-500 dark:text-gray-400"
                    >
                      {filterMonth
                        ? `No invoices found for ${format(filterMonth, "MMMM yyyy")}.`
                        : "No billing history found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </Box>
  );
};

export default Billing;
