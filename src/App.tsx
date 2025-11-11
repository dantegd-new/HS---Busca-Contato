import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import MainApp from './pages/MainApp';
import AdminPage from './pages/AdminPage';
import { IntegrationPage } from './pages/IntegrationPage';
import Header from './components/Header';

type View = 'search' | 'contatos' | 'integrations' | 'admin';

const AppContent: React.FC = () => {
    const { user, isLoading } = useAuth();
    const [activeView, setActiveView] = useState<View>('search');

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex justify-center items-center">
                <p className="text-slate-500">Loading application...</p>
            </div>
        );
    }

    if (!user) {
        return <LoginPage />;
    }

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <Header activeView={activeView} setActiveView={setActiveView} />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {activeView === 'search' || activeView === 'contatos' ? (
                    <MainApp activeView={activeView} setActiveView={setActiveView} />
                ) : activeView === 'integrations' ? (
                    <IntegrationPage />
                ) : activeView === 'admin' ? (
                    <AdminPage />
                ) : null}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
