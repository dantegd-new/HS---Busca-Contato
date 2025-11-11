
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as mockApi from '../services/mockApi';
import { User, Contato, Place, UserStatus, Role, AuditLog, ApiKey, Webhook } from '../types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    
    // Contatos
    savedContatos: Contato[];
    saveContatos: (contatos: Contato[]) => Promise<void>;
    removeContato: (place_id: string) => Promise<void>;
    
    // Integrations
    apiKeys: ApiKey[];
    getApiKeys: () => Promise<void>;
    createApiKey: (label: string) => Promise<ApiKey>;
    deleteApiKey: (keyId: string) => Promise<void>;
    webhooks: Webhook[];
    getWebhooks: () => Promise<void>;
    createWebhook: (url: string) => Promise<Webhook>;
    deleteWebhook: (webhookId: string) => Promise<void>;

    // Admin
    adminGetAllUsers: () => Promise<User[]>;
    adminUpdateUser: (userId: string, status?: UserStatus, role?: Role) => Promise<boolean>;
    adminDeleteUser: (userId: string) => Promise<boolean>;
    adminGetAuditLogs: () => Promise<AuditLog[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [savedContatos, setSavedContatos] = useState<Contato[]>([]);
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);

    const fetchUserData = useCallback(async (currentUser: User) => {
        const contatos = await mockApi.getSavedContatos(currentUser.id);
        setSavedContatos(contatos);
    }, []);
    
    useEffect(() => {
        const checkUser = async () => {
            try {
                const currentUser = await mockApi.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    await fetchUserData(currentUser);
                }
            } catch (error) {
                console.error("Failed to fetch current user", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkUser();
    }, [fetchUserData]);
    
    const login = useCallback(async (email: string, pass: string) => {
        const loggedInUser = await mockApi.login(email, pass);
        setUser(loggedInUser);
        await fetchUserData(loggedInUser);
    }, [fetchUserData]);
    
    const logout = useCallback(async () => {
        await mockApi.logout();
        setUser(null);
        setSavedContatos([]);
    }, []);

    const saveContatos = useCallback(async (contatosToSave: Contato[]) => {
        if (!user) return;
        const updatedContatos = await mockApi.saveContatos(user.id, contatosToSave);
        setSavedContatos(updatedContatos);
    }, [user]);

    const removeContato = useCallback(async (place_id: string) => {
        if (!user) return;
        const updatedContatos = await mockApi.removeContato(user.id, place_id);
        setSavedContatos(updatedContatos);
    }, [user]);

    // --- Integrations ---
    const getApiKeys = useCallback(async () => {
        if (!user) return;
        const keys = await mockApi.getApiKeys(user.id);
        setApiKeys(keys);
    }, [user]);

    const createApiKey = useCallback(async (label: string) => {
        if (!user) throw new Error("User not authenticated");
        const newKey = await mockApi.createApiKey(user.id, label);
        setApiKeys(prev => [...prev, newKey]);
        return newKey;
    }, [user]);

    const deleteApiKey = useCallback(async (keyId: string) => {
        if (!user) return;
        await mockApi.deleteApiKey(user.id, keyId);
        setApiKeys(prev => prev.filter(k => k.id !== keyId));
    }, [user]);

    const getWebhooks = useCallback(async () => {
        if (!user) return;
        const hooks = await mockApi.getWebhooks(user.id);
        setWebhooks(hooks);
    }, [user]);

    const createWebhook = useCallback(async (url: string) => {
        if (!user) throw new Error("User not authenticated");
        const newWebhook = await mockApi.createWebhook(user.id, url);
        setWebhooks(prev => [...prev, newWebhook]);
        return newWebhook;
    }, [user]);

    const deleteWebhook = useCallback(async (webhookId: string) => {
        if (!user) return;
        await mockApi.deleteWebhook(user.id, webhookId);
        setWebhooks(prev => prev.filter(w => w.id !== webhookId));
    }, [user]);

    // --- Admin ---
    const adminGetAllUsers = useCallback(() => {
        if (user?.role !== Role.ADMIN) throw new Error("Not authorized");
        return mockApi.adminGetAllUsers();
    }, [user]);

    const adminUpdateUser = useCallback((userId: string, status?: UserStatus, role?: Role) => {
        if (user?.role !== Role.ADMIN) throw new Error("Not authorized");
        return mockApi.adminUpdateUser(user.id, userId, status, role);
    }, [user]);
    
    const adminDeleteUser = useCallback((userId: string) => {
        if (user?.role !== Role.ADMIN) throw new Error("Not authorized");
        return mockApi.adminDeleteUser(user.id, userId);
    }, [user]);

    const adminGetAuditLogs = useCallback(() => {
        if (user?.role !== Role.ADMIN) throw new Error("Not authorized");
        return mockApi.adminGetAuditLogs();
    }, [user]);

    const value: AuthContextType = {
        user,
        isLoading,
        login,
        logout,
        savedContatos,
        saveContatos,
        removeContato,
        apiKeys,
        getApiKeys,
        createApiKey,
        deleteApiKey,
        webhooks,
        getWebhooks,
        createWebhook,
        deleteWebhook,
        adminGetAllUsers,
        adminUpdateUser,
        adminDeleteUser,
        adminGetAuditLogs,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
