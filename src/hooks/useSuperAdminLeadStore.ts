import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export interface LeadStoreRequest {
  id: string;
  title: string;
  status: "PENDING_SETUP" | "ACTIVE" | "CANCELLED";
  price: number;
  createdAt: string;
  billingPaused: boolean;
  user: { id: string; fullName: string | null; email: string };
  service: { id: string; name: string };
  myPlusLeadsConfig: { id: string; label: string | null; subAccountEmail: string | null; status: string } | null;
}

export interface MyPlusLeadsAccount {
  id: string;
  label: string | null;
  subAccountEmail: string | null;
  subAccountId: string | null;
  status: string;
  user: { id: string; fullName: string | null; email: string };
  leadStores: { id: string; title: string; status: string; userId: string }[];
}

export const useSuperAdminLeadStoreRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery<LeadStoreRequest[]>({
    queryKey: ["superAdminLeadStoreRequests"],
    queryFn: async () => {
      const response = await api.get("/super-admin/lead-store/requests");
      return response.data.data;
    },
  });

  const linkAccount = useMutation({
    mutationFn: async (params: { leadStoreId: string; myPlusLeadsConfigId: string }) => {
      const { leadStoreId, myPlusLeadsConfigId } = params;
      const response = await api.post(`/super-admin/lead-store/${leadStoreId}/link`, { myPlusLeadsConfigId });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superAdminLeadStoreRequests"] });
      queryClient.invalidateQueries({ queryKey: ["superAdminMyPlusLeadsAccounts"] });
      toast.success("Account linked and synced");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to link account");
    },
  });

  const unlinkAccount = useMutation({
    mutationFn: async (leadStoreId: string) => {
      const response = await api.post(`/super-admin/lead-store/${leadStoreId}/unlink`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superAdminLeadStoreRequests"] });
      queryClient.invalidateQueries({ queryKey: ["superAdminMyPlusLeadsAccounts"] });
      toast.success("Account unlinked");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to unlink account");
    },
  });

  return { requests, isLoading, linkAccount, unlinkAccount };
};

export const useSuperAdminMyPlusLeadsAccounts = () => {
  const queryClient = useQueryClient();

  const { data: accounts = [], isLoading } = useQuery<MyPlusLeadsAccount[]>({
    queryKey: ["superAdminMyPlusLeadsAccounts"],
    queryFn: async () => {
      const response = await api.get("/super-admin/lead-store/accounts");
      return response.data.data;
    },
  });

  const registerAccount = useMutation({
    mutationFn: async (params: {
      userId: string;
      subAccountEmail: string;
      subAccountPassword: string;
      subAccountId?: string;
      label?: string;
    }) => {
      const response = await api.post("/super-admin/lead-store/accounts", params);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superAdminMyPlusLeadsAccounts"] });
      toast.success("MyPlusLeads account registered");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to register account");
    },
  });

  return { accounts, isLoading, registerAccount };
};

export interface SuperAdminCustomer {
  id: string;
  fullName: string | null;
  email: string;
}

/** Lightweight customer picker source — reuses the existing /user list endpoint. */
export const useSuperAdminCustomers = () => {
  const { data: customers = [], isLoading } = useQuery<SuperAdminCustomer[]>({
    queryKey: ["superAdminCustomers"],
    queryFn: async () => {
      const response = await api.get("/user");
      return response.data.data;
    },
  });

  return { customers, isLoading };
};
