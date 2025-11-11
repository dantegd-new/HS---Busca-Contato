import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';

interface HeaderProps {
    activeView: 'search' | 'contatos' | 'integrations' | 'admin';
    setActiveView: (view: 'search' | 'contatos' | 'integrations' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
    const { user, logout } = useAuth();
    
    const NavButton: React.FC<{ view: 'search' | 'contatos' | 'integrations' | 'admin', children: React.ReactNode}> = ({ view, children }) => {
        const isActive = activeView === view;
        return (
            <button
                onClick={() => setActiveView(view)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
            >
                {children}
            </button>
        );
    }

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                       <h1 className="text-xl font-bold text-slate-800 dark:text-white">HS - Busca Contatos</h1>
                    </div>
                    {user && (
                        <div className="flex items-center space-x-2">
                             <nav className="flex space-x-1">
                                <NavButton view="search">Busca</NavButton>
                                <NavButton view="contatos">Meus Contatos</NavButton>
                                <NavButton view="integrations">Integrações</NavButton>
                                {user.role === Role.ADMIN && <NavButton view="admin">Admin</NavButton>}
                            </nav>
                            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>
                             <div className="relative group">
                                <div className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <span className="font-medium text-sm text-slate-700 dark:text-slate-200">{user.name}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        Sair
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
