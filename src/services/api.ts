import type { 
  Event, 
  CreateEventRequest, 
  UpdateEventRequest,
  Consumer,
  CreateConsumerRequest,
  UpdateConsumerRequest,
  Sale,
  CreateSaleRequest,
  UpdateSaleRequest
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Events API
  async getEvents(): Promise<Event[]> {
    return this.request<Event[]>('/events');
  }

  async getEvent(id: string): Promise<Event> {
    return this.request<Event>(`/events/${id}`);
  }

  async createEvent(data: CreateEventRequest): Promise<Event> {
    return this.request<Event>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEvent(id: string, data: UpdateEventRequest): Promise<Event> {
    return this.request<Event>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEvent(id: string): Promise<void> {
    return this.request<void>(`/events/${id}`, {
      method: 'DELETE',
    });
  }

  // Consumers API
  async getConsumers(): Promise<Consumer[]> {
    return this.request<Consumer[]>('/consumers');
  }

  async getConsumer(id: string): Promise<Consumer> {
    return this.request<Consumer>(`/consumers/${id}`);
  }

  async createConsumer(data: CreateConsumerRequest): Promise<Consumer> {
    return this.request<Consumer>('/consumers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateConsumer(id: string, data: UpdateConsumerRequest): Promise<Consumer> {
    return this.request<Consumer>(`/consumers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteConsumer(id: string): Promise<void> {
    return this.request<void>(`/consumers/${id}`, {
      method: 'DELETE',
    });
  }

  // Sales API
  async getSales(): Promise<Sale[]> {
    return this.request<Sale[]>('/sales');
  }

  async getSale(id: string): Promise<Sale> {
    return this.request<Sale>(`/sales/${id}`);
  }

  async createSale(data: CreateSaleRequest): Promise<Sale> {
    return this.request<Sale>('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSale(id: string, data: UpdateSaleRequest): Promise<Sale> {
    return this.request<Sale>(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSale(id: string): Promise<void> {
    return this.request<void>(`/sales/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
