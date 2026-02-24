import { useState } from 'react';
import api from '../lib/axios';

export type MediaType = "VOICE_MAIL" | "ON_HOLD" | "CALLBACK_MESSAGE" | "EMAIL_VIDEO";
export type FileCategory = "audio" | "video";

export interface MediaCenterItem {
    id: string;
    templateName: string;
    mediaType: MediaType;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    duration: number | null;
    fileCategory: FileCategory;
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

export const useMediaCenter = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getMediaCenterItems = async (): Promise<MediaCenterItem[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/library/media-center');
            return response.data.data || [];
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch media center items';
            setError(message);
            console.error(err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createMediaCenterItem = async (formData: FormData): Promise<MediaCenterItem | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/library/media-center/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to upload media center item';
            setError(message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateMediaCenterItem = async (id: string, data: { templateName?: string; mediaType?: MediaType }): Promise<MediaCenterItem | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/library/media-center/${id}`, data);
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to update media center item';
            setError(message);
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deleteMediaCenterItem = async (id: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/library/media-center/${id}`);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete media center item';
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
        getMediaCenterItems,
        createMediaCenterItem,
        updateMediaCenterItem,
        deleteMediaCenterItem,
    };
};
