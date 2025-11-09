import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { UploadIcon } from './icons/UploadIcon';
import { CameraIcon } from './icons/CameraIcon';

const ImageAnalyzer: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > 4 * 1024 * 1024) { // 4MB limit
                setError('El tamaño de la imagen debe ser inferior a 4MB.');
                return;
            }
            setError('');
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setResponse(''); // Clear previous response
        }
    };
    
    const handleSubmit = useCallback(async () => {
        if (!imageFile || !prompt || isLoading) return;

        setIsLoading(true);
        setResponse('');
        setError('');

        try {
            const result = await analyzeImage(prompt, imageFile);
            setResponse(result);
        } catch (err) {
            setError('Ocurrió un error durante el análisis. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }, [imageFile, prompt, isLoading]);

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-400 flex items-center justify-center gap-3">
                <CameraIcon />
                Analizador de Fotos y Pantalla
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Left Side: Image Upload and Prompt */}
                <div className="flex flex-col space-y-4">
                    <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                        <input
                            type="file"
                            accept="image/jpeg, image/png, image/webp"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="mx-auto max-h-60 rounded-md object-contain" />
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10">
                                <UploadIcon />
                                <p className="mt-2 text-sm text-gray-400">
                                    <span className="font-semibold text-blue-400">Sube una imagen</span> o arrastra y suelta
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG, WEBP hasta 4MB</p>
                            </div>
                        )}
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Pregunta sobre esta imagen. Por ejemplo: '¿Qué ajuste está resaltado en esta pantalla de menú?' o '¿Cómo puedo mejorar esta composición?'"
                        className="w-full h-32 p-3 bg-gray-700 text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading || !imageFile}
                    />
                    
                    <button
                        onClick={handleSubmit}
                        disabled={!imageFile || !prompt || isLoading}
                        className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? <LoadingSpinner /> : 'Analizar Imagen'}
                    </button>
                </div>
                
                {/* Right Side: Response */}
                <div className="bg-gray-900 p-4 rounded-lg min-h-[20rem] flex items-start">
                    {isLoading && !response && (
                        <div className="w-full text-center p-8">
                             <LoadingSpinner />
                             <p className="mt-2 text-gray-400">Analizando...</p>
                        </div>
                    )}
                    {response && (
                         <div className="prose prose-invert prose-sm max-w-none text-gray-200" style={{whiteSpace: "pre-wrap"}}>{response}</div>
                    )}
                    {!isLoading && !response && (
                        <div className="text-gray-500 text-center w-full p-8">
                            <p>Los resultados del análisis aparecerán aquí.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageAnalyzer;