import React from 'react';
import { Place } from '../types';

interface LeadConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  places: Place[];
}

export const LeadConsentModal: React.FC<LeadConsentModalProps> = ({ isOpen, onClose, onConfirm, places }) => {
  if (!isOpen || places.length === 0) return null;

  const isSingle = places.length === 1;
  const leadName = isSingle ? places[0].name : `${places.length} estabelecimentos`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-900 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-sky-600 dark:text-sky-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-bold text-slate-900 dark:text-white" id="modal-title">
                Confirmação de Consentimento
              </h3>
              <div className="mt-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Você está prestes a salvar as informações de <strong className="font-semibold">{leadName}</strong>.
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Ao confirmar, você declara ter o consentimento explícito para armazenar e utilizar estes dados, em conformidade com a Lei Geral de Proteção de Dados (LGPD) e os termos de serviço da Google.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-3 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sky-600 text-base font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-sky-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onConfirm}
          >
            Confirmar e Salvar
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 dark:border-slate-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-800 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
