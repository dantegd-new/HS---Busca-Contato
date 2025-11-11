

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('admin@test.com');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoggingIn(true);
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message || 'Falha ao fazer login.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    const prefillUser = (type: 'admin' | 'user') => {
        if (type === 'admin') {
            setEmail('admin@test.com');
            setPassword('admin');
        } else {
            setEmail('user@test.com');
            setPassword('user');
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">HS - Busca Contatos</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Acesse sua conta para encontrar novos leads.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="voce@exemplo.com"
                                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Senha</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full flex justify-center items-center px-4 py-2.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:bg-sky-400 disabled:cursor-not-allowed transition duration-200"
                            >
                                {isLoggingIn ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
                        <p>Para demonstração, use:</p>
                        <div className="flex justify-center gap-2 mt-2">
                             <button onClick={() => prefillUser('admin')} className="text-sky-600 hover:underline">Login Admin</button>
                             <span>|</span>
                             <button onClick={() => prefillUser('user')} className="text-sky-600 hover:underline">Login Usuário</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
