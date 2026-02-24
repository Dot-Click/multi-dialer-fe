import { useState } from 'react';
import api from '../lib/axios';

export interface SMSTemplate {
    id: string;
    templateName: string;
    content: string;
    libraryId: string;
    createdAt: string;
    updatedAt: string;
    library?: {
        user?: {
            fullName: string;
            email: string;
        };
    };
    status?: boolean;
}

export const useSMSTemplate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getSMSTemplates = async (): Promise<SMSTemplate[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/library/sms');
            return response.data.data || [];
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch SMS templates';
            setError(message);
            console.error(err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createSMSTemplate = async (data: { templateName: string; content: string }): Promise<SMSTemplate | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/library/sms/create', data);
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to create SMS template';
            setError(message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateSMSTemplate = async (id: string, data: { templateName?: string; content?: string; status?: boolean }): Promise<SMSTemplate | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/library/sms/${id}`, data);
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to update SMS template';
            setError(message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteSMSTemplate = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/library/sms/${id}`);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete SMS template';
            setError(message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getSMSTemplates,
        createSMSTemplate,
        updateSMSTemplate,
        deleteSMSTemplate,
    };
};
