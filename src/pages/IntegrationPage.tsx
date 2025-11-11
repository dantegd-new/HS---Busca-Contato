

import React, { useState } from 'react';
import { ApiKeysManager } from '../components/ApiKeysManager';
import { WebhooksManager } from '../components/WebhooksManager';
import { IntegrationDocs } from '../components/IntegrationDocs';

type Tab = 'keys' | 'webhooks' | 'docs';

export const IntegrationPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('keys');

    const TabButton: React.FC<{ tab: Tab; label: string }> = ({ tab, label }) => (
        <button 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 ${
                activeTab === tab 
                ? 'border-sky-500 text-sky-600 dark:text-sky-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Integrações e API</h1>
             <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-lg">
                <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
                    <TabButton tab="keys" label="Chaves de API" />
                    <TabButton tab="webhooks" label="Webhooks" />
                    <TabButton tab="docs" label="Documentação" />
                </div>
                <div>
                    {activeTab === 'keys' && <ApiKeysManager />}
                    {activeTab === 'webhooks' && <WebhooksManager />}
                    {activeTab === 'docs' && <IntegrationDocs />}
                </div>
            </div>
        </div>
    );
};

export default IntegrationPage;
