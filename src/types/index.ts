export type DateArray = [number, number, number, number, number];
export type ApiDate = string | DateArray;

export const SaleStatus = {
  PENDENTE: 1,
  PAGO: 2,
  CANCELADO: 3
} as const;

export const EventType = {
  SHOW: 1,
  TEATRO: 2,
  PALESTRA: 3,
  WORKSHOP: 4,
  OUTRO: 5
} as const;

// Event interfaces
export interface Event {
  id: string;
  description: string;
  type: number;
  date: ApiDate;
  startSales: ApiDate;
  endSales: ApiDate;
  price: number;
  createdAt: ApiDate;
  updatedAt: ApiDate;
}

export interface CreateEventRequest {
  description: string;
  type: number;
  date: string;
  startSales: string;
  endSales: string;
  price: number;
}

export interface UpdateEventRequest {
  description?: string;
  type?: number;
  date?: string;
  startSales?: string;
  endSales?: string;
  price?: number;
}

// Consumer interfaces
export interface Consumer {
  id: string;
  name: string;
  cpf: string;
  gender: 'M' | 'F' | 'O';
}

export interface CreateConsumerRequest {
  name: string;
  cpf: string;
  gender: 'M' | 'F' | 'O';
}

export interface UpdateConsumerRequest {
  name?: string;
  cpf?: string;
  gender?: 'M' | 'F' | 'O';
}

// Sale interfaces
export interface Sale {
  id: string;
  consumer: Consumer;
  event: Event;
  saleDate: ApiDate;
  saleStatus: number;
  createdAt: ApiDate;
  updatedAt: ApiDate;
}

export interface CreateSaleRequest {
  consumer: {
    id: string;
  };
  event: {
    id: string;
  };
  saleStatus: number;
}

export interface UpdateSaleRequest {
  saleStatus?: number;
}
