import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, UserStatus, Role, AuditLog } from '../types';

const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-lg flex items-center space-x-4">
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300">
            {icon}
        </div>
        <div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</div>
            <div className="mt-1 text-3xl font-semibold text-slate-900 dark:text-white">{value}</div>
        </div>
    </div>
);

const UserTable: React.FC<{ users: User[], onAction: (userId: string, action: 'approve' | 'block' | 'make_admin' | 'make_user' | 'delete') => void }> = ({ users, onAction }) => {
    const { user: currentUser } = useAuth();
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nome</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Role</th>
                        <th scope="col" className="px-6 py-3">Data de Criação</th>
                        <th scope="col" className="px-6 py-3">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{user.name}<br /><span className="text-xs text-slate-400">{user.email}</span></td>
                            <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                user.status === UserStatus.APPROVED ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                user.status === UserStatus.PENDING ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>{user.status}</span></td>
                            <td className="px-6 py-4">{user.role}</td>
                            <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 space-x-2">
                                {user.status === UserStatus.PENDING && <button onClick={() => onAction(user.id, 'approve')} className="font-medium text-green-600 hover:underline">Aprovar</button>}
                                {user.status === UserStatus.APPROVED && <button onClick={() => onAction(user.id, 'block')} className="font-medium text-red-600 hover:underline">Bloquear</button>}
                                {user.role === Role.USER && <button onClick={() => onAction(user.id, 'make_admin')} className="font-medium text-indigo-600 hover:underline">Tornar Admin</button>}
                                {user.role === Role.ADMIN && user.id !== currentUser?.id && <button onClick={() => onAction(user.id, 'make_user')} className="font-medium text-yellow-600 hover:underline">Tornar User</button>}
                                {user.id !== currentUser?.id && <button onClick={() => onAction(user.id, 'delete')} className="font-medium text-red-600 hover:underline">Deletar</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const AuditLogTable: React.FC<{ logs: AuditLog[] }> = ({ logs }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300">
                <tr>
                    <th scope="col" className="px-6 py-3">Timestamp</th>
                    <th scope="col" className="px-6 py-3">Ator</th>
                    <th scope="col" className="px-6 py-3">Ação</th>
                    <th scope="col" className="px-6 py-3">Alvo</th>
                    <th scope="col" className="px-6 py-3">Detalhes</th>
                </tr>
            </thead>
            <tbody>
                {logs.map(log => (
                    <tr key={log.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700">
                        <td className="px-6 py-4">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-4">{log.actor.name}</td>
                        <td className="px-6 py-4">{log.action}</td>
                        <td className="px-6 py-4">{log.target.name}</td>
                        <td className="px-6 py-4">{log.details}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const AdminPage: React.FC = () => {
    const { adminGetAllUsers, adminUpdateUser, adminDeleteUser, adminGetAuditLogs } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [fetchedUsers, fetchedLogs] = await Promise.all([adminGetAllUsers(), adminGetAuditLogs()]);
            setUsers(fetchedUsers);
            setAuditLogs(fetchedLogs);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
        } finally {
            setIsLoading(false);
        }
    }, [adminGetAllUsers, adminGetAuditLogs]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAction = async (userId: string, action: 'approve' | 'block' | 'make_admin' | 'make_user' | 'delete') => {
        let confirmationText = 'Você tem certeza?';
        let success = false;
        
        switch(action) {
            case 'approve': 
                confirmationText = 'Aprovar este usuário?';
                if (window.confirm(confirmationText)) success = await adminUpdateUser(userId, UserStatus.APPROVED);
                break;
            case 'block':
                confirmationText = 'Bloquear este usuário?';
                if (window.confirm(confirmationText)) success = await adminUpdateUser(userId, UserStatus.BLOCKED);
                break;
            case 'make_admin':
                confirmationText = 'Promover este usuário a Administrador?';
                if (window.confirm(confirmationText)) success = await adminUpdateUser(userId, undefined, Role.ADMIN);
                break;
            case 'make_user':
                confirmationText = 'Remover privilégios de Administrador deste usuário?';
                if (window.confirm(confirmationText)) success = await adminUpdateUser(userId, undefined, Role.USER);
                break;
            case 'delete':
                confirmationText = 'DELETAR permanentemente este usuário? Esta ação não pode ser desfeita.';
                if (window.confirm(confirmationText)) success = await adminDeleteUser(userId);
                break;
        }

        if (success) {
            fetchData(); // Refresh data on success
        } else {
            // alert("Ação falhou ou foi cancelada.");
        }
    };
    
    const stats = useMemo(() => ({
        total: users.length,
        approved: users.filter(u => u.status === UserStatus.APPROVED).length,
        pending: users.filter(u => u.status === UserStatus.PENDING).length,
        blocked: users.filter(u => u.status === UserStatus.BLOCKED).length,
    }), [users]);

    const filteredUsers = useMemo(() => 
        users.filter(user => 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        ), [users, searchTerm]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>

            <section id="stats">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total de Usuários" value={stats.total} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.282-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.282.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
                    <StatCard title="Aprovados" value={stats.approved} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                    <StatCard title="Pendentes" value={stats.pending} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                    <StatCard title="Bloqueados" value={stats.blocked} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>} />
                </div>
            </section>
            
            <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-lg">
                 <div className="flex border-b border-slate-200 dark:border-slate-700 mb-4">
                    <button onClick={() => setActiveTab('users')} className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 ${activeTab === 'users' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Gerenciamento de Usuários</button>
                    <button onClick={() => setActiveTab('logs')} className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 ${activeTab === 'logs' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Logs de Auditoria</button>
                </div>

                {isLoading ? <p>Carregando...</p> : (
                    <>
                        {activeTab === 'users' && (
                             <div>
                                <input type="text" placeholder="Buscar por nome ou email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mb-4 w-full max-w-sm px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg"/>
                                <UserTable users={filteredUsers} onAction={handleAction}/>
                             </div>
                        )}
                        {activeTab === 'logs' && <AuditLogTable logs={auditLogs} />}
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
