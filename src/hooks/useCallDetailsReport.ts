import { useState, useCallback } from 'react';
import api from '../lib/axios';

export interface CallDetailRow {
    id: string;
    name: string;
    address: string;
    list: string;
    group: string;
    phoneNumber: string;
    result: string;
    startTime: string;
    duration: number;
}

export interface CallDetailsFilters {
    startDate?: string;
    endDate?: string;
    userId?: string;
    page?: number;
    limit?: number;
}

export interface CallDetailsResponse {
    data: CallDetailRow[];
    pagination: {
        total: number;
        page: number;
        limit: number;
    };
}

export const useCallDetailsReport = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<CallDetailRow[]>([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 50 });

    const getCallDetails = useCallback(async (filters: CallDetailsFilters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.userId) params.append('userId', filters.userId);
            if (filters.page) params.append('page', filters.page.toString());
            if (filters.limit) params.append('limit', filters.limit.toString());

            const response = await api.get(`/reports/call-details?${params.toString()}`);
            const result = response.data.data;
            setData(result.data);
            setPagination(result.pagination);
            return result;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch call details report';
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
        getCallDetails,
    };
};
