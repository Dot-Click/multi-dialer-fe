import { useState, useCallback } from 'react';
import api from '../lib/axios';

export interface RecurringEventRow {
    contactId: string;
    name: string;
    type: string;          // "Email" | "SMS" | "Call back"
    repeat: number;        // number of occurrences for this contact + type
    startDate: string | null; // ISO date of the first occurrence
}

export const useRecurringEventsReport = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<RecurringEventRow[]>([]);

    const getRecurringEvents = useCallback(async (userId?: string) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (userId) params.append('userId', userId);

            const response = await api.get(`/reports/recurring-events?${params.toString()}`);
            const rows: RecurringEventRow[] = response.data?.data?.data ?? [];
            setData(rows);
            return rows;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch recurring events';
            setError(message);
            console.error(err);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, data, getRecurringEvents };
};
