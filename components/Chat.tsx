import React, { useState, useRef, useEffect } from 'react';
import { askWithGoogleSearch } from '../services/geminiService';
import { ChatMessage, GroundingSource } from '../types';
import { SendIcon } from './icons/SendIcon';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { SonyIcon } from './icons/SonyIcon';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    useEffect(() => {
        setMessages([
            {
                id: 'initial-bot-message',
                sender: 'bot',
                text: "¡Hola! Soy tu asistente experto en la Sony FX2. ¿Cómo puedo ayudarte hoy con la configuración o el uso de tu cámara? Por ejemplo, puedes preguntar '¿Cómo configuro S-Log3?' o '¿Cuál es la mejor manera de configurar las entradas de audio?'.",
            },
        ]);
    }, []);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: input,
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const { text: botResponseText, sources } = await askWithGoogleSearch(input);
        
        const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: botResponseText,
            sources: sources,
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };
    
    const renderMessageContent = (text: string) => {
        return text.split('\n').map((line, index) => (
            <p key={index} className="mb-2 last:mb-0">{line}</p>
        ));
    };

    return (
        <div className="flex flex-col h-full max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-2xl">
            <div className="flex-grow p-6 overflow-y-auto space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'bot' && (
                            <div className="w-8 h-8 flex-shrink-0 bg-blue-600 rounded-full flex items-center justify-center">
                                <SonyIcon className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div className={`max-w-lg p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-700 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                           <div className="prose prose-invert prose-sm max-w-none" style={{whiteSpace: "pre-wrap"}}>{msg.text}</div>
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-4 border-t border-gray-600 pt-3">
                                    <h4 className="text-xs font-semibold text-gray-400 mb-2">Fuentes:</h4>
                                    <ul className="space-y-1">
                                        {msg.sources.map((source, index) => (
                                            <li key={index}>
                                                <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:underline truncate block">
                                                    {source.title}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                     <div className="flex items-start gap-4">
                        <div className="w-8 h-8 flex-shrink-0 bg-blue-600 rounded-full flex items-center justify-center">
                           <SonyIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="max-w-lg p-4 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none flex items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-gray-800 border-t border-gray-700">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Pregunta sobre tu Sony FX2..."
                        className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-full py-3 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 transition-colors"
                        disabled={isLoading}
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;