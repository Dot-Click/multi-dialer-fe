import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export interface MyPlusLeadsConfig {
  id: string;
  label: string | null;
  subAccountEmail: string | null;
  autoSync: boolean;
  status: string;
  lastSyncAt: string | null;
  errorMessage?: string | null;
}

/**
 * Read-only view of the current user's linked MyPlusLeads account(s).
 * Credentials are entered by Client via the Super Admin linking panel —
 * there is no self-service connect/edit/disconnect here anymore.
 */
export const useMyPlusLeads = () => {
  const queryClient = useQueryClient();

  const { data: configs = [], isLoading } = useQuery<MyPlusLeadsConfig[]>({
    queryKey: ["myPlusLeadsConfig"],
    queryFn: async () => {
      const response = await api.get(`/integrations/myplusleads`);
      return response.data.data;
    },
  });

  const syncNow = useMutation({
    mutationFn: async () => {
      const response = await api.post(`/integrations/myplusleads/sync`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPlusLeadsConfig"] });
      toast.success("MyPlusLeads sync complete");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to sync MyPlusLeads");
    },
  });

  return {
    configs,
    isLoading,
    syncNow,
  };
};
