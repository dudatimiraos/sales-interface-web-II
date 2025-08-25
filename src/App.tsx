import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { EventsPage } from './components/EventsPage';
import { ConsumersPage } from './components/ConsumersPage';
import { SalesPage } from './components/SalesPage';
import { Toaster } from './components/ui/sonner';

function App() {
  const [activeTab, setActiveTab] = useState<'events' | 'consumers' | 'sales'>('events');

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'events':
        return <EventsPage />;
      case 'consumers':
        return <ConsumersPage />;
      case 'sales':
        return <SalesPage />;
      default:
        return <EventsPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Sistema de Ingressos
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie eventos, consumidores e vendas de forma simples e eficiente
          </p>
        </div>
      </header>
      
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pb-8">
        {renderCurrentPage()}
      </main>

      <Toaster />
    </div>
  );
}

export default App;
