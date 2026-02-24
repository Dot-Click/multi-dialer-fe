import { useState } from 'react';
import api from '../lib/axios';

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    status: string;
    image?: string;
    lastLogin?: string;
}

export interface CreateUserData {
    fullName: string;
    email: string;
    role: string;
    status: string;
    password?: string;
}

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getUsers = async (): Promise<User[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/user');
            return response.data.data;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch users';
            setError(message);
            console.error(err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (userData: CreateUserData): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await api.post('/auth/sign-up/email', userData);
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to create user';
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
        getUsers,
        createUser,
    };
};
