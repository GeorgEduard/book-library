import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DataTable, { type TableState } from '../DataTable';

interface Row { id: number; name: string }

const columns = [
  { key: 'name', header: 'Name', cell: (r: Row) => r.name },
  { key: 'actions', header: 'Actions', alignment: 'right', cell: () => 'Edit' },
];

describe('DataTable', () => {
  it('renders loading state', () => {
    render(<DataTable<Row> columns={columns} rows={[]} state={{ type: 'loading' }} loadingText="Loading items..." />);
    expect(screen.getByText('Loading items...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const err: TableState = { type: 'error', error: new Error('fail') };
    render(<DataTable<Row> columns={columns} rows={[]} state={err} />);
    expect(screen.getByText('fail')).toBeInTheDocument();
  });

  it('renders empty state by default when no rows', () => {
    render(<DataTable<Row> columns={columns} rows={[]} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders headers and rows', () => {
    render(<DataTable<Row> columns={columns} rows={[{ id: 1, name: 'Alice' }]} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});
