import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export interface LeadStoreService {
  id: string;
  name: string;
  price: number;
  description: string | null;
  isActive: boolean;
}

export type LeadStoreStatus = "PENDING_SETUP" | "ACTIVE" | "CANCELLED";

export interface LeadStoreSubscription {
  id: string;
  title: string;
  description: string;
  price: number;
  status: LeadStoreStatus;
  serviceId: string;
  service: { id: string; name: string };
  billingPaused: boolean;
  createdAt: string;
}

export const useLeadStore = () => {
  const queryClient = useQueryClient();

  const { data: services = [], isLoading: isLoadingServices } = useQuery<LeadStoreService[]>({
    queryKey: ["leadStoreServices"],
    queryFn: async () => {
      const response = await api.get("/lead-store/services");
      return response.data.data;
    },
  });

  const { data: subscriptions = [], isLoading: isLoadingSubscriptions } = useQuery<LeadStoreSubscription[]>({
    queryKey: ["leadStoreSubscriptions"],
    queryFn: async () => {
      const response = await api.get("/lead-store/my-subscriptions");
      return response.data.data;
    },
  });

  const subscribe = useMutation({
    mutationFn: async (serviceId: string) => {
      const response = await api.post("/lead-store/subscribe", { serviceId });
      return response.data.data as { url: string };
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to start checkout");
    },
  });

  const cancel = useMutation({
    mutationFn: async (leadStoreId: string) => {
      const response = await api.post(`/lead-store/${leadStoreId}/cancel`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leadStoreSubscriptions"] });
      toast.success("Subscription cancelled");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to cancel subscription");
    },
  });

  return {
    services,
    subscriptions,
    isLoading: isLoadingServices || isLoadingSubscriptions,
    subscribe,
    cancel,
  };
};
