import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../services/mockApi';
import { ApiKey } from '../types';

export const ApiKeysManager: React.FC = () => {
    const { user } = useAuth();
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [newKeyLabel, setNewKeyLabel] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchKeys = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        const userKeys = await mockApi.getApiKeys(user.id);
        setKeys(userKeys);
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        fetchKeys();
    }, [fetchKeys]);

    const handleCreateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newKeyLabel.trim()) return;
        
        await mockApi.createApiKey(user.id, newKeyLabel.trim());
        setNewKeyLabel('');
        fetchKeys();
    };

    const handleDeleteKey = async (keyId: string) => {
        if (!user || !window.confirm("Tem certeza que deseja revogar esta chave de API?")) return;
        
        await mockApi.deleteApiKey(user.id, keyId);
        fetchKeys();
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Chaves de API</h3>
            <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg mb-6">
                <form onSubmit={handleCreateKey} className="flex items-center gap-4">
                    <input
                        type="text"
                        value={newKeyLabel}
                        onChange={(e) => setNewKeyLabel(e.target.value)}
                        placeholder="Nome da nova chave (ex: My App)"
                        className="flex-grow px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm"
                        required
                    />
                    <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-700">
                        Criar Chave
                    </button>
                </form>
            </div>

            {isLoading ? <p>Carregando chaves...</p> : (
            <div className="space-y-3">
                {keys.length === 0 && <p className="text-sm text-slate-500">Nenhuma chave de API criada.</p>}
                {keys.map(key => (
                    <div key={key.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-mono text-sm text-slate-800 dark:text-slate-200">{key.key}</p>
                                <div className="relative flex items-center group">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="absolute bottom-full left-1/2 z-10 w-max max-w-xs -translate-x-1/2 -translate-y-2 transform rounded-lg bg-slate-800 px-3 py-2 text-center text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 invisible group-hover:visible">
                                      Guarde esta chave em segurança. Ela não será exibida novamente.
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{key.label} &bull; Criada em {new Date(key.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handleDeleteKey(key.id)} className="text-sm font-medium text-red-600 hover:text-red-800">
                            Revogar
                        </button>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};