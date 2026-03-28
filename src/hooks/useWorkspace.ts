import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';

export interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    color: string;
    startDate: string;
    endDate?: string;
    assignToId: string;
    status: string;
    assignTo?: {
        id: string;
        fullName: string;
        email: string;
    };
}

export interface Group {
    id: string;
    name: string;
    contactIds: string[];
}

export interface List {
    id: string;
    name: string;
    contactIds: string[];
    userId?: string;
}

export interface Folder {
    id: string;
    name: string;
    listIds: string[];
}

export interface DialerHealth {
    id: string;
    name: string;
    contact: string;
    health: 'healthy' | 'unhealthy';
}

export interface SalesAgentPerformance {
    name: string;
    totalCalls: number;
    connectedCalls: number;
    conversionRate: string;
}

export interface AgentCallMetric {
    name: string;
    avgcalltime: string;
    objhandling: string;
    interest: string;
}

export interface CallStatistics {
    totalCalls: number;
    connectionRate: string;
    outcomes: {
        interested: number;
        followup: number;
        noAnswer: number;
        notInterested: number;
        dnc: number;
    };
    goals: {
        followup: { current: number; target: number };
        interested: { current: number; target: number };
    };
}

export const useCalendarEvents = () => {
    return useQuery({
        queryKey: ['calendar-events'],
        queryFn: async (): Promise<CalendarEvent[]> => {
            const response = await api.get('/calendar');
            return response.data.data || response.data;
        }
    });
};

export const useAllCalendarEvents = () => {
    return useQuery({
        queryKey: ['all-calendar-events'],
        queryFn: async (): Promise<CalendarEvent[]> => {
            const response = await api.get('/calendar/all');
            return response.data.data || response.data;
        }
    });
};

export const useGroups = () => {
    return useQuery({
        queryKey: ['contact-groups'],
        queryFn: async (): Promise<Group[]> => {
            const response = await api.get('/contact/group');
            return response.data.data || response.data;
        }
    });
};

export const useLists = () => {
    return useQuery({
        queryKey: ['contact-lists'],
        queryFn: async (): Promise<List[]> => {
            const response = await api.get('/contact/list');
            return response.data.data || response.data;
        }
    });
};

export const useFolders = () => {
    return useQuery({
        queryKey: ['contact-folders'],
        queryFn: async (): Promise<Folder[]> => {
            const response = await api.get('/contact/folder');
            return response.data.data || response.data;
        }
    });
};

export const useDialerHealth = () => {
    return useQuery({
        queryKey: ['dialer-health'],
        queryFn: async (): Promise<DialerHealth[]> => {
            const response = await api.get('/reports/dialer-health');
            return response.data.data || response.data;
        }
    });
};

export const useSalesAgentsPerformance = () => {
    return useQuery({
        queryKey: ['sales-performance'],
        queryFn: async (): Promise<SalesAgentPerformance[]> => {
            const response = await api.get('/reports/sales-performance');
            return response.data.data || response.data;
        }
    });
};

export const useAgentCallMetrics = () => {
    return useQuery({
        queryKey: ['agent-call-metrics'],
        queryFn: async (): Promise<AgentCallMetric[]> => {
            const response = await api.get('/reports/agent-metrics');
            return response.data.data || response.data;
        }
    });
};

export const useCallStatistics = (period: string) => {
    return useQuery({
        queryKey: ['call-statistics', period],
        queryFn: async (): Promise<CallStatistics> => {
            const response = await api.get(`/reports/call-statistics?period=${period}`);
            return response.data.data || response.data;
        }
    });
};
