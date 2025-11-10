import React, { useRef, useEffect } from 'react';
import { Place } from '../types';

interface ResultCardProps {
  place: Place;
  onSaveContato: () => void;
  isSelected: boolean;
  onToggleSelection: () => void;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <svg key={`full-${i}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
            {halfStar && (
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /><path d="M10 4.253v11.494l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292c.15-.46.801-.46.951 0z" /></svg>
            )}
            {[...Array(emptyStars)].map((_, i) => (
                <svg key={`empty-${i}`} className="w-4 h-4 text-slate-300 dark:text-slate-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            ))}
        </div>
    );
};

export const ResultCard: React.FC<ResultCardProps> = ({ place, onSaveContato, isSelected, onToggleSelection }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef('');

  useEffect(() => {
    const handleScroll = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        if (rect.top < viewportHeight && rect.bottom > 0) {
          const middleOfViewport = viewportHeight / 2;
          const middleOfCard = rect.top + rect.height / 2;
          const parallaxOffset = (middleOfViewport - middleOfCard) * 0.05;
          
          const newTransform = `translateY(${parallaxOffset.toFixed(2)}px)`;
          if (newTransform !== transformRef.current) {
              transformRef.current = newTransform;
              cardRef.current.style.transform = newTransform;
          }
        }
      }
    };

    let rafId: number;
    const throttledScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`bg-white dark:bg-slate-800 p-5 rounded-xl shadow-lg transition-colors,border-color duration-300 border-2 ${isSelected ? 'border-sky-500' : 'border-transparent'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white pr-2 flex-1">{place.name}</h3>
        <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelection}
            className="h-5 w-5 rounded text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700"
        />
      </div>

      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
        <p className="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <span>{place.formatted_address}</span>
        </p>

        {place.rating > 0 && (
          <div className="flex items-center gap-2">
              <StarRating rating={place.rating} />
              <span className="text-xs text-slate-500">({place.user_ratings_total} avaliações)</span>
          </div>
        )}
        
        {place.formatted_phone_number && (
            <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>{place.formatted_phone_number}</span>
            </p>
        )}

        {place.website && (
            <p className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                <a href={place.website} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:underline truncate">
                    {place.website}
                </a>
            </p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onSaveContato}
          className="w-full px-4 py-2 bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-semibold rounded-lg hover:bg-sky-200 dark:hover:bg-sky-900 transition text-sm"
        >
          Salvar Contato
        </button>
      </div>
    </div>
  );
};