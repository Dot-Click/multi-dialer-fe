import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
import { toast } from "react-hot-toast";


export interface MyPlusLeadsConfig {
  id: string;
  apiKey: string;
  webhookUrl: string;
  selectedTypes: string[];
  autoSync: boolean;
  status: string;
  lastSyncAt: string | null;
}

export const useMyPlusLeads = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<MyPlusLeadsConfig>({
    queryKey: ["myPlusLeadsConfig"],
    queryFn: async () => {
      const response = await api.get(`/integrations/myplusleads`);
      return response.data.data;
    },
  });

  const updateConfig = useMutation({
    mutationFn: async (payload: Partial<MyPlusLeadsConfig>) => {
      const response = await api.post(`/integrations/myplusleads`, payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPlusLeadsConfig"] });
      toast.success("MyPlusLeads integration updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update integration");
    },
  });

  const disconnect = useMutation({
    mutationFn: async () => {
      await api.delete(`/integrations/myplusleads`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myPlusLeadsConfig"] });
      toast.success("Integration disconnected");
    },
  });

  return {
    config: data,
    isLoading,
    updateConfig,
    disconnect,
  };
};
