import SectionCard from '../shared/SectionCard';
import type { Author } from '../../../shared/types';
import { useState } from 'react';
import { useAuthor } from '../../hooks/useAuthors';
import AuthorFormModal from './AuthorFormModal';
import ConfirmModal from '../shared/ConfirmModal';
import DataTable, { type TableState } from '../shared/DataTable';
import Button from '../shared/Button';
import {
  useCreateAuthor,
  useUpdateAuthor,
  useDeleteAuthor,
  useAuthors,
} from '../../hooks/useAuthors';
import { useBooks } from '../../hooks/useBooks';
import useTableState from '../../hooks/useTableState';

// Modals state and mutations
type ModalState =
  | { type: 'none' }
  | { type: 'add' }
  | { type: 'edit'; author: Author }
  | { type: 'delete'; author: Author };

export default function AuthorsSection() {
  const [modal, setModal] = useState<ModalState>({ type: 'none' });
  const [query, setQuery] = useState('');

  const { data: authors = [], isLoading, error } = useAuthors();
  const createAuthor = useCreateAuthor();
  const updateAuthor = useUpdateAuthor();
  const deleteAuthor = useDeleteAuthor();
  const {
    data: searchedAuthor,
    isLoading: isSearching,
    error: searchError,
  } = useAuthor(query);

  const showingSearch = query.trim().length > 0;

  const rowsToShow = showingSearch
    ? searchedAuthor
      ? [searchedAuthor]
      : []
    : authors;

  const { data: books = [] } = useBooks();

  const tableState = useTableState({
    showingSearch,
    isSearching,
    searchError,
    isLoading,
    error,
    rowsToShow,
  });

  return (
    <SectionCard title="Authors" description="Manage authors of the book club.">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative max-w-sm flex-1">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by author name"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>
        <Button onClick={() => setModal({ type: 'add' })}>Add Author</Button>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Name', cell: (a: Author) => a.name },
          {
            key: 'actions',
            header: 'Actions',
            alignment: 'right',
            cell: (a: Author) => (
              <>
                <Button
                  variant="link"
                  onClick={() => setModal({ type: 'edit', author: a })}
                >
                  Edit
                </Button>
                <span className="px-2 text-zinc-400">|</span>
                <Button
                  variant="linkDanger"
                  onClick={() => setModal({ type: 'delete', author: a })}
                >
                  Delete
                </Button>
              </>
            ),
          },
        ]}
        rows={rowsToShow}
        state={tableState as TableState}
        loadingText={
          showingSearch ? 'Searching author...' : 'Loading authors...'
        }
      />

      {/* Modals */}
      <AuthorFormModal
        isOpen={modal.type === 'add'}
        onClose={() => setModal({ type: 'none' })}
        title="Add Author"
        onSubmit={async ({ name }) => {
          await createAuthor.mutateAsync(name);
        }}
        submitText="Create"
      />

      {modal.type === 'edit' && (
        <AuthorFormModal
          isOpen
          onClose={() => setModal({ type: 'none' })}
          title="Edit Author"
          initialValues={{ name: modal.author.name }}
          onSubmit={async ({ name }) => {
            await updateAuthor.mutateAsync({
              id: modal.author.id,
              data: { name },
            });
          }}
          submitText="Save"
        />
      )}

      {modal.type === 'delete' &&
        (() => {
          const assignedBooksCount = books.filter(
            b => b.author_id === modal.author.id,
          ).length;
          const hasBooks = assignedBooksCount > 0;
          console.log(hasBooks);
          const message = hasBooks
            ? `Cannot delete author: "${modal.author.name}". This author has ${assignedBooksCount} book(s) assigned. Please delete those book(s) first, then delete the author.`
            : `Delete author: "${modal.author.name}"?`;
          return (
            <ConfirmModal
              isOpen
              onCancel={() => setModal({ type: 'none' })}
              onConfirm={async () => {
                await deleteAuthor.mutateAsync(modal.author.id);
                setModal({ type: 'none' });
              }}
              title="Delete Author"
              message={message}
              confirmText="Delete"
              confirmDisabled={hasBooks}
            />
          );
        })()}
    </SectionCard>
  );
}
