import SectionCard from '../shared/SectionCard';
import type { Book } from '../../../shared/types';
import { useState } from 'react';
import BookFormModal from './BookFormModal';
import ConfirmModal from '../shared/ConfirmModal';
import DataTable, { type TableState } from '../shared/DataTable';
import Button from '../shared/Button';
import { useAuthors } from '../../hooks/useAuthors';
import {
  useCreateBook,
  useUpdateBook,
  useDeleteBook,
} from '../../hooks/useBooks';
import { useBook } from '../../hooks/useBook';
import useTableState from '../../hooks/useTableState';

interface BooksSectionProps {
  books: Book[];
  isLoading: boolean;
  error: unknown;
}
// Modals state and mutations
type ModalState =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; book: Book }
  | { type: 'delete'; book: Book };

export default function BooksSection({
  books,
  isLoading,
  error,
}: BooksSectionProps) {
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<ModalState>({ type: 'none' });

  const {
    data: searchedBook,
    isLoading: isSearching,
    error: searchError,
  } = useBook(query);
  const { data: authors = [] } = useAuthors();
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  const showingSearch = query.trim().length > 0;

  const rowsToShow = showingSearch
    ? searchedBook
      ? [searchedBook]
      : []
    : books;

  const tableState = useTableState({
    showingSearch,
    isSearching,
    searchError,
    isLoading,
    error,
    rowsToShow,
  });

  return (
    <SectionCard title="Books" description="List of books in the club.">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative max-w-sm flex-1">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <Button onClick={() => setModal({ type: 'add' })}>Add Book</Button>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Title', cell: (b: Book) => b.title },
          {
            key: 'author',
            header: 'Author',
            cell: (b: Book) => b.author ?? '—',
          },
          {
            key: 'actions',
            header: 'Actions',
            alignment: 'right',
            cell: (b: Book) => (
              <>
                <Button
                  variant="link"
                  onClick={() => setModal({ type: 'edit', book: b })}
                >
                  Edit
                </Button>
                <span className="px-2 text-zinc-400">|</span>
                <Button
                  variant="linkDanger"
                  onClick={() => setModal({ type: 'delete', book: b })}
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]}
        rows={rowsToShow}
        state={tableState as TableState}
        loadingText={showingSearch ? 'Searching book...' : 'Loading books...'}
      />

      {/* Modals */}
      <BookFormModal
        isOpen={modal.type === 'add'}
        onClose={() => setModal({ type: 'none' })}
        title="Add Book"
        authors={authors}
        onSubmit={async vals => {
          await createBook.mutateAsync(vals);
        }}
        submitText="Create"
      />

      {modal.type === 'edit' && (
        <BookFormModal
          isOpen
          onClose={() => setModal({ type: 'none' })}
          title="Edit Book"
          authors={authors}
          initialValues={{
            title: modal.book.title,
            authorId: modal.book.author_id ?? null,
          }}
          onSubmit={async vals => {
            await updateBook.mutateAsync({ id: modal.book.id, data: vals });
          }}
          submitText="Save"
        />
      )}

      {modal.type === 'delete' && (
        <ConfirmModal
          isOpen
          onCancel={() => setModal({ type: 'none' })}
          onConfirm={async () => {
            await deleteBook.mutateAsync(modal.book.id);
            setModal({ type: 'none' });
          }}
          title="Delete Book"
          message={`Delete book: "${modal.book.title}"?`}
          confirmText="Delete"
        />
      )}
    </SectionCard>
  );
}
