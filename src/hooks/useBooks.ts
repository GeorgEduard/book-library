import { useMutation, useQuery } from '@tanstack/react-query';
import type { Book } from '../../shared/types';
import { apiRequest, queryClient } from '../lib/queryClient';

export function useBooks() {
  return useQuery<Book[]>({
    queryKey: ['/api/books'],
  });
}

export function useCreateBook() {
  return useMutation({
    mutationFn: async (data: { title: string; author_id?: number | null }) => {
      const response = await apiRequest('POST', '/api/books', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
    },
  });
}

export function useUpdateBook() {
  return useMutation({
    mutationFn: async (args: { id: number; data: { title?: string; author_id?: number | null } }) => {
      const response = await apiRequest('PUT', `/api/books/${args.id}`, args.data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
    },
  });
}

export function useDeleteBook() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/books/${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/books'] });
    },
  });
}
