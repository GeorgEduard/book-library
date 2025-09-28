import { useMutation, useQuery } from '@tanstack/react-query';
import type { Author } from '../../shared/types';
import { apiRequest, queryClient } from '../lib/queryClient';
import { useMemo } from 'react';
import { normalize } from '../lib/helpers';

export function useAuthors() {
  return useQuery<Author[]>({
    queryKey: ['/api/authors'],
  });
}

export function useAuthor(name: string) {
  const term = name ?? '';
  const listQuery = useAuthors();

  const data: Author | null = useMemo(() => {
    const qRaw = term.trim();
    if (qRaw.length < 3) return null; // Only search after the first 3 letters
    const q = normalize(qRaw);
    const list = listQuery.data ?? [];

    // Priority: exact match > startsWith > includes
    const exact = list.find(a => normalize(a.name) === q);
    if (exact) return exact;

    const starts = list.find(a => normalize(a.name).startsWith(q));
    if (starts) return starts;

    const includes = list.find(a => normalize(a.name).includes(q));
    return includes ?? null;
  }, [listQuery.data, term]);

  const active = term.trim().length >= 3;
  return {
    data,
    isLoading: active ? listQuery.isLoading : false,
    error: active ? listQuery.error : null,
  } as const;
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
