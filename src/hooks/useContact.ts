import { useState } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";

export interface ContactEmail {
  email: string;
  isPrimary: boolean;
}

export interface ContactPhone {
  number: string;
  type: "MOBILE" | "TELEPHONE" | "HOME" | "WORK";
}

export interface CreateContactPayload {
  fullName: string;
  city?: string;
  state?: string;
  zip?: string;
  source?: string;
  tags?: string[];
  dataDialerId?: string;
  emails: ContactEmail[];
  phones: ContactPhone[];
  contactListId?: string;
}

export interface ContactList {
  id: string;
  name: string;
  contactIds: string[];
  createdAt: string;
}

export interface ContactFolder {
  id: string;
  name: string;
  listIds: string[];
  createdAt: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  contactIds: string[];
  createdAt: string;
}

export interface ContactBackend {
  id: string;
  fullName: string;
  city?: string;
  state?: string;
  zip?: string;
  source?: string;
  tags: string[];
  emails: { email: string; isPrimary: boolean }[];
  phones: { number: string; type: string }[];
  createdAt: string;
  updatedAt: string;
}

export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createContact = async (payload: CreateContactPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/contact/create", payload);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to create contact";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getContactLists = async (): Promise<ContactList[]> => {
    try {
      const response = await api.get("/contact/list");
      return response.data.data;
    } catch (err: any) {
      console.error("Error fetching contact lists:", err);
      return [];
    }
  };

  const getContactFolders = async (): Promise<ContactFolder[]> => {
    try {
      const response = await api.get("/contact/folder");
      return response.data.data;
    } catch (err: any) {
      console.error("Error fetching contact folders:", err);
      return [];
    }
  };

  const getContactGroups = async (): Promise<ContactGroup[]> => {
    try {
      const response = await api.get("/contact/group");
      return response.data.data;
    } catch (err: any) {
      console.error("Error fetching contact groups:", err);
      return [];
    }
  };

  const getContacts = async (): Promise<ContactBackend[]> => {
    setLoading(true);
    try {
      const response = await api.get("/contact");
      return response.data.data;
    } catch (err: any) {
      console.error("Error fetching contacts:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const importContactsCSV = async (formData: FormData) => {
    setLoading(true);
    try {
      const response = await api.post("/contact/import-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      return response.data;
    } catch (err: any) {
      console.error("Error importing contacts:", err);
      const message =
        err.response?.data?.message || "Failed to import contacts";
      toast.error(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createContact,
    getContacts,
    getContactLists,
    getContactFolders,
    getContactGroups,
    importContactsCSV,
  };
};
