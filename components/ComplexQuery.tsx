import React, { useState, useCallback } from 'react';
import { askComplexQuestion } from '../services/geminiService';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { BrainIcon } from './icons/BrainIcon';

const ComplexQuery: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = useCallback(async () => {
        if (!prompt || isLoading) return;

        setIsLoading(true);
        setResponse('');
        setError('');

        try {
            const result = await askComplexQuestion(prompt);
            setResponse(result);
        } catch (err) {
            setError('Ocurrió un error al procesar tu consulta. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }, [prompt, isLoading]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-blue-400 flex items-center justify-center gap-3">
                    <BrainIcon />
                    Modo de Pensamiento Pro
                </h2>
                <p className="text-sm text-gray-400 mt-2">Para tus preguntas más complejas. Pide configuraciones completas de escenas, consejos de flujo de trabajo o comparaciones creativas.</p>
            </div>

            <div className="space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe un escenario complejo... por ejemplo, 'Diseña una configuración y flujo de trabajo completos para la Sony FX2 para una filmación de documental por una sola persona en un entorno remoto y con poca luz. Incluye opciones de lentes, configuración de audio, soluciones de energía y recomendaciones de perfiles de imagen.'"
                    className="w-full h-48 p-3 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                
                <button
                    onClick={handleSubmit}
                    disabled={!prompt || isLoading}
                    className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <LoadingSpinner /> : 'Enviar Consulta Compleja'}
                </button>
            </div>
            
            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
            
            <div className="mt-6 bg-gray-900 p-6 rounded-lg min-h-[20rem]">
                 <h3 className="text-lg font-semibold text-gray-300 mb-4">Respuesta del Experto</h3>
                 {isLoading && !response && (
                    <div className="w-full text-center p-8">
                         <LoadingSpinner />
                         <p className="mt-2 text-gray-400">Pensando... esto puede tardar un momento.</p>
                    </div>
                )}
                {response && (
                     <div className="prose prose-invert prose-sm max-w-none text-gray-200" style={{whiteSpace: "pre-wrap"}}>{response}</div>
                )}
                {!isLoading && !response && (
                    <div className="text-gray-500 text-center w-full p-8">
                        <p>Tu respuesta detallada aparecerá aquí.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplexQuery;