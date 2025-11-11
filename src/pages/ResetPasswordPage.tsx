import React from 'react';

const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Redefinir Senha</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Insira seu email para receber um link de redefinição.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="voce@exemplo.com"
                            className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                            required
                        />
                    </div>
                     <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center px-4 py-2.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition duration-200"
                        >
                            Enviar Link
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default ResetPasswordPage;
