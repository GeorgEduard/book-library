import { useMemo } from 'react';
import type { Book } from '../../shared/types';
import { useBooks } from './useBooks';

function normalize(s: string) {
  return s.trim().toLowerCase();
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
