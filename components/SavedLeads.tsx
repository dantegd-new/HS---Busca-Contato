import React from 'react';
import { Contato } from '../types';

interface SavedContatosProps {
  contatos: Contato[];
  onRemoveContato: (place_id: string) => void;
}

const EmptyContatosState: React.FC = () => (
    <div className="text-center py-16 px-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
        <h3 className="mt-2 text-lg font-medium text-slate-800 dark:text-slate-100">Nenhum contato salvo</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Volte para a busca para encontrar e salvar novos contatos.</p>
    </div>
);


export const SavedContatos: React.FC<SavedContatosProps> = ({ contatos, onRemoveContato }) => {
  const handleExportCSV = () => {
    if (contatos.length === 0) return;

    const headers = [
      'place_id',
      'name',
      'formatted_address',
      'rating',
      'user_ratings_total',
      'business_status',
      'website',
      'formatted_phone_number',
      'consent_timestamp'
    ];
    
    const escapeCsvCell = (cellData: any): string => {
        if (cellData === null || cellData === undefined) {
            return '';
        }
        const cell = String(cellData);
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
            return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
    };

    const csvContent = [
      headers.join(','),
      ...contatos.map(contato => 
        headers.map(header => escapeCsvCell(contato[header as keyof Contato])).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'contatos.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (contatos.length === 0) {
    return <EmptyContatosState />;
  }
  
  return (
    <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Contatos Salvos</h2>
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md shadow-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition flex items-center justify-center gap-2"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
             </svg>
            Exportar para CSV
          </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100 dark:bg-slate-700 dark:text-slate-300">
            <tr>
              <th scope="col" className="px-6 py-3">Nome</th>
              <th scope="col" className="px-6 py-3">Endereço</th>
              <th scope="col" className="px-6 py-3">Telefone</th>
              <th scope="col" className="px-6 py-3">Website</th>
              <th scope="col" className="px-6 py-3">Ação</th>
            </tr>
          </thead>
          <tbody>
            {contatos.map(contato => (
              <tr key={contato.place_id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/50">
                <th scope="row" className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{contato.name}</th>
                <td className="px-6 py-4">{contato.formatted_address}</td>
                <td className="px-6 py-4">{contato.formatted_phone_number || 'N/A'}</td>
                <td className="px-6 py-4">
                  {contato.website ? <a href={contato.website} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline">Visitar</a> : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => onRemoveContato(contato.place_id)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};