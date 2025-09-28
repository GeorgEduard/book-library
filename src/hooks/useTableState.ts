import type { TableState } from '../components/shared/DataTable';

interface UseTableStateArgs {
  showingSearch: boolean;
  isSearching: boolean;
  searchError: unknown;
  isLoading: boolean;
  error: unknown;
  rowsToShow: unknown[];
  emptySearchMessage?: string;
  emptyMessage?: string;
}

export default function useTableState({
  showingSearch,
  isSearching,
  searchError,
  isLoading,
  error,
  rowsToShow,
  emptySearchMessage = 'No matching items',
  emptyMessage = 'No data',
}: UseTableStateArgs): TableState {
  return showingSearch
    ? isSearching
      ? { type: 'loading' }
      : searchError
        ? { type: 'error', error: searchError }
        : rowsToShow.length === 0
          ? { type: 'empty', message: emptySearchMessage }
          : { type: 'ok' }
    : isLoading
      ? { type: 'loading' }
      : error
        ? { type: 'error', error }
        : rowsToShow.length === 0
          ? { type: 'empty', message: emptyMessage }
          : { type: 'ok' };
}
