import { useState } from 'react';
import api from '../lib/axios';

export interface EmailTemplate {
    id: string;
    templateName: string;
    subject: string;
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

export const useEmailTemplate = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getEmailTemplates = async (): Promise<EmailTemplate[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/library/email');
            return response.data.data || [];
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch email templates';
            setError(message);
            console.error(err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createEmailTemplate = async (data: { templateName: string; subject: string; content: string }): Promise<EmailTemplate | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/library/email/create', data);
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to create email template';
            setError(message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateEmailTemplate = async (id: string, data: { templateName?: string; subject?: string; content?: string; status?: boolean }): Promise<EmailTemplate | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/library/email/${id}`, data);
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to update email template';
            setError(message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteEmailTemplate = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/library/email/${id}`);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete email template';
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
        getEmailTemplates,
        createEmailTemplate,
        updateEmailTemplate,
        deleteEmailTemplate,
    };
};
