import { Button } from "./ui/button";

interface NavigationProps {
  activeTab: 'events' | 'consumers' | 'sales';
  onTabChange: (tab: 'events' | 'consumers' | 'sales') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          <Button
            variant={activeTab === 'events' ? 'default' : 'ghost'}
            onClick={() => onTabChange('events')}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
          >
            Eventos
          </Button>
          <Button
            variant={activeTab === 'consumers' ? 'default' : 'ghost'}
            onClick={() => onTabChange('consumers')}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
          >
            Consumidores
          </Button>
          <Button
            variant={activeTab === 'sales' ? 'default' : 'ghost'}
            onClick={() => onTabChange('sales')}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500"
          >
            Vendas
          </Button>
        </div>
      </div>
    </div>
  );
}
