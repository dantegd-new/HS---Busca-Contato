

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ApiKey } from '../types';

export const ApiKeysManager: React.FC = () => {
    const { apiKeys, getApiKeys, createApiKey, deleteApiKey } = useAuth();
    const [newKeyLabel, setNewKeyLabel] = useState('');
    const [generatedKey, setGeneratedKey] = useState<ApiKey | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getApiKeys();
    }, [getApiKeys]);

    const handleCreateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyLabel.trim()) return;
        setIsLoading(true);
        try {
            const newKey = await createApiKey(newKeyLabel);
            setGeneratedKey(newKey);
            setNewKeyLabel('');
        } catch (error) {
            console.error("Failed to create API key", error);
            alert("Não foi possível criar a chave de API.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = (keyId: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta chave de API? Esta ação não pode ser desfeita.')) {
            deleteApiKey(keyId);
        }
    };

    if (generatedKey) {
        return (
            <div>
                <h3 className="text-xl font-bold mb-2">Chave de API Criada com Sucesso</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Copie sua chave de API agora. Você não poderá vê-la novamente por motivos de segurança.
                </p>
                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg mb-4">
                    <p className="font-mono text-sm break-all">{generatedKey.key}</p>
                </div>
                <button 
                    onClick={() => setGeneratedKey(null)}
                    className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-700 transition"
                >
                    Entendi, fechar
                </button>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Gerenciar Chaves de API</h3>
            <form onSubmit={handleCreateKey} className="flex flex-col sm:flex-row gap-2 mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <input
                    type="text"
                    value={newKeyLabel}
                    onChange={(e) => setNewKeyLabel(e.target.value)}
                    placeholder="Rótulo da chave (ex: Meu App)"
                    className="flex-grow px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    required
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 font-semibold text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition"
                >
                    {isLoading ? 'Criando...' : 'Criar Nova Chave'}
                </button>
            </form>

            <div className="space-y-3">
                {apiKeys.length > 0 ? apiKeys.map(key => (
                    <div key={key.id} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{key.label}</p>
                            <p className="text-xs text-slate-500">Criada em: {new Date(key.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handleDelete(key.id)} className="text-sm font-medium text-red-600 dark:text-red-500 hover:underline">
                            Excluir
                        </button>
                    </div>
                )) : (
                    <p className="text-slate-500 dark:text-slate-400">Nenhuma chave de API encontrada.</p>
                )}
            </div>
        </div>
    );
};
