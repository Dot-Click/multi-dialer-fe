import { useState, useCallback } from 'react';
import api from '../lib/axios';

export interface SessionResultBreakdown {
    result: string;
    totalCalls: number;
    talkTime: string;
    dialTime: string;
}

export interface SessionRow {
    id: string;
    date: string;
    agent: string;
    type: string;
    list: string;
    calls: number;
    appointments: number;
    duration: string;
    breakdown: {
        results: SessionResultBreakdown[];
        total: {
            calls: number;
            talkTime: string;
            dialTime: string;
        };
    };
}

export interface SessionReportFilters {
    startDate?: string;
    endDate?: string;
    userId?: string;
    page?: number;
    limit?: number;
}

export const useSessionReport = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<SessionRow[]>([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 });

    const getSessionReport = useCallback(async (filters: SessionReportFilters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.userId) params.append('userId', filters.userId);
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());

            const response = await api.get(`/reports/sessions?${params.toString()}`);
            const result = response.data.data;
            setData(result.data);
            setPagination(result.pagination);
            return result;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch session report';
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
        getSessionReport,
    };
};
