import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { EventForm } from './EventForm';
import { DateArray, Event, EventType } from '../types';
import { apiService } from '../services/api';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { formatApiDateTime } from '../utils/dateUtils';

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getEvents();
      setEvents(data);
    } catch (error) {
      toast.error('Erro ao carregar eventos');
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) {
      return;
    }

    try {
      await apiService.deleteEvent(id);
      toast.success('Evento excluído com sucesso!');
      loadEvents();
    } catch (error) {
      toast.error('Erro ao excluir evento');
      console.error('Error deleting event:', error);
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    loadEvents();
  };

  const getEventTypeName = (type: number): string => {
    const typeNames = {
      [EventType.SHOW]: 'Show',
      [EventType.TEATRO]: 'Teatro',
      [EventType.PALESTRA]: 'Palestra',
      [EventType.WORKSHOP]: 'Workshop',
      [EventType.OUTRO]: 'Outro'
    };
    return typeNames[type as keyof typeof typeNames] || 'Desconhecido';
  };

  const formatDateTime = (date: string | DateArray): string => {
    return formatApiDateTime(date as DateArray);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciamento de Eventos</CardTitle>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Evento
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando eventos...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum evento encontrado. Crie seu primeiro evento!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data do Evento</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Início das Vendas</TableHead>
                  <TableHead>Fim das Vendas</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.description}</TableCell>
                    <TableCell>{getEventTypeName(event.type)}</TableCell>
                    <TableCell>{formatDateTime(event.date)}</TableCell>
                    <TableCell>{formatPrice(event.price)}</TableCell>
                    <TableCell>{formatDateTime(event.startSales)}</TableCell>
                    <TableCell>{formatDateTime(event.endSales)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                          className="gap-1"
                        >
                          <Pencil className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          className="gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <EventForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        event={selectedEvent}
      />
    </div>
  );
}
