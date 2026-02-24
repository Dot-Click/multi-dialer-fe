import { useState } from 'react';
import api from '../lib/axios';

export type EventType = 'START_ONLY' | 'FROM_TO' | 'ALL_DAY';

export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    color: string;
    eventType: EventType;
    startDate: string;
    endDate?: string;
    assignToId: string;
    assignById: string;
    assignTo?: {
        id: string;
        fullName: string;
        email: string;
    };
    assignBy?: {
        id: string;
        fullName: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface CreateCalendarEventPayload {
    title: string;
    description?: string;
    color: string;
    eventType: EventType;
    startDate: string;
    endDate?: string;
    assignToId?: string;
}

export const useCalendar = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getEvents = async (): Promise<CalendarEvent[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/calendar');
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch calendar events';
            setError(message);
            console.error(err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const getAllEvents = async (): Promise<CalendarEvent[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/calendar/all');
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch all calendar events';
            setError(message);
            console.error(err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createEvent = async (payload: CreateCalendarEventPayload) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/calendar/create', payload);
            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to create calendar event';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const updateEvent = async (id: string, payload: Partial<CreateCalendarEventPayload>) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.put(`/calendar/${id}`, payload);
            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to update calendar event';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const deleteEvent = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.delete(`/calendar/${id}`);
            return response.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete calendar event';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getEvents,
        getAllEvents,
        createEvent,
        updateEvent,
        deleteEvent,
    };
};
