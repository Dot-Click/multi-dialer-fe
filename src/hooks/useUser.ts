import { useState } from 'react';
import { authClient } from '../lib/auth-client';
import toast from 'react-hot-toast';

export interface User {
    id: string;
    fullName: string | null;
    email: string;
    role: string | null;
    status: string | null;
    image?: string | null;
    lastLogin?: string | null;
    createdById?: string | null;
}

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getUsers = async (params?: { createdBy?: string }): Promise<User[]> => {
        setLoading(true);
        setError(null);
        try {
            // Using better-auth admin plugin to list users
            const { data, error } = await authClient.admin.listUsers({
                query: {
                    limit: 100, // Adjust as needed
                }
            });

            if (error) {
                throw new Error(error.message || 'Failed to fetch users');
            }

            let users = (data?.users || []) as User[];

            // Filter by creator if requested
            if (params?.createdBy) {
                users = users.filter(u => u.createdById === params.createdBy);
            }

            return users;
        } catch (err: any) {
            const message = err.message || 'Failed to fetch users';
            setError(message);
            console.error(err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (userData: any): Promise<boolean> => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await authClient.admin.createUser({
                ...userData,
                name: userData.fullName,
                // better-auth might not support createdById directly in createUser, 
                // we might need to update it after or ensure it's in additionalFields
                data: {
                    createdById: userData.createdById,
                    role: userData.role,
                    status: userData.status,
                    fullName: userData.fullName
                }
            });

            if (error) {
                throw new Error(error.message || 'Failed to create user');
            }

            toast.success('User created successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to create user';
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
            const { error } = await authClient.admin.removeUser({
                userId
            });

            if (error) {
                throw new Error(error.message || 'Failed to delete user');
            }

            toast.success('User deleted successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to delete user';
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
