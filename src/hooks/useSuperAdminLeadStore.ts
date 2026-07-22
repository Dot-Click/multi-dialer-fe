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
  assignedPackage: string | null;
  user: { id: string; fullName: string | null; email: string };
  service: { id: string; name: string };
  myPlusLeadsConfig: { id: string; label: string | null; subAccountEmail: string | null; status: string } | null;
}

export interface AccountPackage {
  package: string;
  count: number;
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
    mutationFn: async (params: { leadStoreId: string; myPlusLeadsConfigId: string; assignedPackage: string }) => {
      const { leadStoreId, ...body } = params;
      const response = await api.post(`/super-admin/lead-store/${leadStoreId}/link`, body);
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

  const updateAccount = useMutation({
    mutationFn: async (params: {
      configId: string;
      subAccountEmail?: string;
      subAccountPassword?: string;
      subAccountId?: string;
      label?: string;
    }) => {
      const { configId, ...body } = params;
      const response = await api.patch(`/super-admin/lead-store/accounts/${configId}`, body);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superAdminMyPlusLeadsAccounts"] });
      toast.success("MyPlusLeads account updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update account");
    },
  });

  return { accounts, isLoading, registerAccount, updateAccount };
};

export interface PortalAccount {
  id: string;
  name: string;
  email: string;
  status: string;
  billingType: string;
  monthlyFee: number;
  baseZip: string | null;
}

/** Live list of every sub-account on Client's MyPlusLeads enterprise portal. */
export const useSuperAdminPortalAccounts = () => {
  const { data: portalAccounts = [], isLoading, isError, error } = useQuery<PortalAccount[]>({
    queryKey: ["superAdminPortalAccounts"],
    queryFn: async () => {
      const response = await api.get("/super-admin/lead-store/portal-accounts");
      return response.data.data;
    },
    retry: false,
  });

  return { portalAccounts, isLoading, isError, error: (error as any)?.response?.data?.message as string | undefined };
};

/** Live-fetches the data packages currently on a MyPlusLeads account (e.g. "Expired (128)"). */
export const useAccountPackages = (configId: string | null) => {
  const { data: packages = [], isLoading, isError, error } = useQuery<AccountPackage[]>({
    queryKey: ["superAdminAccountPackages", configId],
    queryFn: async () => {
      const response = await api.get(`/super-admin/lead-store/accounts/${configId}/packages`);
      return response.data.data;
    },
    enabled: !!configId,
    retry: false,
  });

  return { packages, isLoading, isError, error: (error as any)?.response?.data?.message as string | undefined };
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
