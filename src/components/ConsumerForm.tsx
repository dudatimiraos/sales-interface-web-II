import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import type { Consumer, CreateConsumerRequest } from '../types';
import { apiService } from '../services/api';
import { toast } from 'sonner';

interface ConsumerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  consumer?: Consumer | null;
}

export function ConsumerForm({ isOpen, onClose, onSuccess, consumer }: ConsumerFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!consumer;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateConsumerRequest>({
    defaultValues: {
      name: '',
      cpf: '',
      gender: 'M'
    }
  });

  useEffect(() => {
    if (isEditing && consumer) {
      reset({
        name: consumer.name,
        cpf: consumer.cpf,
        gender: consumer.gender
      });
    } else if (!isEditing) {
      reset({
        name: '',
        cpf: '',
        gender: 'M'
      });
    }
  }, [isEditing, consumer, reset]);

  const formatCPF = (value: string): string => {
    const onlyDigits = value.replace(/\D/g, '');
    
    if (onlyDigits.length <= 11) {
      return onlyDigits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    return onlyDigits.slice(0, 11)
      .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setValue('cpf', formatted);
  };



  const onSubmit = async (data: CreateConsumerRequest) => {
    setIsLoading(true);
    try {
      const formattedData = {
        ...data,
        cpf: data.cpf.replace(/\D/g, '')
      };

      if (isEditing && consumer) {
        await apiService.updateConsumer(consumer.id, formattedData);
        toast.success('Consumidor atualizado com sucesso!');
      } else {
        await apiService.createConsumer(formattedData);
        toast.success('Consumidor criado com sucesso!');
      }

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(isEditing ? 'Erro ao atualizar consumidor' : 'Erro ao criar consumidor');
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
            {isEditing ? 'Editar Consumidor' : 'Novo Consumidor'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              {...register('name', { 
                required: 'Nome é obrigatório',
                minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
              })}
              placeholder="Ex: João Silva"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              {...register('cpf', { 
                required: 'CPF é obrigatório'
              })}
              placeholder="000.000.000-00"
              maxLength={14}
              onChange={handleCPFChange}
            />
            {errors.cpf && (
              <p className="text-sm text-red-500">{errors.cpf.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gênero</Label>
            <Select
              value={watch('gender')}
              onValueChange={(value: 'M' | 'F' | 'O') => setValue('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
                <SelectItem value="O">Outro</SelectItem>
              </SelectContent>
            </Select>
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
