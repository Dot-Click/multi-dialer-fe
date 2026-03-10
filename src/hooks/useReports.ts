import { useState, useCallback } from 'react';
import api from '../lib/axios';

export interface AgentReport {
    dialingTime: string;
    dialingSeconds: number;
    callsMade: number;
    totalLeads: number;
    contacts: number;
    callsPerHour: string;
    contactsPerHour: string;
    callsPerLead: string;
    contactsPerLead: string;
    appointmentsSet: number;
    appointmentsMet: number;
    timePerAppointment: string;
    callsPerAppointment: string;
    contactsPerAppointment: string;
    period: {
        start: string;
        end: string;
    };
}

export interface ReportFilters {
    startDate?: string;
    endDate?: string;
    userId?: string; // Optional: for admin to view specific agent
}

export const useReports = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [report, setReport] = useState<AgentReport | null>(null);

    const getAgentReport = useCallback(async (filters: ReportFilters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.userId) params.append('userId', filters.userId);

            const response = await api.get(`/reports/agent?${params.toString()}`);
            setReport(response.data.data);
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch agent report';
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
        report,
        getAgentReport,
    };
};
