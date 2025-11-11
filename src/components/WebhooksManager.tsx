

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const WebhooksManager: React.FC = () => {
    const { webhooks, getWebhooks, createWebhook, deleteWebhook } = useAuth();
    const [newWebhookUrl, setNewWebhookUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getWebhooks();
    }, [getWebhooks]);

    const handleCreateWebhook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newWebhookUrl.trim() || !isValidUrl(newWebhookUrl)) {
            alert("Por favor, insira uma URL válida.");
            return;
        }
        setIsLoading(true);
        try {
            await createWebhook(newWebhookUrl);
            setNewWebhookUrl('');
        } catch (error) {
            console.error("Failed to create webhook", error);
            alert("Não foi possível criar o webhook.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch (_) {
            return false;
        }
    }

    const handleDelete = (webhookId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este webhook?')) {
            deleteWebhook(webhookId);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Gerenciar Webhooks</h3>
            <form onSubmit={handleCreateWebhook} className="flex flex-col sm:flex-row gap-2 mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <input
                    type="url"
                    value={newWebhookUrl}
                    onChange={(e) => setNewWebhookUrl(e.target.value)}
                    placeholder="https://seu-servidor.com/webhook"
                    className="flex-grow px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    required
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 font-semibold text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition"
                >
                    {isLoading ? 'Adicionando...' : 'Adicionar Webhook'}
                </button>
            </form>

            <div className="space-y-3">
                {webhooks.length > 0 ? webhooks.map(hook => (
                    <div key={hook.id} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <div>
                            <p className="font-mono text-sm text-slate-800 dark:text-slate-200 break-all">{hook.url}</p>
                            <p className="text-xs text-slate-500">Criado em: {new Date(hook.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handleDelete(hook.id)} className="text-sm font-medium text-red-600 dark:text-red-500 hover:underline flex-shrink-0 ml-4">
                            Excluir
                        </button>
                    </div>
                )) : (
                    <p className="text-slate-500 dark:text-slate-400">Nenhum webhook configurado.</p>
                )}
            </div>
        </div>
    );
};
