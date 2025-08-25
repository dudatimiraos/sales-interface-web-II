import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ConsumerForm } from './ConsumerForm';
import type { Consumer } from '../types';
import { apiService } from '../services/api';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

export function ConsumersPage() {
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(null);

  const loadConsumers = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getConsumers();
      setConsumers(data);
    } catch (error) {
      toast.error('Erro ao carregar consumidores');
      console.error('Error loading consumers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este consumidor?')) {
      return;
    }

    try {
      await apiService.deleteConsumer(id);
      toast.success('Consumidor excluído com sucesso!');
      loadConsumers();
    } catch (error) {
      toast.error('Erro ao excluir consumidor');
      console.error('Error deleting consumer:', error);
    }
  };

  const handleEdit = (consumer: Consumer) => {
    setSelectedConsumer(consumer);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedConsumer(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    loadConsumers();
  };

  const formatCPF = (cpf: string): string => {
    if (cpf.includes('.') || cpf.includes('-')) {
      return cpf;
    }
    
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const getGenderLabel = (gender: string): string => {
    const genderLabels = {
      'M': 'Masculino',
      'F': 'Feminino',
      'O': 'Outro'
    };
    return genderLabels[gender as keyof typeof genderLabels] || 'Não informado';
  };

  useEffect(() => {
    loadConsumers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciamento de Consumidores</CardTitle>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Consumidor
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando consumidores...</div>
          ) : consumers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum consumidor encontrado. Cadastre o primeiro consumidor!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Gênero</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consumers.map((consumer) => (
                  <TableRow key={consumer.id}>
                    <TableCell className="font-medium">{consumer.name}</TableCell>
                    <TableCell>{formatCPF(consumer.cpf)}</TableCell>
                    <TableCell>{getGenderLabel(consumer.gender)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(consumer)}
                          className="gap-1"
                        >
                          <Pencil className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(consumer.id)}
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

      <ConsumerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        consumer={selectedConsumer}
      />
    </div>
  );
}
