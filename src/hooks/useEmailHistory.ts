import { useState, useCallback } from "react";
import api from "@/lib/axios";

export interface EmailLog {
  id: string;
  to: string;
  from: string;
  subject: string;
  content: string;
  status: "SENT" | "FAILED";
  error?: string | null;
  messageId?: string | null;
  createdAt: string;
  user?: {
    fullName: string | null;
    email: string;
  };
  template?: {
    templateName: string;
  };
}

export const useEmailHistory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEmailHistoryForContact = useCallback(async (contactId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/email-history/contact/${contactId}`);
      return response.data.data as EmailLog[];
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch email history");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllEmailHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/email-history`);
      return response.data.data as EmailLog[];
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch all email history");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getEmailHistoryForContact,
    getAllEmailHistory,
  };
};
