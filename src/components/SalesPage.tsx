import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { SaleForm } from './SaleForm';
import { DateArray, Sale, Consumer, SaleStatus } from '../types';
import { apiService } from '../services/api';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { formatApiDateTime } from '../utils/dateUtils';

export function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [consumers, setConsumers] = useState<Consumer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [salesData, consumersData] = await Promise.all([
        apiService.getSales(),
        apiService.getConsumers()
      ]);
      setSales(salesData);
      setConsumers(consumersData);
    } catch (error) {
      toast.error('Erro ao carregar vendas');
      console.error('Error loading sales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta venda?')) {
      return;
    }

    try {
      await apiService.deleteSale(id);
      toast.success('Venda excluída com sucesso!');
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir venda');
      console.error('Error deleting sale:', error);
    }
  };

  const handleEdit = (sale: Sale) => {
    setSelectedSale(sale);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedSale(null);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    loadData();
  };

  const getConsumerName = (userId: string): string => {
    const consumer = consumers.find(c => c.id === userId);
    return consumer?.name || 'Não encontrado';
  };

  const getConsumerCPF = (userId: string): string => {
    const consumer = consumers.find(c => c.id === userId);
    if (!consumer) return 'N/A';
    
    const cpf = consumer.cpf;
    if (cpf.includes('.') || cpf.includes('-')) {
      return cpf;
    }
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const getSaleStatusLabel = (status: number): string => {
    const statusLabels = {
      [SaleStatus.PENDENTE]: 'Pendente',
      [SaleStatus.PAGO]: 'Pago',
      [SaleStatus.CANCELADO]: 'Cancelado'
    };
    return statusLabels[status as keyof typeof statusLabels] || 'Desconhecido';
  };

  const getSaleStatusColor = (status: number): string => {
    const statusColors = {
      [SaleStatus.PENDENTE]: 'text-yellow-600 bg-yellow-50',
      [SaleStatus.PAGO]: 'text-green-600 bg-green-50',
      [SaleStatus.CANCELADO]: 'text-red-600 bg-red-50'
    };
    return statusColors[status as keyof typeof statusColors] || 'text-gray-600 bg-gray-50';
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
    loadData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciamento de Vendas</CardTitle>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Venda
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando vendas...</div>
          ) : sales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma venda encontrada. Registre a primeira venda!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Consumidor</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Evento</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Data da Venda</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">
                      {getConsumerName(sale.consumer.id)}
                    </TableCell>
                    <TableCell>{getConsumerCPF(sale.consumer.id)}</TableCell>
                    <TableCell>{sale.event.description}</TableCell>
                    <TableCell>{formatPrice(sale.event.price)}</TableCell>
                    <TableCell>{formatDateTime(sale.saleDate)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSaleStatusColor(sale.saleStatus)}`}>
                        {getSaleStatusLabel(sale.saleStatus)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(sale)}
                          className="gap-1"
                        >
                          <Pencil className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(sale.id)}
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

      <SaleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
        sale={selectedSale}
      />
    </div>
  );
}
