import { User, Contato, Place, Role, UserStatus, ApiKey, Webhook, AuditLog } from '../types';

const generateId = (): string => Math.random().toString(36).substring(2, 11);
const generateApiKey = (): string => `sk_live_${Math.random().toString(36).substring(2, 26)}`;

const DB_KEYS = {
    USERS: 'buscacontatos_users',
    CONTATOS: 'buscacontatos_contatos',
    API_KEYS: 'buscacontatos_apikeys',
    WEBHOOKS: 'buscacontatos_webhooks',
    AUDIT_LOGS: 'buscacontatos_auditlogs',
};

const initialUsers: User[] = [
    {
        id: 'user_admin',
        name: 'Admin User',
        email: 'admin@example.com',
        role: Role.ADMIN,
        status: UserStatus.APPROVED,
        createdAt: new Date('2023-10-01T10:00:00Z').toISOString(),
        emailVerified: true,
    },
    {
        id: 'user_regular',
        name: 'Regular User',
        email: 'user@example.com',
        role: Role.USER,
        status: UserStatus.APPROVED,
        createdAt: new Date('2023-10-02T11:00:00Z').toISOString(),
        emailVerified: true,
    },
    {
        id: 'user_pending',
        name: 'Pending User',
        email: 'pending@example.com',
        role: Role.USER,
        status: UserStatus.PENDING,
        createdAt: new Date('2023-10-03T12:00:00Z').toISOString(),
        emailVerified: false,
    },
];

// Helper to decode a mock JWT payload (for simulation purposes only)
function decodeJwtPayload(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode mock JWT", e);
        // For this simulation, we'll return a hardcoded user if decoding fails.
        // In a real app, this would be a critical error.
        return {
          email: 'google.user@example.com',
          name: 'Google User',
          picture: 'https://lh3.googleusercontent.com/a/ACg8ocJ-2xH2j-4kri4w-2244a-z2z2z-2z2z2z=s96-c',
          sub: `google-id-${generateId()}`
        };
    }
}


class MockApi {
    constructor() {
        this.initializeDb();
    }

    private initializeDb() {
        if (!localStorage.getItem(DB_KEYS.USERS)) {
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify(initialUsers));
        }
        if (!localStorage.getItem(DB_KEYS.CONTATOS)) {
            localStorage.setItem(DB_KEYS.CONTATOS, JSON.stringify({}));
        }
        if (!localStorage.getItem(DB_KEYS.API_KEYS)) {
            localStorage.setItem(DB_KEYS.API_KEYS, JSON.stringify({}));
        }
        if (!localStorage.getItem(DB_KEYS.WEBHOOKS)) {
            localStorage.setItem(DB_KEYS.WEBHOOKS, JSON.stringify({}));
        }
         if (!localStorage.getItem(DB_KEYS.AUDIT_LOGS)) {
            localStorage.setItem(DB_KEYS.AUDIT_LOGS, JSON.stringify([]));
        }
    }

    private _get<T>(key: string, defaultValue: T): T {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error getting item ${key} from localStorage`, error);
            return defaultValue;
        }
    }

    private _set<T>(key: string, value: T): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting item ${key} in localStorage`, error);
        }
    }
    
    private _addAuditLog(actor: User, action: string, target: { id: string, name: string }, details: string): void {
        const logs = this._get<AuditLog[]>(DB_KEYS.AUDIT_LOGS, []);
        const newLog: AuditLog = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            actor: { id: actor.id, name: actor.name },
            action,
            target,
            details
        };
        this._set(DB_KEYS.AUDIT_LOGS, [newLog, ...logs]);
    }

    // --- Auth ---
    async login(email: string, password: string): Promise<User | null> {
        console.log(`Attempting login for: ${email}`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const users = this._get<User[]>(DB_KEYS.USERS, []);
        const user = users.find(u => u.email === email);
        
        // In a real app, you'd check a hashed password. Here we allow any password for simplicity.
        if (user && user.status === UserStatus.APPROVED) {
            return user;
        }
        if (user && user.status !== UserStatus.APPROVED) {
            throw new Error(`Your account status is: ${user.status}. Please contact an administrator.`);
        }
        
        throw new Error('Invalid email or password.');
    }

    async loginWithGoogle(credential: string): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const users = this._get<User[]>(DB_KEYS.USERS, []);
        
        // In a real app, you would verify this token with Google's servers.
        // Here, we'll just simulate decoding it.
        const payload = decodeJwtPayload(credential);
        const { email, name, picture, sub: googleId } = payload;
        
        let user = users.find(u => u.email === email);

        if (user) {
            // If user exists, update their googleId and picture if not present
            user.googleId = user.googleId || googleId;
            user.picture = user.picture || picture;
            this._set(DB_KEYS.USERS, users);
            return user;
        } else {
            // If user does not exist, create a new one.
            // Google-verified users are approved by default.
            const newUser: User = {
                id: `user_${generateId()}`,
                name,
                email,
                role: Role.USER,
                status: UserStatus.APPROVED,
                createdAt: new Date().toISOString(),
                emailVerified: true,
                googleId,
                picture
            };
            const updatedUsers = [...users, newUser];
            this._set(DB_KEYS.USERS, updatedUsers);
            return newUser;
        }
    }

    // --- Contatos ---
    async getContatos(userId: string): Promise<Contato[]> {
        const allContatos = this._get<Record<string, Contato[]>>(DB_KEYS.CONTATOS, {});
        return allContatos[userId] || [];
    }

    async saveContatos(userId: string, newContatos: Contato[]): Promise<Contato[]> {
        const allContatos = this._get<Record<string, Contato[]>>(DB_KEYS.CONTATOS, {});
        const userContatos = allContatos[userId] || [];
        const updatedContatos = [...userContatos, ...newContatos];
        allContatos[userId] = updatedContatos;
        this._set(DB_KEYS.CONTATOS, allContatos);
        return updatedContatos;
    }

    async removeContato(userId: string, placeId: string): Promise<boolean> {
        const allContatos = this._get<Record<string, Contato[]>>(DB_KEYS.CONTATOS, {});
        const userContatos = allContatos[userId] || [];
        allContatos[userId] = userContatos.filter(contato => contato.place_id !== placeId);
        this._set(DB_KEYS.CONTATOS, allContatos);
        return true;
    }

    // --- API Keys ---
    async getApiKeys(userId: string): Promise<ApiKey[]> {
        const allKeys = this._get<Record<string, ApiKey[]>>(DB_KEYS.API_KEYS, {});
        return allKeys[userId] || [];
    }
    
    async createApiKey(userId: string, label: string): Promise<ApiKey> {
        const allKeys = this._get<Record<string, ApiKey[]>>(DB_KEYS.API_KEYS, {});
        const userKeys = allKeys[userId] || [];
        const newKey: ApiKey = {
            id: generateId(),
            label,
            key: generateApiKey(),
            createdAt: new Date().toISOString()
        };
        allKeys[userId] = [...userKeys, newKey];
        this._set(DB_KEYS.API_KEYS, allKeys);
        return newKey;
    }

    async deleteApiKey(userId: string, keyId: string): Promise<boolean> {
        const allKeys = this._get<Record<string, ApiKey[]>>(DB_KEYS.API_KEYS, {});
        const userKeys = allKeys[userId] || [];
        allKeys[userId] = userKeys.filter(key => key.id !== keyId);
        this._set(DB_KEYS.API_KEYS, allKeys);
        return true;
    }
    
    // --- Webhooks ---
    async getWebhooks(userId: string): Promise<Webhook[]> {
        const allWebhooks = this._get<Record<string, Webhook[]>>(DB_KEYS.WEBHOOKS, {});
        return allWebhooks[userId] || [];
    }

    async createWebhook(userId: string, url: string): Promise<Webhook> {
        const allWebhooks = this._get<Record<string, Webhook[]>>(DB_KEYS.WEBHOOKS, {});
        const userWebhooks = allWebhooks[userId] || [];
        const newWebhook: Webhook = {
            id: generateId(),
            url,
            createdAt: new Date().toISOString()
        };
        allWebhooks[userId] = [...userWebhooks, newWebhook];
        this._set(DB_KEYS.WEBHOOKS, allWebhooks);
        return newWebhook;
    }

    async deleteWebhook(userId: string, webhookId: string): Promise<boolean> {
        const allWebhooks = this._get<Record<string, Webhook[]>>(DB_KEYS.WEBHOOKS, {});
        const userWebhooks = allWebhooks[userId] || [];
        allWebhooks[userId] = userWebhooks.filter(wh => wh.id !== webhookId);
        this._set(DB_KEYS.WEBHOOKS, allWebhooks);
        return true;
    }
    
    // --- Admin ---
    async getUsers(): Promise<User[]> {
        return this._get<User[]>(DB_KEYS.USERS, []);
    }

    async updateUser(actorId: string, targetUserId: string, status?: UserStatus, role?: Role): Promise<boolean> {
        const users = this._get<User[]>(DB_KEYS.USERS, []);
        const actor = users.find(u => u.id === actorId);
        const targetUser = users.find(u => u.id === targetUserId);
        
        if (!actor || actor.role !== Role.ADMIN || !targetUser) return false;

        let details = [];
        if (status && targetUser.status !== status) {
            details.push(`Status changed from ${targetUser.status} to ${status}`);
            targetUser.status = status;
        }
        if (role && targetUser.role !== role) {
            details.push(`Role changed from ${targetUser.role} to ${role}`);
            targetUser.role = role;
        }

        if (details.length > 0) {
            this._set(DB_KEYS.USERS, users);
            this._addAuditLog(actor, 'User Updated', { id: targetUser.id, name: targetUser.name }, details.join('. '));
        }

        return true;
    }

    async deleteUser(actorId: string, targetUserId: string): Promise<boolean> {
        let users = this._get<User[]>(DB_KEYS.USERS, []);
        const actor = users.find(u => u.id === actorId);
        const targetUser = users.find(u => u.id === targetUserId);

        if (!actor || actor.role !== Role.ADMIN || !targetUser || actor.id === targetUserId) return false;

        this._set(DB_KEYS.USERS, users.filter(u => u.id !== targetUserId));
        this._addAuditLog(actor, 'User Deleted', { id: targetUser.id, name: targetUser.name }, `User ${targetUser.email} was permanently deleted.`);
        return true;
    }
    
    async getAuditLogs(): Promise<AuditLog[]> {
        return this._get<AuditLog[]>(DB_KEYS.AUDIT_LOGS, []).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
}

export const mockApi = new MockApi();