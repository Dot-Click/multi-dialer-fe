import { useState } from 'react';
import api from '../lib/axios';

export type RecordingType = "VOICE_MAIL" | "ON_HOLD" | "EMAIL_VIDEO";

export interface CallbackPrompt {
    id: string;
    templateName: string;
    recordingType: RecordingType;
    createdBy: string;
    libraryId: string;
    createdAt: string;
    updatedAt: string;
    library?: {
        user?: {
            fullName: string;
            email: string;
        };
    };
}

export const useCallbackPrompt = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCallbackPrompts = async (): Promise<CallbackPrompt[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/library/callback-prompt');
            return response.data.data || [];
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch callback prompts';
            setError(message);
            console.error(err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createCallbackPrompt = async (data: { templateName: string; recordingType: RecordingType; createdBy: string }): Promise<CallbackPrompt | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/library/callback-prompt/create', data);
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to create callback prompt';
            setError(message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateCallbackPrompt = async (id: string, data: { templateName?: string; recordingType?: RecordingType; createdBy?: string }): Promise<CallbackPrompt | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/library/callback-prompt/${id}`, data);
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to update callback prompt';
            setError(message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteCallbackPrompt = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/library/callback-prompt/${id}`);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete callback prompt';
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
        getCallbackPrompts,
        createCallbackPrompt,
        updateCallbackPrompt,
        deleteCallbackPrompt,
    };
};
