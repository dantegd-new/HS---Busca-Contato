import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { mockApi } from '../services/mockApi';
import { Webhook } from '../types';

export const WebhooksManager: React.FC = () => {
    const { user } = useAuth();
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);
    const [newWebhookUrl, setNewWebhookUrl] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchWebhooks = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        const userWebhooks = await mockApi.getWebhooks(user.id);
        setWebhooks(userWebhooks);
        setIsLoading(false);
    }, [user]);

    useEffect(() => {
        fetchWebhooks();
    }, [fetchWebhooks]);

    const handleCreateWebhook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newWebhookUrl.trim()) return;
        
        try {
            // Basic URL validation
            new URL(newWebhookUrl);
            await mockApi.createWebhook(user.id, newWebhookUrl.trim());
            setNewWebhookUrl('');
            fetchWebhooks();
        } catch (error) {
            alert('Por favor, insira uma URL válida.');
        }
    };

    const handleDeleteWebhook = async (webhookId: string) => {
        if (!user || !window.confirm("Tem certeza que deseja remover este webhook?")) return;
        
        await mockApi.deleteWebhook(user.id, webhookId);
        fetchWebhooks();
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Webhooks</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Configure URLs para receber notificações em tempo real, como quando um novo contato é salvo.
            </p>
            <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg mb-6">
                <form onSubmit={handleCreateWebhook} className="flex items-center gap-4">
                    <input
                        type="url"
                        value={newWebhookUrl}
                        onChange={(e) => setNewWebhookUrl(e.target.value)}
                        placeholder="https://seu-servidor.com/webhook"
                        className="flex-grow px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md text-sm"
                        required
                    />
                    <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-700">
                        Adicionar Webhook
                    </button>
                </form>
            </div>

            {isLoading ? <p>Carregando webhooks...</p> : (
            <div className="space-y-3">
                {webhooks.length === 0 && <p className="text-sm text-slate-500">Nenhum webhook configurado.</p>}
                {webhooks.map(webhook => (
                    <div key={webhook.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                        <div>
                            <p className="font-mono text-sm text-slate-800 dark:text-slate-200">{webhook.url}</p>
                            <p className="text-xs text-slate-500 mt-1">Criado em {new Date(webhook.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handleDeleteWebhook(webhook.id)} className="text-sm font-medium text-red-600 hover:text-red-800">
                            Remover
                        </button>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
};