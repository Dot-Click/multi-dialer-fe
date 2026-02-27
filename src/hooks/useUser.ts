import { useState } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';

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
            toast.error(message);
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    };


    const deleteUser = async (userId: string): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/user/${userId}`);
            toast.success('User deleted successfully');
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete user';
            setError(message);
            toast.error(message);
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
        deleteUser,
    };
};
