
import { User, Contato, ApiKey, Webhook, AuditLog, UserStatus, Role, Place } from '../types';

// --- MOCK DATABASE ---
const DB_KEY = 'hs-busca-contatos-db';

interface Database {
  users: User[];
  contatos: Record<string, Contato[]>; // Stored per user ID
  apiKeys: Record<string, ApiKey[]>;
  webhooks: Record<string, Webhook[]>;
  auditLogs: AuditLog[];
  currentUser: string | null;
}

const getDb = (): Database => {
  try {
    const data = localStorage.getItem(DB_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to parse DB from localStorage", error);
  }
  return {
    users: [],
    contatos: {},
    apiKeys: {},
    webhooks: {},
    auditLogs: [],
    currentUser: null,
  };
};

const saveDb = (db: Database) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error) {
    console.error("Failed to save DB to localStorage", error);
  }
};

const initDb = () => {
  let db = getDb();
  if (db.users.length === 0) {
    db.users = [
      { id: 'user-1', name: 'Admin User', email: 'admin@test.com', password: 'admin', role: Role.ADMIN, status: UserStatus.APPROVED, createdAt: new Date().toISOString(), emailVerified: true },
      { id: 'user-2', name: 'Regular User', email: 'user@test.com', password: 'user', role: Role.USER, status: UserStatus.APPROVED, createdAt: new Date().toISOString(), emailVerified: true },
      { id: 'user-3', name: 'Pending User', email: 'pending@test.com', password: 'pending', role: Role.USER, status: UserStatus.PENDING, createdAt: new Date().toISOString(), emailVerified: true },
    ];
    saveDb(db);
  }
};

initDb();

// --- UTILS ---
const simulateDelay = (ms: number = 500) => new Promise(res => setTimeout(res, ms));

const createLog = (actorId: string, action: string, targetId: string, details: string) => {
    const db = getDb();
    const actor = db.users.find(u => u.id === actorId);
    const target = db.users.find(u => u.id === targetId);
    if (!actor) return;

    const log: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: { id: actor.id, name: actor.name },
        action,
        target: target ? { id: target.id, name: target.name } : { id: targetId, name: 'System' },
        details
    };
    db.auditLogs.unshift(log);
    saveDb(db);
};

// --- API FUNCTIONS ---

export const login = async (email: string, password_unused: string): Promise<User> => {
    await simulateDelay();
    const db = getDb();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
        throw new Error('Usuário não encontrado.');
    }
    
    if (user.status === UserStatus.BLOCKED) {
        throw new Error('Sua conta está bloqueada.');
    }
    
    // In a real app, you'd check the password here
    // For this mock, we'll just log in if the user exists.

    db.currentUser = user.id;
    saveDb(db);
    return user;
};

export const logout = async (): Promise<void> => {
    await simulateDelay(200);
    const db = getDb();
    db.currentUser = null;
    saveDb(db);
};

export const getCurrentUser = async (): Promise<User | null> => {
    await simulateDelay(300);
    const db = getDb();
    if (!db.currentUser) return null;
    return db.users.find(u => u.id === db.currentUser) || null;
};

// --- CONTATOS ---
export const getSavedContatos = async (userId: string): Promise<Contato[]> => {
    await simulateDelay();
    const db = getDb();
    return db.contatos[userId] || [];
};

export const saveContatos = async (userId: string, contatos: Contato[]): Promise<Contato[]> => {
    await simulateDelay();
    const db = getDb();
    if (!db.contatos[userId]) {
        db.contatos[userId] = [];
    }
    const existingIds = new Set(db.contatos[userId].map(c => c.place_id));
    const newContatos = contatos.filter(c => !existingIds.has(c.place_id));
    db.contatos[userId].push(...newContatos);
    saveDb(db);
    return db.contatos[userId];
};

export const removeContato = async (userId: string, place_id: string): Promise<Contato[]> => {
    await simulateDelay();
    const db = getDb();
    if (db.contatos[userId]) {
        db.contatos[userId] = db.contatos[userId].filter(c => c.place_id !== place_id);
        saveDb(db);
    }
    return db.contatos[userId] || [];
};

// --- ADMIN ---
export const adminGetAllUsers = async (): Promise<User[]> => {
    await simulateDelay();
    return getDb().users;
};

export const adminUpdateUser = async (actorId: string, targetId: string, status?: UserStatus, role?: Role): Promise<boolean> => {
    await simulateDelay();
    const db = getDb();
    const user = db.users.find(u => u.id === targetId);
    if (!user) return false;
    
    if (status) {
        user.status = status;
        createLog(actorId, `User status updated to ${status}`, targetId, `Status of ${user.email} changed to ${status}.`);
    }
    if (role) {
        user.role = role;
        createLog(actorId, `User role updated to ${role}`, targetId, `Role of ${user.email} changed to ${role}.`);
    }

    saveDb(db);
    return true;
};

export const adminDeleteUser = async (actorId: string, targetId: string): Promise<boolean> => {
    await simulateDelay();
    const db = getDb();
    const userIndex = db.users.findIndex(u => u.id === targetId);
    if (userIndex === -1) return false;

    const user = db.users[userIndex];
    createLog(actorId, 'User deleted', targetId, `User ${user.email} was permanently deleted.`);
    
    db.users.splice(userIndex, 1);
    delete db.contatos[targetId];
    delete db.apiKeys[targetId];
    delete db.webhooks[targetId];
    
    saveDb(db);
    return true;
};

export const adminGetAuditLogs = async (): Promise<AuditLog[]> => {
    await simulateDelay();
    return getDb().auditLogs;
};

// --- INTEGRATIONS ---
export const getApiKeys = async (userId: string): Promise<ApiKey[]> => {
    await simulateDelay();
    return getDb().apiKeys[userId] || [];
};

export const createApiKey = async (userId: string, label: string): Promise<ApiKey> => {
    await simulateDelay();
    const db = getDb();
    if (!db.apiKeys[userId]) {
        db.apiKeys[userId] = [];
    }
    const newKey: ApiKey = {
        id: `key-${Date.now()}`,
        label,
        key: `sk_live_${[...Array(24)].map(() => Math.random().toString(36)[2]).join('')}`,
        createdAt: new Date().toISOString(),
    };
    db.apiKeys[userId].push(newKey);
    saveDb(db);
    return newKey;
};

export const deleteApiKey = async (userId: string, keyId: string): Promise<boolean> => {
    await simulateDelay();
    const db = getDb();
    if (db.apiKeys[userId]) {
        db.apiKeys[userId] = db.apiKeys[userId].filter(k => k.id !== keyId);
        saveDb(db);
        return true;
    }
    return false;
};

export const getWebhooks = async (userId: string): Promise<Webhook[]> => {
    await simulateDelay();
    return getDb().webhooks[userId] || [];
};

export const createWebhook = async (userId: string, url: string): Promise<Webhook> => {
    await simulateDelay();
    const db = getDb();
    if (!db.webhooks[userId]) {
        db.webhooks[userId] = [];
    }
    const newWebhook: Webhook = {
        id: `hook-${Date.now()}`,
        url,
        createdAt: new Date().toISOString(),
    };
    db.webhooks[userId].push(newWebhook);
    saveDb(db);
    return newWebhook;
};

export const deleteWebhook = async (userId: string, webhookId: string): Promise<boolean> => {
    await simulateDelay();
    const db = getDb();
    if (db.webhooks[userId]) {
        db.webhooks[userId] = db.webhooks[userId].filter(w => w.id !== webhookId);
        saveDb(db);
        return true;
    }
    return false;
};
