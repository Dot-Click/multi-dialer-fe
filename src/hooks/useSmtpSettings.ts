import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export interface SmtpConfig {
  id: string;
  companyId: string;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string; // Always masked ("••••••") — the server never returns the real value.
  fromName: string;
  fromEmail: string;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SmtpConfigFormValues {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
}

export const useSmtpSettings = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["smtpConfig"],
    queryFn: async (): Promise<SmtpConfig | null> => {
      const response = await api.get("/settings/smtp");
      return response.data.data || null;
    },
  });

  const saveConfig = useMutation({
    mutationFn: async (payload: SmtpConfigFormValues) => {
      const response = await api.post("/settings/smtp", payload);
      return response.data.data as SmtpConfig;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smtpConfig"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save SMTP settings");
    },
  });

  const testConfig = useMutation({
    mutationFn: async () => {
      const response = await api.post("/settings/smtp/test");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smtpConfig"] });
    },
  });

  const deleteConfig = useMutation({
    mutationFn: async () => {
      await api.delete("/settings/smtp");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["smtpConfig"] });
      toast.success("SMTP configuration removed");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove SMTP configuration");
    },
  });

  const saveAndTest = async (payload: SmtpConfigFormValues) => {
    await saveConfig.mutateAsync(payload);
    return testConfig.mutateAsync();
  };

  return {
    ...query,
    saveConfig,
    testConfig,
    deleteConfig,
    saveAndTest,
  };
};
