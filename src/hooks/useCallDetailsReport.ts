import { useState, useCallback } from 'react';
import api from '../lib/axios';

export interface CallDetailRow {
    id: string;
    name: string;
    address: string;
    list: string;
    folder: string;
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
    callerId?: string;
    dayOfWeek?: string; // comma-separated day numbers, 0=Sun..6=Sat
    timeFrameStart?: string; // "HH:mm"
    timeFrameEnd?: string; // "HH:mm"
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
    // Start in loading state — the consumer always fetches on mount, so this
    // avoids a one-frame "No call details found" flash before the fetch begins.
    const [loading, setLoading] = useState(true);
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
            if (filters.callerId) params.append('callerId', filters.callerId);
            if (filters.dayOfWeek) params.append('dayOfWeek', filters.dayOfWeek);
            if (filters.timeFrameStart) params.append('timeFrameStart', filters.timeFrameStart);
            if (filters.timeFrameEnd) params.append('timeFrameEnd', filters.timeFrameEnd);

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
