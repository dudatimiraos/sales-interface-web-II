import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Sale, CreateSaleRequest, Event, Consumer, SaleStatus } from '../types';
import { apiService } from '../services/api';
import { toast } from 'sonner';
import { formatApiDateTime } from '../utils/dateUtils';

interface SaleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  sale?: Sale | null;
}

export function SaleForm({ isOpen, onClose, onSuccess, sale }: SaleFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const isEditing = !!sale;

  const {
    handleSubmit,
    setValue,
    watch,
    reset
  } = useForm<CreateSaleRequest>({
    defaultValues: {
      consumer: { id: ''},
      event: { id: '' },
      saleStatus: SaleStatus.PENDENTE
    }
  });

  useEffect(() => {
    if (isEditing && sale) {
      reset({
        consumer: { id: sale.consumer.id },
        event: { id: sale.event.id },
        saleStatus: sale.saleStatus
      });
    } else if (!isEditing) {
      reset({
        consumer: { id: ''},
        event: { id: '' },
        saleStatus: SaleStatus.PENDENTE
      });
    }
  }, [isEditing, sale, reset]);

  const loadFormData = async () => {
    try {
      setLoadingData(true);
      const [eventsData, consumersData] = await Promise.all([
        apiService.getEvents(),
        apiService.getConsumers()
      ]);
      setEvents(eventsData);
      setConsumers(consumersData);
    } catch (error) {
      toast.error('Erro ao carregar dados do formulário');
      console.error('Error loading form data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const onSubmit = async (data: CreateSaleRequest) => {
    setIsLoading(true);
    try {
      if (isEditing && sale) {
        await apiService.updateSale(sale.id, { saleStatus: data.saleStatus });
        toast.success('Venda atualizada com sucesso!');
      } else {
        await apiService.createSale(data);
        toast.success('Venda criada com sucesso!');
      }

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(isEditing ? 'Erro ao atualizar venda' : 'Erro ao criar venda');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const getSaleStatusLabel = (status: number): string => {
    const statusLabels = {
      [SaleStatus.PENDENTE]: 'Pendente',
      [SaleStatus.PAGO]: 'Pago',
      [SaleStatus.CANCELADO]: 'Cancelado'
    };
    return statusLabels[status as keyof typeof statusLabels] || 'Desconhecido';
  };

  const formatCPF = (cpf: string): string => {
    if (cpf.includes('.') || cpf.includes('-')) {
      return cpf;
    }
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  useEffect(() => {
    if (isOpen) {
      loadFormData();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Venda' : 'Nova Venda'}
          </DialogTitle>
        </DialogHeader>

        {loadingData ? (
          <div className="text-center py-8">Carregando dados...</div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isEditing && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="consumer.id">Consumidor</Label>
                  <Select
                    value={watch('consumer.id')}
                    onValueChange={(value) => setValue('consumer.id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o consumidor" />
                    </SelectTrigger>
                    <SelectContent>
                      {consumers.map((consumer) => (
                        <SelectItem key={consumer.id} value={consumer.id}>
                          {consumer.name} - {formatCPF(consumer.cpf)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!watch('consumer.id') && (
                    <p className="text-sm text-red-500">Consumidor é obrigatório</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventId">Evento</Label>
                  <Select
                    value={watch('event.id')}
                    onValueChange={(value) => setValue('event.id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.description} - {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(event.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!watch('event.id') && (
                    <p className="text-sm text-red-500">Evento é obrigatório</p>
                  )}
                </div>
              </>
            )}

            {isEditing && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Consumidor</Label>
                  <p className="text-sm">{consumers.find(c => c.id === sale?.consumer.id)?.name || 'Não encontrado'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Evento</Label>
                  <p className="text-sm">{sale?.event.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Data da Venda</Label>
                  <p className="text-sm">{sale?.saleDate ? formatApiDateTime(sale.saleDate) : 'N/A'}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="saleStatus">Status da Venda</Label>
              <Select
                value={watch('saleStatus')?.toString()}
                onValueChange={(value) => setValue('saleStatus', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SaleStatus.PENDENTE.toString()}>
                    {getSaleStatusLabel(SaleStatus.PENDENTE)}
                  </SelectItem>
                  <SelectItem value={SaleStatus.PAGO.toString()}>
                    {getSaleStatusLabel(SaleStatus.PAGO)}
                  </SelectItem>
                  <SelectItem value={SaleStatus.CANCELADO.toString()}>
                    {getSaleStatusLabel(SaleStatus.CANCELADO)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || (!isEditing && (!watch('consumer.id') || !watch('event.id')))}
              >
                {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
