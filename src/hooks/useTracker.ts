import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

/* ------------------------------------------------------------------ types */
/** Mirrors src/domain/prospecting/types.ts on the backend — kept in sync by hand,
 * since the domain layer is intentionally dependency-free and not shared as a package. */

export type StageId =
  | "hours" | "contacts" | "leads" | "apptsSet" | "apptsMet"
  | "listingsTaken" | "underContract" | "closed" | "gci";

export interface BusinessPlanInputs {
  netIncomeGoal: number;
  avgCommissionRatePct: number;
  avgPricePoint: number;
  profitMarginPct: number;
  contactsPerHour: number;
  contactToLeadPct: number;
  leadToSetPct: number;
  setToMetPct: number;
  metToTakenPct: number;
  takenToClosedPct: number;
  takenToUnderContractPct: number;
  underContractToClosedPct: number;
  includeUnderContract: boolean;
  calendar: { workingWeeksPerYear: number; workingDaysPerWeek: number };
}

export interface PlanResponse {
  planYear: number;
  isDefault: boolean;
  inputs: BusinessPlanInputs;
}

export interface PlanTargets {
  avgCommission: number; gciNeeded: number; closed: number; underContract: number;
  listingsTaken: number; apptsMet: number; apptsSet: number; leads: number;
  contacts: number; hours: number;
}

export interface SessionTotals {
  sessions: number; daysLogged: number; daysProspected: number;
  hours: number; contacts: number; leads: number; apptsSet: number; apptsMet: number;
  listingsTaken: number; underContract: number; closed: number; gci: number;
}

export interface ActualKpis {
  contactsPerHour: number | null; contactToLead: number | null; leadToSet: number | null;
  setToMet: number | null; metToTaken: number | null; takenToUnderContract: number | null;
  underContractToClosed: number | null; takenToClosed: number | null;
  gciPerHour: number | null; gciPerContact: number | null; gciPerLead: number | null;
  gciPerClosing: number | null; contactsPerClosing: number | null; hoursPerClosing: number | null;
  leadsPerHour: number | null; avgHoursPerDayProspected: number | null;
}

export interface StageAttainment {
  stage: StageId; actual: number; target: number; attainment: number | null;
}

export type DashboardPeriod = "today" | "this_week" | "this_month" | "this_year" | "all_time";

export interface DashboardResponse {
  period: { key: DashboardPeriod; from: string; to: string };
  totals: SessionTotals;
  kpis: ActualKpis;
  targets: PlanTargets;
  attainment: StageAttainment[];
  streak: { length: number; lastLogged: string | null; isActive: boolean };
  coverage: { days: Array<{ date: string; logged: boolean; weekend: boolean }>; hits: number; weekdays: number };
  pace: {
    gciToDate: number; gciTarget: number; elapsedFraction: number | null;
    projectedGci: number | null; onPace: boolean | null;
  };
}

export interface FunnelResponse {
  range: { from: string; to: string; source: string | null };
  stages: Array<{ id: StageId; value: number }>;
  steps: Array<{ from: StageId; to: StageId; label: string; kpiKey: string; display: "rate" | "pct"; value: number | null }>;
  /** Lead disposition → Listing Taken disposition, spanning appt set + met.
   *  null when there are no leads — not computable, which is not zero. */
  leadToTaken: number | null;
}

export interface ChannelRow {
  source: string;
  totals: SessionTotals;
  kpis: ActualKpis;
}

export interface SessionRowResponse {
  id: string;
  loggedOn: string;
  source: string | null;
  isOverride: boolean;
  hours: string | number;
  contacts: number;
  leads: number;
  apptsSet: number;
  apptsMet: number;
  listingsTaken: number;
  underContract: number;
  closed: number;
  gci: string | number;
  notes: string | null;
  createdAt: string;
}

export interface SessionInput {
  loggedOn: string;
  source: string | null;
  hours: number;
  contacts: number;
  leads: number;
  apptsSet: number;
  apptsMet: number;
  listingsTaken: number;
  underContract: number;
  closed: number;
  gci: number;
  notes?: string | null;
}

export interface LeaderboardRow {
  userId: string; name: string; contacts: number; leads: number; closed: number; gci: number;
}

const TRACKER_KEY = "tracker";

/* ------------------------------------------------------------------- plan */

export function usePlan(year: number) {
  return useQuery({
    queryKey: [TRACKER_KEY, "plan", year],
    queryFn: async (): Promise<PlanResponse> => {
      const res = await api.get(`/tracker/plan`, { params: { year } });
      return res.data.data;
    },
  });
}

export function useSavePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ planYear, inputs }: { planYear: number; inputs: BusinessPlanInputs }) => {
      const res = await api.put(`/tracker/plan`, { planYear, inputs });
      return res.data.data as PlanResponse;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TRACKER_KEY] });
    },
  });
}

export function usePlanTargets(year: number, period: "yearly" | "monthly" | "weekly" | "daily") {
  return useQuery({
    queryKey: [TRACKER_KEY, "plan-targets", year, period],
    queryFn: async (): Promise<PlanTargets> => {
      const res = await api.get(`/tracker/plan/targets`, { params: { year, period } });
      return res.data.data;
    },
  });
}

/* -------------------------------------------------------------- dashboard */

export function useDashboard(period: DashboardPeriod) {
  return useQuery({
    queryKey: [TRACKER_KEY, "dashboard", period],
    queryFn: async (): Promise<DashboardResponse> => {
      const res = await api.get(`/tracker/dashboard`, { params: { period } });
      return res.data.data;
    },
    staleTime: 30_000,
  });
}

/* ----------------------------------------------------------------- funnel */

export function useFunnel(from: string, to: string, source?: string) {
  return useQuery({
    queryKey: [TRACKER_KEY, "funnel", from, to, source],
    queryFn: async (): Promise<FunnelResponse> => {
      const res = await api.get(`/tracker/funnel`, { params: { from, to, source } });
      return res.data.data;
    },
    enabled: Boolean(from && to),
  });
}

/* --------------------------------------------------------------- channels */

export function useChannels(from: string, to: string) {
  return useQuery({
    queryKey: [TRACKER_KEY, "channels", from, to],
    queryFn: async (): Promise<{ range: { from: string; to: string }; channels: ChannelRow[] }> => {
      const res = await api.get(`/tracker/channels`, { params: { from, to } });
      return res.data.data;
    },
    enabled: Boolean(from && to),
  });
}

/* --------------------------------------------------------------- sessions */

export function useSessions(from?: string, to?: string) {
  return useQuery({
    queryKey: [TRACKER_KEY, "sessions", from, to],
    queryFn: async (): Promise<SessionRowResponse[]> => {
      const res = await api.get(`/tracker/sessions`, { params: { from, to } });
      return res.data.data;
    },
  });
}

export function useSaveSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: SessionInput) => {
      const res = await api.post(`/tracker/sessions`, row);
      return res.data.data as SessionRowResponse;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TRACKER_KEY] });
    },
  });
}

export function useDeleteSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tracker/sessions/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [TRACKER_KEY] });
    },
  });
}

/* ------------------------------------------------------------ leaderboard */

export function useLeaderboard(from: string, to: string) {
  return useQuery({
    queryKey: [TRACKER_KEY, "leaderboard", from, to],
    queryFn: async (): Promise<{ range: { from: string; to: string }; leaderboard: LeaderboardRow[] }> => {
      const res = await api.get(`/tracker/leaderboard`, { params: { from, to } });
      return res.data.data;
    },
    enabled: Boolean(from && to),
  });
}
