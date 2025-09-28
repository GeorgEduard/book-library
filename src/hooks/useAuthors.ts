import { useMutation, useQuery } from '@tanstack/react-query';
import type { Author } from '../../shared/types';
import { apiRequest, queryClient } from '../lib/queryClient';

export function useAuthors() {
  return useQuery<Author[]>({
    queryKey: ['/api/authors'],
  });
}

export function useCreateAuthor() {
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await apiRequest('POST', '/api/authors', { name });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/authors'] });
    },
  });
}

export function useUpdateAuthor() {
  return useMutation({
    mutationFn: async (args: { id: number; data: { name?: string } }) => {
      const res = await apiRequest('PUT', `/api/authors/${args.id}`, args.data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/authors'] });
    },
  });
}

export function useDeleteAuthor() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/authors/${id}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/authors'] });
    },
  });
}
