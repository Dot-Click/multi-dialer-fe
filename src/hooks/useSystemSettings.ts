import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

// --- Types ---

export interface CallerId {
    id: string;
    label: string;
    countryCode: string;
    numberOfLines: number;
    createdAt: string;
    updatedAt: string;
    status: string;
    dialerType?: 'PREDICTIVE' | 'POWER' | 'PREVIEW';
    aiPacing?: boolean;

    twillioSid?: string;
    twillioNumber?: string;

    agentIds?: string[];
    agents?: { id: string; fullName: string; email: string }[];
}

export interface DialerSettings {
    id: string;
    useTimeShield: boolean;
    timeShieldStartTime?: string;
    timeShieldEndTime?: string;
    useAnswerNotificationTone: boolean;
    deleteDisconnectedNumbers: boolean;
    deleteFaxNumbers: boolean;
    useCallSessionTimer: boolean;
    systemSettingId: string;
}

export interface CallSettings {
    id: string;
    label: string;
    onHoldRecording1?: string;
    onHoldRecording2?: string;
    ivrRecording?: string;
    answeringMachineRecording?: string;
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
    type: 'TEXTFIELD' | 'DROPDOWN' | 'CHECKBOX' | 'RADIO' | 'DATETIME';
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
    actionType: 'EMAIL' | 'PHONE_CALL' | 'TASK' | 'LETTER' | 'MAILING_LABEL';
    contentValue: string;
    dayOffset: number;
}

export interface ActionStep {
    id?: string;
    order: number;
    actionType: 'EMAIL' | 'PHONE_CALL' | 'TASK' | 'LETTER' | 'MAILING_LABEL';
    contentValue: string;
    dayOffset: number;
}

export interface ActionPlan {
    id: string;
    name: string;
    schedulingType: 'FREQUENCY_BASED' | 'DATE_BASED';
    schedulingLogic: 'FREQUENCY_BASED' | 'DATE_BASED';
    weekendScheduling: 'FREQUENCY_BASED' | 'DATE_BASED';
    triggerType: 'NONE' | 'CALLING_LIST' | 'GROUP';
    triggerSourceId?: string;
    removeOnTriggerExit: boolean;
    endLogic: 'DO_NOTHING' | 'REPEAT_PLAN' | 'START_OTHER_PLAN';
    endLogicValue?: string;
    nextPlanId?: string;
    assignGroupEnabled: boolean;
    assignGroupId?: string;
    steps?: ActionStep[];
}

export interface NotificationSettings {
    id: string;
    enableAppointmentReminders: boolean;
    appointmentReminderEmail?: string;
    enableCallActivityReport: boolean;
    enableSessionSummaryReport: boolean;
    includeAgentsWithNoActivity: boolean;
    dailyCallReportEmail?: string;
    enableAppointmentNotifications: boolean;
    enableComplianceAlerts: boolean;
}

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
        queryKey: ['caller-ids'],
        queryFn: async (): Promise<CallerId[]> => {
            const response = await api.get('/system-settings/caller-id');
            return response.data.data || response.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: Partial<CallerId>) => {
            const response = await api.post('/system-settings/caller-id/create', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['caller-ids'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CallerId> }) => {
            const response = await api.put(`/system-settings/caller-id/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['caller-ids'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/system-settings/caller-id/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['caller-ids'] });
        }
    });

    return {
        ...query,
        createCallerId: createMutation,
        updateCallerId: updateMutation,
        deleteCallerId: deleteMutation
    };
};

// 2. Dialer Settings Hooks
export const useDialerSettings = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['dialer-settings'],
        queryFn: async (): Promise<DialerSettings | null> => {
            const response = await api.get('/system-settings/dialer-settings');
            return response.data.data || response.data;
        }
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
            queryClient.invalidateQueries({ queryKey: ['dialer-settings'] });
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: Partial<DialerSettings>) => {
            const response = await api.post('/system-settings/dialer-settings/create', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dialer-settings'] });
        }
    });

    return {
        ...query,
        updateDialerSettings: updateMutation,
        createDialerSettings: createMutation
    };
};

// 3. Call Settings Hooks
export const useCallSettings = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['call-settings'],
        queryFn: async (): Promise<CallSettings[]> => {
            const response = await api.get('/system-settings/call-settings');
            return response.data.data || response.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: Partial<CallSettings>) => {
            const response = await api.post('/system-settings/call-settings/create', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['call-settings'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<CallSettings> }) => {
            const response = await api.put(`/system-settings/call-settings/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['call-settings'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/system-settings/call-settings/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['call-settings'] });
        }
    });

    return {
        ...query,
        createCallSettings: createMutation,
        updateCallSettings: updateMutation,
        deleteCallSettings: deleteMutation
    };
};

// 4. Lead Sheet Hooks
export const useLeadSheets = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['lead-sheets'],
        queryFn: async (): Promise<LeadSheet[]> => {
            const response = await api.get('/system-settings/lead-sheet');
            return response.data.data || response.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: Partial<LeadSheet>) => {
            const response = await api.post('/system-settings/lead-sheet/create', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lead-sheets'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<LeadSheet> }) => {
            const response = await api.put(`/system-settings/lead-sheet/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lead-sheets'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/system-settings/lead-sheet/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lead-sheets'] });
        }
    });

    return {
        ...query,
        createLeadSheet: createMutation,
        updateLeadSheet: updateMutation,
        deleteLeadSheet: deleteMutation
    };
};

// 5. Notification Settings Hook
export const useNotificationSettings = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['notification-settings'],
        queryFn: async (): Promise<NotificationSettings | null> => {
            const response = await api.get('/system-settings/notification-settings');
            return response.data.data || response.data;
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: Partial<NotificationSettings>) => {
            const response = await api.put('/system-settings/notification-settings', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
        }
    });

    return {
        ...query,
        updateNotificationSettings: updateMutation
    };
};

// 6. Appearance Settings Hook
export const useAppearanceSettings = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['appearance-settings'],
        queryFn: async (): Promise<AppearanceSettings | null> => {
            const response = await api.get('/system-settings/appearance');
            return response.data.data || response.data;
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: Partial<AppearanceSettings>) => {
            const response = await api.put('/system-settings/appearance', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appearance-settings'] });
        }
    });

    return {
        ...query,
        updateAppearanceSettings: updateMutation
    };
};

// 7. Misc Fields Hook
export const useMiscFields = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['misc-fields'],
        queryFn: async (): Promise<MiscField[]> => {
            const response = await api.get('/system-settings/misc-fields');
            return response.data.data || response.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: Partial<MiscField>) => {
            const response = await api.post('/system-settings/misc-fields/create', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['misc-fields'] });
        }
    });

    return {
        ...query,
        createMiscField: createMutation
    };
};

// 8. Action Plans Hook
export const useActionPlans = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['action-plans'],
        queryFn: async (): Promise<ActionPlan[]> => {
            const response = await api.get('/system-settings/action-plans');
            return response.data.data || response.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: Partial<ActionPlan>) => {
            const response = await api.post('/system-settings/action-plans', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['action-plans'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<ActionPlan> }) => {
            const response = await api.put(`/system-settings/action-plans/${id}`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['action-plans'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/system-settings/action-plans/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['action-plans'] });
        }
    });

    return {
        ...query,
        createActionPlan: createMutation,
        updateActionPlan: updateMutation,
        deleteActionPlan: deleteMutation
    };
};

// 9. Twilio Number Hooks
export const useTwilioNumbers = (filters?: { countryCode?: string; cityName?: string; state?: string }) => {
    const queryClient = useQueryClient();

    const availableNumbersQuery = useQuery({
        queryKey: ['available-numbers', filters],
        queryFn: async (): Promise<AvailableNumbersResponse> => {
            const response = await api.post('/calling/available-numbers', filters || {});
            return response.data.data || response.data;
        },
        staleTime: 0,
        enabled: !!(filters?.countryCode && filters?.state && filters?.cityName), // 👈 only fetch when all 3 are selected

    });

    const buyNumberMutation = useMutation({
        mutationFn: async (payload: { phoneNumber: string; countryCode?: string; label?: string }) => {
            const response = await api.post('/calling/buy-number', payload);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['caller-ids'] });
        }
    });

    return {
        availableNumbers: availableNumbersQuery,
        buyNumber: buyNumberMutation
    };
};
