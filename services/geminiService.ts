import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from "@google/genai";
import { GroundingSource } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const askWithGoogleSearch = async (prompt: string): Promise<{ text: string; sources: GroundingSource[] }> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [{ text: prompt }] },
            config: {
                systemInstruction: "Eres un experto de clase mundial en la cámara Sony FX2. Tu misión es responder a las preguntas de los usuarios con extrema precisión, extrayendo información de sus manuales oficiales y fuentes confiables en línea. Proporciona instrucciones claras, concisas y paso a paso. Al referirte a un botón, dial o elemento del menú de la cámara, especifica su nombre exacto y ubicación (por ejemplo, 'el botón de obturador en la parte superior derecha', 'Menú > Disparo > Calidad de Imagen'). Formatea tus respuestas usando markdown para mayor claridad, especialmente para listas y pasos. Tu respuesta debe abordar directamente la pregunta del usuario sobre la configuración o el uso.",
                tools: [{ googleSearch: {} }],
            },
        });

        const text = response.text;
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
            .map((chunk: GroundingChunk) => ({
                uri: chunk.web?.uri || '',
                title: chunk.web?.title || 'Fuente sin título',
            }))
            .filter(source => source.uri);
        
        return { text, sources };
    } catch (error) {
        console.error("Error calling Gemini API with search:", error);
        return { text: "Lo siento, encontré un error al intentar buscar una respuesta. Por favor, revisa tu conexión o clave de API e inténtalo de nuevo.", sources: [] };
    }
};

export const analyzeImage = async (prompt: string, image: File): Promise<string> => {
    try {
        const imagePart = await fileToGenerativePart(image);
        const textPart = { text: prompt };

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [textPart, imagePart] },
             config: {
                systemInstruction: "Eres un experto en la cámara Sony FX2. Analiza la imagen proporcionada, que podría ser una captura de pantalla de un menú, una foto de un botón o una escena. Basado en la pregunta del usuario, explica qué se muestra y cómo se relaciona con la funcionalidad de la Sony FX2. Proporciona contexto e instrucciones útiles.",
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for image analysis:", error);
        return "Lo siento, no pude analizar la imagen. Por favor, inténtalo de nuevo.";
    }
};


export const askComplexQuestion = async (prompt: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: { parts: [{ text: prompt }] },
            config: {
                systemInstruction: "Eres un director de fotografía experimentado y un experto en la Sony FX2. El usuario tiene una consulta compleja. Proporciona una respuesta completa, detallada y de nivel profesional. Considera todos los aspectos de la solicitud del usuario, incluyendo configuraciones técnicas, opciones creativas y consejos prácticos. Estructura tu respuesta para una máxima claridad.",
                thinkingConfig: { thinkingBudget: 32768 },
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for complex query:", error);
        return "Lo siento, encontré un error al procesar tu solicitud compleja. Por favor, inténtalo de nuevo.";
    }
};