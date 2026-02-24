import { useState } from 'react';
import api from '../lib/axios';

export interface Signature {
    id: string;
    userId: string;
    content: string;
}

export const useSignature = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getSignature = async (): Promise<Signature | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/library/signatures');
            return response.data.signature;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch signature';
            setError(message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const saveSignature = async (content: string): Promise<Signature | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/library/signatures', { content });
            return response.data.signature;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to save signature';
            setError(message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getSignature,
        saveSignature,
    };
};
