import React from 'react';
import { AppMode } from '../types';
import { SonyIcon } from './icons/SonyIcon';
import { ChatIcon } from './icons/ChatIcon';
import { CameraIcon } from './icons/CameraIcon';
import { BrainIcon } from './icons/BrainIcon';

interface HeaderProps {
  activeMode: AppMode;
  setMode: (mode: AppMode) => void;
}

const Header: React.FC<HeaderProps> = ({ activeMode, setMode }) => {
  const navItems = [
    { mode: AppMode.Chat, label: 'Chat con Manual', icon: <ChatIcon /> },
    { mode: AppMode.Image, label: 'Analizador de Imagen', icon: <CameraIcon /> },
    { mode: AppMode.Complex, label: 'Consulta Compleja', icon: <BrainIcon /> },
  ];

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <SonyIcon />
          <h1 className="text-xl font-bold text-white tracking-wider hidden sm:block">Asistente FX2</h1>
        </div>
        <nav className="flex items-center bg-gray-700 rounded-full p-1">
          {navItems.map((item) => (
            <button
              key={item.mode}
              onClick={() => setMode(item.mode)}
              className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
                activeMode === item.mode
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-300 hover:bg-gray-600'
              }`}
              aria-current={activeMode === item.mode ? 'page' : undefined}
            >
              {item.icon}
              <span className="hidden md:inline">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;