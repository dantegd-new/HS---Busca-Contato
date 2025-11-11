import { GoogleGenAI, Type } from '@google/genai';
import type { Place } from '../types';

// Fix: Initialize the GoogleGenAI client.
// The API key must be obtained from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Fix: Define a response schema to ensure the API returns data in the expected format.
const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        place_id: { type: Type.STRING, description: 'Google Maps Place ID' },
        name: { type: Type.STRING, description: 'Nome do estabelecimento' },
        formatted_address: { type: Type.STRING, description: 'Endereço completo' },
        rating: { type: Type.NUMBER, description: 'Avaliação média (0 a 5)' },
        user_ratings_total: { type: Type.INTEGER, description: 'Número total de avaliações' },
        business_status: { type: Type.STRING, description: 'Status do negócio (ex: OPERATIONAL)' },
        website: { type: Type.STRING, description: 'Website do estabelecimento' },
        formatted_phone_number: { type: Type.STRING, description: 'Número de telefone formatado' },
      },
      required: ['place_id', 'name', 'formatted_address', 'rating', 'user_ratings_total', 'business_status']
    },
};

/**
 * Searches for places using the Gemini API.
 * @param segment The business segment (e.g., "padaria").
 * @param location The location to search in (e.g., "São Paulo, SP").
 * @param radius The search radius in kilometers.
 * @param quantity The maximum number of results to return.
 * @returns A promise that resolves to an array of Place objects.
 */
export const searchPlaces = async (segment: string, location: string, radius: string, quantity: string): Promise<Place[]> => {
    // Fix: Create a detailed prompt to guide the model.
    const prompt = `Encontre estabelecimentos comerciais que correspondem à busca por "${segment}" em um raio de ${radius} km perto de "${location}". Forneça uma lista com até ${quantity} resultados. Para cada resultado, inclua os seguintes detalhes: place_id, name, formatted_address, rating, user_ratings_total, business_status, website, e formatted_phone_number. Certifique-se de que os resultados sejam relevantes para a localização especificada.`;

    // Create a timeout promise to prevent infinite loading states.
    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('A busca demorou muito para responder. Tente refinar sua busca ou tente novamente.')), 30000) // 30-second timeout
    );

    try {
        // Race the API call against the timeout.
        const responsePromise = ai.models.generateContent({
            model: 'gemini-2.5-flash', // A good model for fast, text-based tasks.
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.2, // Lower temperature for more factual, deterministic results.
            },
        });

        const response = await Promise.race([responsePromise, timeoutPromise]);

        const jsonText = response.text.trim();
        if (!jsonText) {
            console.warn('Gemini API returned an empty response.');
            return [];
        }

        // Add robust JSON parsing to handle potential malformed responses from the AI.
        try {
            const places: Place[] = JSON.parse(jsonText);
            return places;
        } catch (parseError: any) {
            console.error('Failed to parse JSON response from Gemini:', jsonText);
            throw new Error('A IA retornou uma resposta em um formato inesperado. Não foi possível exibir os resultados.');
        }

    } catch (error: any) {
        console.error('Error in searchPlaces:', error);
        
        // Propagate the specific timeout error message.
        if (error.message.includes('A busca demorou muito')) {
             throw error;
        }
        
        // Handle other potential errors, like invalid API keys.
        const errorMessage = error.message?.includes('API key not valid') 
            ? 'Sua chave de API não é válida. Verifique suas credenciais.'
            : `Falha ao se comunicar com a IA: ${error.message || 'Erro desconhecido'}`;
        throw new Error(errorMessage);
    }
};
