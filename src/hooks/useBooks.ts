import { useMutation, useQuery } from '@tanstack/react-query';
import type { Book } from '../../shared/types';
import { apiRequest, queryClient } from '../lib/queryClient';
import { useMemo } from 'react';
import { normalize } from '../lib/helpers';

export function useBooks() {
  return useQuery<Book[]>({
    queryKey: ['/api/books'],
  });
}

export function useBook(name: string) {
  const term = name ?? '';
  const listQuery = useBooks();

  const data: Book | null = useMemo(() => {
    const qRaw = term.trim();
    if (qRaw.length < 3) return null; // Only search after first 3 letters
    const q = normalize(qRaw);
    const list = listQuery.data ?? [];

    // Priority: exact match > startsWith > includes
    const exact = list.find(b => normalize(b.title) === q);
    if (exact) return exact;

    const starts = list.find(b => normalize(b.title).startsWith(q));
    if (starts) return starts;

    const includes = list.find(b => normalize(b.title).includes(q));
    return includes ?? null;
  }, [listQuery.data, term]);

  const active = term.trim().length >= 3;
  return {
    data,
    isLoading: active ? listQuery.isLoading : false,
    error: active ? listQuery.error : null,
  } as const;
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
    mutationFn: async (args: {
      id: number;
      data: { title?: string; author_id?: number | null };
    }) => {
      const response = await apiRequest(
        'PUT',
        `/api/books/${args.id}`,
        args.data,
      );
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
