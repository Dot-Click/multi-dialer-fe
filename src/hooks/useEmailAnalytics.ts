import { useQuery, keepPreviousData } from "@tanstack/react-query";
import api from "../lib/axios";

export interface EmailAnalyticsSummary {
  totalSent: number;
  totalFailed: number;
  total: number;
  deliveryRate: number;
  engagement: {
    delivered: number;
    opened: number;
    clicked: number;
    openRate: number;
    clickRate: number;
    hardBounces: number;
    softBounces: number;
    bounceRate: number;
  };
  queue: {
    pending: number;
    dead: number;
  };
  suppressions: {
    bounce: number;
    complaint: number;
    unsubscribe: number;
    total: number;
    complaintRate: number;
  };
}

export interface EmailTimelinePoint {
  date: string;
  sent: number;
  failed: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
}

export interface EmailLogRow {
  id: string;
  to: string;
  from: string;
  subject: string;
  status: "SENT" | "FAILED";
  error?: string | null;
  messageId?: string | null;
  createdAt: string;
  deliveredAt?: string | null;
  openedAt?: string | null;
  openCount: number;
  clickedAt?: string | null;
  clickCount: number;
  bounceType?: "SOFT" | "HARD" | null;
  user?: { fullName?: string | null; email: string } | null;
  template?: { templateName: string } | null;
}

interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface DeadLetterItem {
  id: string;
  to: string;
  subject: string;
  attempts: number;
  maxAttempts: number;
  lastError?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const useEmailAnalyticsSummary = () => {
  return useQuery({
    queryKey: ["email-analytics", "summary"],
    queryFn: async (): Promise<EmailAnalyticsSummary> => {
      const response = await api.get("/email-analytics/summary");
      return response.data.data;
    },
    refetchInterval: 60_000,
  });
};

export const useEmailTimeline = (days = 30) => {
  return useQuery({
    queryKey: ["email-analytics", "timeline", days],
    queryFn: async (): Promise<EmailTimelinePoint[]> => {
      const response = await api.get("/email-analytics/timeline", { params: { days } });
      return response.data.data;
    },
  });
};

export const useEmailLogs = (params: { page: number; limit: number; status?: "SENT" | "FAILED"; search?: string; days?: number }) => {
  return useQuery({
    queryKey: ["email-analytics", "logs", params],
    queryFn: async (): Promise<{ logs: EmailLogRow[]; meta: PaginatedMeta }> => {
      const response = await api.get("/email-analytics/logs", { params });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
};

export const useDeadLetterQueue = (params: { page: number; limit: number }) => {
  return useQuery({
    queryKey: ["email-analytics", "queue-dead", params],
    queryFn: async (): Promise<{ items: DeadLetterItem[]; meta: PaginatedMeta }> => {
      const response = await api.get("/email-analytics/queue/dead", { params });
      return response.data.data;
    },
    placeholderData: keepPreviousData,
  });
};
