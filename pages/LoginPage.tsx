import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

// This is a global variable from the Google script
// Fix: Update global declaration to correctly type the 'google' object on the Window interface.
declare global {
    interface Window {
        google: any;
    }
}

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login, loginWithGoogle } = useAuth();

    const handleGoogleSignIn = async (response: any) => {
        setIsSubmitting(true);
        setError('');
        try {
            await loginWithGoogle(response.credential);
        } catch (err: any) {
            setError(err.message || 'Falha no login com Google.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    useEffect(() => {
        // Initialize Google Sign-In
        // Fix: Use window.google consistently after declaring it on the Window interface.
        if (window.google) {
            window.google.accounts.id.initialize({
                client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual Client ID
                callback: handleGoogleSignIn
            });
            window.google.accounts.id.renderButton(
                document.getElementById("google-signin-button"),
                { theme: "outline", size: "large", width: "300" } // Customization options
            );
        }
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await login(email, password);
            // On success, the App component will automatically redirect
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Bem-vindo!</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Faça login para encontrar novos contatos.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                     <div className="flex flex-col items-center justify-center mb-6">
                        <div id="google-signin-button"></div>
                         <p className="text-xs text-slate-400 mt-1">Login seguro e rápido.</p>
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                OU
                            </span>
                        </div>
                    </div>
                
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
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-baseline">
                                <label htmlFor="password" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Senha</label>
                                <a href="#" className="text-sm text-sky-600 hover:underline">Esqueceu a senha?</a>
                            </div>
                            {/* Fix: Complete the truncated password input element */}
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Sua senha"
                                className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                                required
                                disabled={isSubmitting}
                            />
                        </div>
                        {/* Fix: Display error messages to the user */}
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                                <p>{error}</p>
                            </div>
                        )}
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center items-center px-4 py-2.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition duration-200"
                            >
                                {isSubmitting ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Fix: Add a default export to resolve the import error in App.tsx.
export default LoginPage;