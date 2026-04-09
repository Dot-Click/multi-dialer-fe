import { useState } from 'react';
import api from '../lib/axios';

export type RecordingSlot = "ON_HOLD" | "IVR" | "ANSWERING_MACHINE" | "GENERAL";

export interface RecordingItem {
    id: string;
    name: string;
    url: string;
    fileSize: number;
    duration: number | null;
    mimeType: string;
    slot: RecordingSlot;
    userId: string;
    createdAt: string;
    updatedAt: string;
    user?: {
        id: string;
        fullName: string;
        email: string;
    };
}

export const useRecordings = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getRecordings = async (): Promise<RecordingItem[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/library/recordings');
            return response.data.data || [];
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch recordings';
            setError(message);
            console.error(err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createRecording = async (formData: FormData): Promise<RecordingItem | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/library/recordings/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to upload recording';
            setError(message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateRecording = async (
        id: string,
        data: { name?: string; slot?: RecordingSlot },
        file?: File
    ): Promise<RecordingItem | null> => {
        setLoading(true);
        setError(null);
        try {
            if (file) {
                const form = new FormData();
                if (data.name) form.append('name', data.name);
                if (data.slot) form.append('slot', data.slot);
                form.append('file', file);
                const response = await api.put(`/library/recordings/${id}`, form, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                return response.data.data;
            } else {
                const response = await api.put(`/library/recordings/${id}`, data);
                return response.data.data;
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to update recording';
            setError(message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteRecording = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/library/recordings/${id}`);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete recording';
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
        getRecordings,
        createRecording,
        updateRecording,
        deleteRecording,
    };
};
