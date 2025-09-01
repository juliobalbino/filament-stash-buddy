import { api } from '@/lib/axios';
import { Filament, FilamentFormData } from '@/types/filament';

export const FilamentService = {
  getAll: async () => {
    const response = await api.get<{ success: boolean; data: Filament[] }>('/filaments');
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: Filament }>(`/filaments/${id}`);
    return response.data.data;
  },

  create: async (data: FilamentFormData) => {
    const response = await api.post<{ success: boolean; data: Filament }>('/filaments', data);
    return response.data.data;
  },

  update: async (id: string, data: FilamentFormData) => {
    try {
      const response = await api.put<{ success: boolean; data: Filament }>(`/filaments/${id}`, data);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id: string) => {
    await api.delete(`/filaments/${id}`);
  },

  updateQuantity: async (id: string, quantidade: number) => {
    try {
      if (quantidade < 0) {
        throw new Error('A quantidade não pode ser negativa');
      }
      const response = await api.patch<{ success: boolean; data: Filament }>(`/filaments/${id}/quantidade`, { quantidade });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  getStats: async () => {
    const response = await api.get<{ success: boolean; data: { total: number; lowStock: number; outOfStock: number; totalRolls: number } }>('/filaments/stats');
    return response.data.data;
  }
};