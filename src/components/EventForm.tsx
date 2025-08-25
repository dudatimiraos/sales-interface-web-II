import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import type { Event, CreateEventRequest } from '../types';
import { apiService } from '../services/api';
import { toast } from 'sonner';
import { formatApiDateForInput } from '../utils/dateUtils';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event?: Event | null;
}

export function EventForm({ isOpen, onClose, onSuccess, event }: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!event;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateEventRequest>({
    defaultValues: {
      description: '',
      type: 1,
      date: '',
      startSales: '',
      endSales: '',
      price: 0
    }
  });

  useEffect(() => {
    if (isEditing && event) {
      reset({
        description: event.description,
        type: event.type,
        date: formatApiDateForInput(event.date),
        startSales: formatApiDateForInput(event.startSales),
        endSales: formatApiDateForInput(event.endSales),
        price: event.price
      });
    } else if (!isEditing) {
      reset({
        description: '',
        type: 1,
        date: '',
        startSales: '',
        endSales: '',
        price: 0
      });
    }
  }, [isEditing, event, reset]);

  const onSubmit = async (data: CreateEventRequest) => {
    setIsLoading(true);
    try {
      const formattedData = {
        ...data,
        date: new Date(data.date).toISOString(),
        startSales: new Date(data.startSales).toISOString(),
        endSales: new Date(data.endSales).toISOString(),
      };

      if (isEditing && event) {
        await apiService.updateEvent(event.id, formattedData);
        toast.success('Evento atualizado com sucesso!');
      } else {
        await apiService.createEvent(formattedData);
        toast.success('Evento criado com sucesso!');
      }

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(isEditing ? 'Erro ao atualizar evento' : 'Erro ao criar evento');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              {...register('description', { required: 'Descrição é obrigatória' })}
              placeholder="Ex: Show da Banda XYZ"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Evento</Label>
            <Select
              value={watch('type')?.toString()}
              onValueChange={(value) => setValue('type', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Show</SelectItem>
                <SelectItem value="2">Teatro</SelectItem>
                <SelectItem value="3">Palestra</SelectItem>
                <SelectItem value="4">Workshop</SelectItem>
                <SelectItem value="5">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data e Hora do Evento</Label>
            <Input
              id="date"
              type="datetime-local"
              {...register('date', { required: 'Data é obrigatória' })}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startSales">Início das Vendas</Label>
              <Input
                id="startSales"
                type="datetime-local"
                {...register('startSales', { required: 'Data de início é obrigatória' })}
              />
              {errors.startSales && (
                <p className="text-sm text-red-500">{errors.startSales.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endSales">Fim das Vendas</Label>
              <Input
                id="endSales"
                type="datetime-local"
                {...register('endSales', { required: 'Data de fim é obrigatória' })}
              />
              {errors.endSales && (
                <p className="text-sm text-red-500">{errors.endSales.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              {...register('price', { 
                required: 'Preço é obrigatório',
                min: { value: 0, message: 'Preço deve ser maior que zero' }
              })}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
