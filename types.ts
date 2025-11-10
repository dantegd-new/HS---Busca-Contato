export interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  rating: number;
  user_ratings_total: number;
  business_status: string;
  website?: string;
  formatted_phone_number?: string;
}

export interface Contato extends Place {
  consent_timestamp: string;
}

export enum SearchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export enum UserStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  BLOCKED = 'BLOCKED',
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  emailVerified: boolean;
  googleId?: string;
  picture?: string;
}

export interface ApiKey {
  id: string;
  label: string;
  key: string;
  createdAt: string;
}

export interface Webhook {
  id: string;
  url: string;
  createdAt: string;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    actor: { id: string; name: string; };
    action: string;
    target: { id: string; name: string; };
    details: string;
}