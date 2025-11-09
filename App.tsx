
import React, { useState } from 'react';
import Header from './components/Header';
import Chat from './components/Chat';
import ImageAnalyzer from './components/ImageAnalyzer';
import ComplexQuery from './components/ComplexQuery';
import { AppMode } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.Chat);

  const renderContent = () => {
    switch (mode) {
      case AppMode.Chat:
        return <Chat />;
      case AppMode.Image:
        return <ImageAnalyzer />;
      case AppMode.Complex:
        return <ComplexQuery />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="flex flex-col h-screen font-sans bg-gray-900 text-gray-100">
      <Header activeMode={mode} setMode={setMode} />
      <main className="flex-grow container mx-auto p-4 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
