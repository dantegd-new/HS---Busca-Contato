import React, { useState, useEffect } from 'react';
import { ResultCard } from './ResultCard';
import { Place, SearchStatus } from '../types';

interface ResultsListProps {
  status: SearchStatus;
  results: Place[];
  error: string | null;
  onSaveContatos: (places: Place[]) => void;
}

const EmptyState: React.FC = () => (
    <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        <h3 className="mt-2 text-lg font-medium text-slate-800 dark:text-slate-100">Pronto para começar?</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Faça uma busca para encontrar seus primeiros contatos.</p>
    </div>
);

const NoResultsState: React.FC = () => (
    <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
        <h3 className="mt-2 text-lg font-medium text-slate-800 dark:text-slate-100">Nenhum resultado encontrado</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tente ajustar seus termos de busca.</p>
    </div>
);

const LoadingState: React.FC = () => (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-lg animate-pulse">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6 mb-4"></div>
                    <div className="flex justify-between items-center">
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                    </div>
                </div>
            ))}
        </div>
        <div className="text-center mt-8 p-4 bg-sky-100/50 dark:bg-sky-900/50 rounded-lg">
            <p className="text-sm font-medium text-sky-700 dark:text-sky-300">Aguarde um momento... Nossa IA está buscando e processando os melhores resultados. Isso pode levar alguns segundos.</p>
        </div>
    </div>
);

export const ResultsList: React.FC<ResultsListProps> = ({ status, results, error, onSaveContatos }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Clear selection when results change
    setSelectedIds(new Set());
  }, [results]);

  const handleToggleSelection = (place_id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(place_id)) {
        newSet.delete(place_id);
      } else {
        newSet.add(place_id);
      }
      return newSet;
    });
  };

  const handleSaveSelected = () => {
    const selectedPlaces = results.filter(p => selectedIds.has(p.place_id));
    if (selectedPlaces.length > 0) {
      onSaveContatos(selectedPlaces);
    }
  };

  const handleSaveAll = () => {
    onSaveContatos(results);
  };

  if (status === SearchStatus.LOADING) {
    return <LoadingState />;
  }
  
  if (status === SearchStatus.ERROR) {
    return <div className="text-center p-8 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">{error}</div>;
  }
  
  if (status === SearchStatus.IDLE) {
    return <EmptyState />;
  }

  if (status === SearchStatus.SUCCESS && results.length === 0) {
    return <NoResultsState />;
  }

  if (status === SearchStatus.SUCCESS && results.length > 0) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row gap-3 justify-end mb-4">
          <button 
            onClick={handleSaveSelected} 
            disabled={selectedIds.size === 0}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 rounded-md shadow-sm hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Salvar Selecionados ({selectedIds.size})
          </button>
          <button 
            onClick={handleSaveAll}
            className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-md shadow-sm hover:bg-sky-700 transition"
          >
            Salvar Todos ({results.length})
          </button>
        </div>

        <div className="mb-6 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-4">
            <p>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{results.length}</span> contatos encontrados. Exibindo os <span className="font-semibold text-slate-800 dark:text-slate-200">{results.length}</span> resultados solicitados.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((place) => (
            <ResultCard 
              key={place.place_id} 
              place={place} 
              onSaveContato={() => onSaveContatos([place])}
              isSelected={selectedIds.has(place.place_id)}
              onToggleSelection={() => handleToggleSelection(place.place_id)}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
};