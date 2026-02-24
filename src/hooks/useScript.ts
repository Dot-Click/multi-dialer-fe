import { useState } from 'react';
import api from '../lib/axios';

export interface ScriptData {
    id: string;
    scriptName: string;
    scriptText: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    library?: {
        user?: {
            fullName: string;
            email: string;
        };
    };
}

export interface CreateScriptPayload {
    scriptName: string;
    scriptText: string;
    status?: boolean;
}

export const useScript = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getScripts = async (): Promise<ScriptData[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/library/script');
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch scripts';
            setError(message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const getAllScripts = async (): Promise<ScriptData[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/library/script/all');
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch all scripts';
            setError(message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createScript = async (payload: CreateScriptPayload): Promise<ScriptData | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/library/script/create', payload);
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to create script';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const updateScript = async (id: string, payload: Partial<CreateScriptPayload>): Promise<ScriptData | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/library/script/${id}`, payload);
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to update script';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const deleteScript = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/library/script/${id}`);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete script';
            setError(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getScripts,
        getAllScripts,
        createScript,
        updateScript,
        deleteScript,
    };
};
