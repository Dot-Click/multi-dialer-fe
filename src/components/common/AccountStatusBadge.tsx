import React from "react";

/**
 * The one status badge for the super-admin surfaces.
 *
 * Every widget previously worked its own status out and they disagreed: Home
 * and User Management rendered the manual `User.status` field (so everyone read
 * ACTIVE regardless of billing), the Subscription table derived a TRIAL badge
 * from a predicate that is never true, and Reporting styled a status its data
 * could not contain. The backend now resolves one `accountStatus` per row
 * (services/accountStatus.service.ts) and this renders it — so the word and the
 * colour are the same everywhere.
 *
 * Suspension is shown as a SEPARATE chip rather than replacing the billing
 * status, because they answer different questions: "are they paying?" and "did
 * staff block them?". An account can be both.
 */

export type AccountStatus =
  | "TRIALING"
  | "ACTIVE"
  | "PAYMENT_FAILED"
  | "CANCELLING"
  | "CANCELLED"
  | "NO_SUBSCRIPTION";

export interface ResolvedAccountStatus {
  status: AccountStatus;
  label: string;
  isSuspended: boolean;
  periodEndsAt?: string | null;
  daysRemaining?: number | null;
  expiringSoon?: boolean;
}

const STYLES: Record<AccountStatus, string> = {
  // Paying and healthy — the only "all good" green.
  ACTIVE: "bg-[#E8F7E9] text-[#1B7F1F] dark:bg-[#14361A] dark:text-[#7BD97F]",
  // Live but time-limited: amber, reads as "needs attention soon".
  TRIALING: "bg-[#FFF6DB] text-[#8A6100] dark:bg-[#3A2E0A] dark:text-[#FFCD56]",
  // Actionable failure — the one a super-admin should chase.
  PAYMENT_FAILED: "bg-[#FDE7EC] text-[#B3123A] dark:bg-[#3D0F1B] dark:text-[#FF8FA8]",
  // Still working, but on the way out.
  CANCELLING: "bg-[#FFEDE0] text-[#9A4B00] dark:bg-[#3A210E] dark:text-[#FFB067]",
  // Over.
  CANCELLED: "bg-[#F1F2F4] text-[#4B5563] dark:bg-[#2A2F38] dark:text-[#9CA3AF]",
  // Never subscribed — neutral, not a failure.
  NO_SUBSCRIPTION: "bg-[#F1F2F4] text-[#6B7280] dark:bg-[#2A2F38] dark:text-[#9CA3AF]",
};

const SUSPENDED_STYLE = "bg-[#FDE7EC] text-[#B3123A] dark:bg-[#3D0F1B] dark:text-[#FF8FA8]";

const CHIP = "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap";

interface Props {
  accountStatus?: ResolvedAccountStatus | null;
  /** Show "· 3d left" next to a live status when the period is nearly up. */
  showDaysRemaining?: boolean;
  className?: string;
}

const AccountStatusBadge: React.FC<Props> = ({ accountStatus, showDaysRemaining = false, className = "" }) => {
  if (!accountStatus) {
    return <span className={`${CHIP} ${STYLES.NO_SUBSCRIPTION} ${className}`}>—</span>;
  }

  const { status, label, isSuspended, expiringSoon, daysRemaining } = accountStatus;
  const style = STYLES[status] ?? STYLES.NO_SUBSCRIPTION;

  const suffix =
    showDaysRemaining && expiringSoon && typeof daysRemaining === "number"
      ? ` · ${daysRemaining}d left`
      : "";

  return (
    <span className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
      <span className={`${CHIP} ${style}`}>
        {label}
        {suffix}
      </span>
      {isSuspended && <span className={`${CHIP} ${SUSPENDED_STYLE}`}>Suspended</span>}
    </span>
  );
};

export default AccountStatusBadge;

/** Filter options for status dropdowns — only values that can actually occur. */
export const ACCOUNT_STATUS_FILTERS: { value: AccountStatus | "SUSPENDED" | ""; label: string }[] = [
  { value: "", label: "All Status" },
  { value: "TRIALING", label: "Trialing" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAYMENT_FAILED", label: "Payment failed" },
  { value: "CANCELLING", label: "Cancelling" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SUBSCRIPTION", label: "No subscription" },
  { value: "SUSPENDED", label: "Suspended" },
];

/** Whether a row matches a selected filter value. */
export const matchesAccountStatusFilter = (
  accountStatus: ResolvedAccountStatus | null | undefined,
  filter: string,
): boolean => {
  if (!filter) return true;
  if (filter === "SUSPENDED") return Boolean(accountStatus?.isSuspended);
  return accountStatus?.status === filter;
};
