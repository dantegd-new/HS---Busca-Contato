import React from 'react';

const VerificationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4 text-center">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Verifique seu Email</h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
        Enviamos um link de verificação para o seu endereço de email. Por favor, clique no link para ativar sua conta.
      </p>
    </div>
  );
};

export default VerificationPage;
