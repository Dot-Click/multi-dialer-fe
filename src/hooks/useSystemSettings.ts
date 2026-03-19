import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/axios";
import toast from "react-hot-toast";

// --- Types ---

export interface CallerId {
  id: string;
  label: string;
  countryCode: string;
  numberOfLines: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  dialerType?: "PREDICTIVE" | "POWER" | "PREVIEW";
  aiPacing?: boolean;

  twillioSid?: string;
  twillioNumber?: string;

  agentIds?: string[];
  agents?: { id: string; fullName: string; email: string }[];
}

export interface DialerSettings {
  id: string;
  useAnswerNotificationTone: boolean;
  voicemailMode: string;
  systemSettingId: string;
}

export interface CallSettings {
  id: string;
  label: string;
  onHoldRecording1Id?: string;
  onHoldRecording2Id?: string;
  ivrRecordingId?: string;
  answeringMachineRecordingId?: string;
  onHoldRecording1?: any;
  onHoldRecording2?: any;
  ivrRecording?: any;
  answeringMachineRecording?: any;
  enableAutoPause: boolean;
  enableRecording: boolean;
  sendOutlookAppointment: boolean;
  allowDncCalls: boolean;
  callerId: string;
  countryCode: string;
  numberOfLines: number;
  ringTime: number;
  callScriptId?: string;
  sendEmail: boolean;
  sendText: boolean;
}

export interface LeadSheetQuestion {
  id?: string;
  text: string;
  type: "TEXTFIELD" | "DROPDOWN" | "CHECKBOX" | "RADIO" | "DATETIME";
  options?: string[];
  required?: boolean | null;
}

export interface LeadSheet {
  id: string;
  title: string;
  questions?: LeadSheetQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ActionStep {
  id?: string;
  order: number;
  actionType: "EMAIL" | "PHONE_CALL" | "TASK" | "LETTER" | "MAILING_LABEL";
  contentValue: string;
  dayOffset: number;
}

export interface ActionStep {
  id?: string;
  order: number;
  actionType: "EMAIL" | "PHONE_CALL" | "TASK" | "LETTER" | "MAILING_LABEL";
  contentValue: string;
  dayOffset: number;
}

export interface ActionPlan {
  id: string;
  name: string;
  schedulingType: "FREQUENCY_BASED" | "DATE_BASED";
  schedulingLogic: "FREQUENCY_BASED" | "DATE_BASED";
  weekendScheduling: "FREQUENCY_BASED" | "DATE_BASED";
  triggerType: "NONE" | "CALLING_LIST" | "GROUP";
  triggerSourceId?: string;
  removeOnTriggerExit: boolean;
  endLogic: "DO_NOTHING" | "REPEAT_PLAN" | "START_OTHER_PLAN";
  endLogicValue?: string;
  nextPlanId?: string;
  assignGroupEnabled: boolean;
  assignGroupId?: string;
  steps?: ActionStep[];
}

export interface RegulatorySettings {
  id: string;
  tcpaFrom: string;
  tcpaTo: string;
  tcpaAutodialing: boolean;
  gdprRetentionDays: number;
  gdprDeleteRelated: boolean;
  systemSettingId: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details?: string;
  userId: string;
  user: {
    fullName: string;
    role: string;
  };
  createdAt: string;
}

export interface NotificationSettings {
  id: string;
  appointmentReminder: boolean;
  appointmentReminderEmail?: string;
  callActivityReport: boolean;
  sessionSummaryReport: boolean;
  includeAgentsWithNoActivity: boolean;
  dailyCallReportEmail?: string;
  appointmentNotification: boolean;
  complianceAlert: boolean;
  emailChannel: boolean;
  inAppChannel: boolean;
  reminderMinutes: number;
  followUpCallEvent: boolean;
  scheduledMeetingEvent: boolean;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<Notification[]> => {
      const response = await api.get("/notification");
      return response.data.data || [];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/notification/mark-read/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await api.put("/notification/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    ...query,
    markRead: markReadMutation,
    markAllRead: markAllReadMutation,
  };
};

export interface AppearanceSettings {
  id: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  // ... other fields
}

export interface MiscField {
  id: string;
  type: string;
  fieldName: string;
  options?: string[];
}

export interface TwilioNumberCapabilities {
  voice: boolean;
  SMS: boolean;
  MMS: boolean;
  fax: boolean;
}

export interface TwilioNumber {
  friendlyName: string;
  phoneNumber: string;
  locality: string | null;
  region: string | null;
  isoCountry: string;
  postalCode: string | null;
  lata: string | null;
  rateCenter: string | null;
  latitude: string | null;
  longitude: string | null;
  addressRequirements: string;
  beta: boolean;
  capabilities: TwilioNumberCapabilities;
}

export interface TwilioPricing {
  country: string;
  isoCountry: string;
  phoneNumberPrices: Array<{
    number_type: string;
    base_price: string;
    current_price: string;
  }>;
  priceUnit: string;
  url: string;
}

export interface AvailableNumbersResponse {
  numbers: TwilioNumber[];
  pricing: TwilioPricing;
}

// --- Hooks ---

// 1. Caller ID Hooks
export const useCallerIds = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["caller-ids"],
    queryFn: async (): Promise<CallerId[]> => {
      const response = await api.get("/system-settings/caller-id");
      return response.data.data || response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<CallerId>) => {
      const response = await api.post(
        "/system-settings/caller-id/create",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caller-ids"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CallerId>;
    }) => {
      const response = await api.put(`/system-settings/caller-id/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caller-ids"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/system-settings/caller-id/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caller-ids"] });
    },
  });

  return {
    ...query,
    createCallerId: createMutation,
    updateCallerId: updateMutation,
    deleteCallerId: deleteMutation,
  };
};

// 2. Dialer Settings Hooks
export const useDialerSettings = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["dialer-settings"],
    queryFn: async (): Promise<DialerSettings | null> => {
      const response = await api.get("/system-settings/dialer-settings");
      return response.data.data || response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<DialerSettings>) => {
      // Check if settings already exist (get by ID if necessary or use common update endpoint)
      // Backend seems to have a post for create and put for update.
      // Many system settings are usually singletons per user.
      const response = await api.put(`/system-settings/dialer-settings`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dialer-settings"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<DialerSettings>) => {
      const response = await api.post(
        "/system-settings/dialer-settings/create",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dialer-settings"] });
    },
  });

  return {
    ...query,
    updateDialerSettings: updateMutation,
    createDialerSettings: createMutation,
  };
};

// 3. Call Settings Hooks
export const useCallSettings = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["call-settings"],
    queryFn: async (): Promise<CallSettings[]> => {
      const response = await api.get("/system-settings/call-settings");
      return response.data.data || response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<CallSettings>) => {
      const response = await api.post(
        "/system-settings/call-settings/create",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["call-settings"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CallSettings>;
    }) => {
      const response = await api.put(
        `/system-settings/call-settings/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["call-settings"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/system-settings/call-settings/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["call-settings"] });
    },
  });

  return {
    ...query,
    createCallSettings: createMutation,
    updateCallSettings: updateMutation,
    deleteCallSettings: deleteMutation,
  };
};

// 4. Lead Sheet Hooks
export const useLeadSheets = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["lead-sheets"],
    queryFn: async (): Promise<LeadSheet[]> => {
      const response = await api.get("/system-settings/lead-sheet");
      return response.data.data || response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<LeadSheet>) => {
      const response = await api.post(
        "/system-settings/lead-sheet/create",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-sheets"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<LeadSheet>;
    }) => {
      const response = await api.put(`/system-settings/lead-sheet/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-sheets"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/system-settings/lead-sheet/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead-sheets"] });
    },
  });

  return {
    ...query,
    createLeadSheet: createMutation,
    updateLeadSheet: updateMutation,
    deleteLeadSheet: deleteMutation,
  };
};

// 5. Notification Settings Hook
export const useNotificationSettings = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notification-settings"],
    queryFn: async (): Promise<NotificationSettings | null> => {
      try {
        const response = await api.get("/system-settings/notification");
        return response.data.data || response.data;
      } catch (error: any) {
        if (error.response?.status === 404) return null;
        throw error;
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<NotificationSettings>) => {
      const response = await api.post("/system-settings/notification", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
      toast.success("Notification settings updated");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update notification settings");
    }
  });

  return {
    ...query,
    updateNotificationSettings: updateMutation,
  };
};

// 6. Appearance Settings Hook
export const useAppearanceSettings = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["appearance-settings"],
    queryFn: async (): Promise<AppearanceSettings | null> => {
      const response = await api.get("/system-settings/appearance");
      return response.data.data || response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<AppearanceSettings>) => {
      const response = await api.put("/system-settings/appearance", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appearance-settings"] });
    },
  });

  return {
    ...query,
    updateAppearanceSettings: updateMutation,
  };
};

// 7. Misc Fields Hook
export const useMiscFields = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["misc-fields"],
    queryFn: async (): Promise<MiscField[]> => {
      const response = await api.get("/system-settings/misc-fields");
      return response.data.data || response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<MiscField>) => {
      const response = await api.post(
        "/system-settings/misc-fields/create",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["misc-fields"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<MiscField>;
    }) => {
      const response = await api.put(
        `/system-settings/misc-fields/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["misc-fields"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/system-settings/misc-fields/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["misc-fields"] });
    },
  });

  return {
    ...query,
    createMiscField: createMutation,
    updateMiscField: updateMutation,
    deleteMiscField: deleteMutation,
  };
};

// 8. Action Plans Hook
export const useActionPlans = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["action-plans"],
    queryFn: async (): Promise<ActionPlan[]> => {
      const response = await api.get("/system-settings/action-plans");
      return response.data.data || response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<ActionPlan>) => {
      const response = await api.post("/system-settings/action-plans", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["action-plans"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ActionPlan>;
    }) => {
      const response = await api.put(
        `/system-settings/action-plans/${id}`,
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["action-plans"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/system-settings/action-plans/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["action-plans"] });
    },
  });

  return {
    ...query,
    createActionPlan: createMutation,
    updateActionPlan: updateMutation,
    deleteActionPlan: deleteMutation,
  };
};

// 9. Twilio Number Hooks
export const useTwilioNumbers = (filters?: {
  countryCode?: string;
  cityName?: string;
  state?: string;
}) => {
  const queryClient = useQueryClient();

  const availableNumbersQuery = useQuery({
    queryKey: ["available-numbers", filters],
    queryFn: async (): Promise<AvailableNumbersResponse> => {
      const response = await api.post(
        "/calling/available-numbers",
        filters || {},
      );
      return response.data.data || response.data;
    },
    staleTime: 0,
    enabled: !!(filters?.countryCode && filters?.state && filters?.cityName), // 👈 only fetch when all 3 are selected
  });

  const buyNumberMutation = useMutation({
    mutationFn: async (payload: {
      phoneNumber: string;
      countryCode?: string;
      label?: string;
    }) => {
      const response = await api.post("/calling/buy-number", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caller-ids"] });
    },
  });

  return {
    availableNumbers: availableNumbersQuery,
    buyNumber: buyNumberMutation,
  };
};
export const useDncList = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["dnc-list"],
    queryFn: async () => {
      const response = await api.get("/contact/dnc-list");
      return response.data.data as any[];
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.post(`/contact/${id}/remove-from-dnc`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dnc-list"] });
      queryClient.invalidateQueries({ queryKey: ["audit-logs"] });
      toast.success("Contact removed from DNC list");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to remove contact from DNC");
    },
  });

  return {
    ...query,
    removeFromDnc: removeMutation,
  };
};

export const useRegulatorySettings = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["regulatory-settings"],
    queryFn: async (): Promise<RegulatorySettings> => {
      const response = await api.get("/system-settings/regulatory");
      return response.data.data || response.data;
    },
  });

  const updateRegulatorySettings = useMutation({
    mutationFn: async (data: Partial<RegulatorySettings>) => {
      const response = await api.put("/system-settings/regulatory", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regulatory-settings"] });
    },
  });

  return {
    ...query,
    updateRegulatorySettings,
  };
};

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ["audit-logs"],
    queryFn: async (): Promise<AuditLog[]> => {
      const response = await api.get("/system-settings/audit-logs");
      return response.data.data || response.data;
    },
  });
};
export interface Integration {
  id: string;
  provider: "TWILIO" | "GOOGLE_MAPS" | "REALTOR_DOT_COM" | "BOMB_BOMB" | "GMAIL" | "STANPP_DOT_COM" | "MY_PLUS_LEADS" | "ZAPIER" | "ZOHO";
  status: "CONNECTED" | "FAILED" | "PROCESSING" | "NEED_SETUP";
  credentials: any;
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useIntegrations = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["integrations"],
    queryFn: async (): Promise<Integration[]> => {
      const response = await api.get("/system-settings/integration/my");
      return response.data.data || response.data;
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (payload: { provider: string; credentials: any }) => {
      const response = await api.post("/system-settings/integration/create", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, credentials }: { id: string; credentials: any }) => {
      const response = await api.put(`/system-settings/integration/${id}`, { credentials });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/system-settings/integration/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });

  return {
    ...query,
    upsertIntegration: upsertMutation,
    updateIntegration: updateMutation,
    deleteIntegration: deleteMutation,
  };
};
