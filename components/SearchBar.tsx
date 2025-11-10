import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (segment: string, location: string, radius: string, quantity: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [segment, setSegment] = useState('padaria');
  const [location, setLocation] = useState('São Paulo, SP');
  const [radius, setRadius] = useState('5'); // Default radius in km
  const [quantity, setQuantity] = useState('25'); // Default quantity

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (segment && location) {
      onSearch(segment, location, radius, quantity);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Encontre Novos Contatos</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-10 gap-4">
            <div className="md:col-span-3">
                <label htmlFor="segment" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Segmento</label>
                <input
                    id="segment"
                    type="text"
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    placeholder="Ex: clínica odontológica, academia"
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    required
                />
            </div>
            <div className="md:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Localidade</label>
                <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: bairro, cidade ou CEP"
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                    required
                />
            </div>
            <div className="md:col-span-1">
                <label htmlFor="radius" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Raio</label>
                <select 
                  id="radius" 
                  value={radius} 
                  onChange={e => setRadius(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                >
                    <option value="1">1 km</option>
                    <option value="5">5 km</option>
                    <option value="10">10 km</option>
                    <option value="25">25 km</option>
                    <option value="50">50 km</option>
                </select>
            </div>
             <div className="md:col-span-1">
                <label htmlFor="quantity" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Qtd.</label>
                <select 
                  id="quantity" 
                  value={quantity} 
                  onChange={e => setQuantity(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition"
                >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                </select>
            </div>
            <div className="md:col-span-2 self-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:bg-sky-400 disabled:cursor-not-allowed transition duration-200"
                >
                    {isLoading ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Buscando...
                        </>
                    ) : 'Buscar'}
                </button>
            </div>
        </form>
    </div>
  );
};