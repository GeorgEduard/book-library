import { describe, it, expect } from 'vitest';
import useTableState from '../useTableState';

describe('useTableState', () => {
  it('returns loading during initial list load', () => {
    const s = useTableState({
      showingSearch: false,
      isSearching: false,
      searchError: undefined,
      isLoading: true,
      error: undefined,
      rowsToShow: [],
    });
    expect(s).toEqual({ type: 'loading' });
  });

  it('returns error when list load has error', () => {
    const err = new Error('boom');
    const s = useTableState({
      showingSearch: false,
      isSearching: false,
      searchError: undefined,
      isLoading: false,
      error: err,
      rowsToShow: [],
    });
    expect(s).toEqual({ type: 'error', error: err });
  });

  it('returns empty with custom message for search with no results', () => {
    const s = useTableState({
      showingSearch: true,
      isSearching: false,
      searchError: undefined,
      isLoading: false,
      error: undefined,
      rowsToShow: [],
      emptySearchMessage: 'No matching items',
    });
    expect(s).toEqual({ type: 'empty', message: 'No matching items' });
  });

  it('returns ok when rows available', () => {
    const s = useTableState({
      showingSearch: false,
      isSearching: false,
      searchError: undefined,
      isLoading: false,
      error: undefined,
      rowsToShow: [{}],
    });
    expect(s).toEqual({ type: 'ok' });
  });
});
