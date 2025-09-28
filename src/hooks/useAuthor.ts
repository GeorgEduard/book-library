import { useMemo } from 'react';
import type { Author } from '../../shared/types';
import { useAuthors } from './useAuthors';

function normalize(s: string) {
  return s.trim().toLowerCase();
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
