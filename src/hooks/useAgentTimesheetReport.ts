import { useState, useCallback } from 'react';
import api from '../lib/axios';

export interface AgentTimesheetRow {
    id: string;
    date: string;
    agent: string;
    device: string;
    logIn: string;
    logOut: string;
    timeLogged: string;
}

export interface AgentTimesheetFilters {
    startDate?: string;
    endDate?: string;
    userId?: string;
    page?: number;
    limit?: number;
}

export const useAgentTimesheetReport = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<AgentTimesheetRow[]>([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50 });

    const getAgentTimesheet = useCallback(async (filters: AgentTimesheetFilters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.userId) params.append('userId', filters.userId);
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());

            const response = await api.get(`/reports/agent-timesheet?${params.toString()}`);
            const result = response.data.data;
            setData(result.data);
            setPagination(result.pagination);
            return result;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch agent timesheet report';
            setError(message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        data,
        pagination,
        getAgentTimesheet,
    };
};
