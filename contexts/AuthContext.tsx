import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { mockApi } from '../services/mockApi';
import { User, Contato, Place, Role, UserStatus, AuditLog } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  savedContatos: Contato[];
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  saveContatos: (places: Place[]) => Promise<void>;
  removeContato: (placeId: string) => Promise<void>;
  // Admin functions
  adminGetAllUsers: () => Promise<User[]>;
  adminUpdateUser: (userId: string, status?: UserStatus, role?: Role) => Promise<boolean>;
  adminDeleteUser: (userId: string) => Promise<boolean>;
  adminGetAuditLogs: () => Promise<AuditLog[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'buscacontatos_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedContatos, setSavedContatos] = useState<Contato[]>([]);

  const fetchContatos = useCallback(async (userId: string) => {
    try {
      const contatos = await mockApi.getContatos(userId);
      setSavedContatos(contatos);
    } catch (error) {
      console.error("Failed to fetch contatos", error);
      setSavedContatos([]);
    }
  }, []);
  
  useEffect(() => {
    const checkSession = () => {
      try {
        const storedUser = sessionStorage.getItem(SESSION_KEY);
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          fetchContatos(parsedUser.id);
        }
      } catch (error) {
        console.error("Failed to parse user from session storage", error);
        sessionStorage.removeItem(SESSION_KEY);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, [fetchContatos]);

  const login = async (email: string, password: string) => {
    const loggedInUser = await mockApi.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(loggedInUser));
      await fetchContatos(loggedInUser.id);
    }
  };

  const loginWithGoogle = async (credential: string) => {
    const loggedInUser = await mockApi.loginWithGoogle(credential);
     if (loggedInUser) {
      setUser(loggedInUser);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(loggedInUser));
      await fetchContatos(loggedInUser.id);
    }
  };

  const logout = () => {
    setUser(null);
    setSavedContatos([]);
    sessionStorage.removeItem(SESSION_KEY);
  };

  const saveContatos = async (places: Place[]) => {
    if (!user) throw new Error("User not authenticated");
    const newContatos: Contato[] = places.map(place => ({
      ...place,
      consent_timestamp: new Date().toISOString(),
    }));
    const updatedContatos = await mockApi.saveContatos(user.id, newContatos);
    setSavedContatos(updatedContatos);
  };

  const removeContato = async (placeId: string) => {
    if (!user) throw new Error("User not authenticated");
    await mockApi.removeContato(user.id, placeId);
    setSavedContatos(prev => prev.filter(contato => contato.place_id !== placeId));
  };
  
  // Admin Functions
  const adminCheck = (): User => {
      if (!user || user.role !== Role.ADMIN) {
          throw new Error("Admin privileges required.");
      }
      return user;
  }

  const adminGetAllUsers = async (): Promise<User[]> => {
      adminCheck();
      return mockApi.getUsers();
  };
  
  const adminUpdateUser = async (userId: string, status?: UserStatus, role?: Role): Promise<boolean> => {
      const adminUser = adminCheck();
      return mockApi.updateUser(adminUser.id, userId, status, role);
  };

  const adminDeleteUser = async (userId: string): Promise<boolean> => {
      const adminUser = adminCheck();
      return mockApi.deleteUser(adminUser.id, userId);
  };

  const adminGetAuditLogs = async (): Promise<AuditLog[]> => {
      adminCheck();
      return mockApi.getAuditLogs();
  };


  const value = {
    user,
    isLoading,
    savedContatos,
    login,
    loginWithGoogle,
    logout,
    saveContatos,
    removeContato,
    adminGetAllUsers,
    adminUpdateUser,
    adminDeleteUser,
    adminGetAuditLogs
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};