import React, { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SearchBar } from '../components/SearchBar';
import { ResultsList } from '../components/ResultsList';
import { LeadConsentModal } from '../components/LeadConsentModal';
import { SavedContatos } from '../components/SavedLeads';
import { searchPlaces } from '../services/geminiService';
import { Place, Contato, SearchStatus } from '../types';

interface MainAppProps {
  activeView: 'search' | 'contatos';
  setActiveView: (view: 'search' | 'contatos') => void;
}

const MainApp: React.FC<MainAppProps> = ({ activeView, setActiveView }) => {
  const { savedContatos, saveContatos, removeContato } = useAuth();

  const [searchResults, setSearchResults] = useState<Place[]>([]);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>(SearchStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [placesToSave, setPlacesToSave] = useState<Place[]>([]);

  const handleSearch = useCallback(async (segment: string, location: string, radius: string, quantity: string) => {
    setSearchStatus(SearchStatus.LOADING);
    setError(null);
    try {
      const results = await searchPlaces(segment, location, radius, quantity);
      setSearchResults(results);
      setSearchStatus(SearchStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.');
      setSearchStatus(SearchStatus.ERROR);
    }
  }, []);

  const handleSaveContatosRequest = useCallback((places: Place[]) => {
    const newPlaces = places.filter(place => !savedContatos.some(contato => contato.place_id === place.place_id));
    if (newPlaces.length === 0) {
        alert("Todos os contatos selecionados já foram salvos.");
        return;
    }
    setPlacesToSave(newPlaces);
    setIsModalOpen(true);
  }, [savedContatos]);

  const handleConfirmSaveContato = useCallback(() => {
    if (placesToSave.length > 0) {
      const newContatos: Contato[] = placesToSave.map(place => ({
        ...place,
        consent_timestamp: new Date().toISOString(),
      }));
      saveContatos(newContatos); // Use context function
      setIsModalOpen(false);
      setPlacesToSave([]);
    }
  }, [placesToSave, saveContatos]);
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPlacesToSave([]);
  };

  return (
    <>
      {activeView === 'search' ? (
        <>
          <section id="search" className="mb-8">
            <SearchBar onSearch={handleSearch} isLoading={searchStatus === SearchStatus.LOADING} />
          </section>
          <section id="results">
            <ResultsList
              status={searchStatus}
              results={searchResults}
              error={error}
              onSaveContatos={handleSaveContatosRequest}
            />
          </section>
        </>
      ) : (
        <SavedContatos contatos={savedContatos} onRemoveContato={removeContato} />
      )}
      <LeadConsentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSaveContato}
        places={placesToSave}
      />
    </>
  );
};

export default MainApp;
