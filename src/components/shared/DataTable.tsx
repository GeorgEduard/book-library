import React from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Table state for loading/error/empty/ok
export type TableState =
  | { type: 'loading' }
  | { type: 'error'; error?: unknown }
  | { type: 'empty'; message?: string }
  | { type: 'ok' };

// Internal column config used by DataTable consumers
interface Column<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  alignment?: 'left' | 'right' | 'center';
  thClassName?: string;
  tdClassName?: string;
}

// Meta attached to TanStack columnDef for styling
type ColumnMeta = {
  alignment?: 'left' | 'right' | 'center';
  thClassName?: string;
  tdClassName?: string;
};

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  rows: T[];
  state?: TableState;
  loadingText?: string;
  emptyText?: string;
  className?: string;
  tableClassName?: string;
  theadClassName?: string;
  tbodyClassName?: string;
}

export default function DataTable<T extends object>({
  rows,
  columns,
  state,
  loadingText,
  emptyText,
  className,
  tableClassName,
  theadClassName,
  tbodyClassName,
}: DataTableProps<T>) {
  const colCount = columns.length;

  const baseContainer =
    className ?? 'overflow-hidden rounded-xl ring-1 ring-emerald-100';
  const baseTable = tableClassName ?? 'min-w-full divide-y divide-emerald-100';
  const baseThead = theadClassName ?? 'bg-emerald-50';
  const baseTbody = tbodyClassName ?? 'divide-y divide-emerald-100';

  const justifyClass = (align?: 'left' | 'right' | 'center') =>
    align === 'right'
      ? 'text-right'
      : align === 'center'
        ? 'text-center'
        : 'text-left';

  // Build TanStack column defs from our simple columns
  const columnHelper = createColumnHelper<T>();
  const columnDefs = React.useMemo(
    () =>
      columns.map(col =>
        columnHelper.display({
          id: col.key,
          header: () => col.header,
          cell: info => col.cell(info.row.original),
          meta: {
            alignment: col.alignment,
            thClassName: col.thClassName,
            tdClassName: col.tdClassName,
          } satisfies ColumnMeta,
        }),
      ),
    [columns, columnHelper],
  );

  const table = useReactTable<T>({
    data: rows,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  // Determine which state to render: use provided state or derive from rows
  const viewState: TableState = React.useMemo(() => {
    if (state) return state;
    return rows.length === 0 ? { type: 'empty' } : { type: 'ok' };
  }, [state, rows]);

  return (
    <div className={baseContainer}>
      <table className={baseTable}>
        <thead className={baseThead}>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const meta = header.column.columnDef.meta as
                  | ColumnMeta
                  | undefined;
                return (
                  <th
                    key={header.id}
                    className={[
                      'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-600',
                      justifyClass(meta?.alignment),
                      meta?.thClassName ?? '',
                    ]
                      .join(' ')
                      .trim()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className={baseTbody}>
          {viewState.type === 'loading' ? (
            <tr>
              <td className="px-4 py-3 text-sm" colSpan={colCount}>
                {loadingText ?? 'Loading...'}
              </td>
            </tr>
          ) : viewState.type === 'error' ? (
            <tr>
              <td
                className="px-4 py-3 text-sm text-rose-600"
                colSpan={colCount}
              >
                {(viewState.error as Error | undefined)?.message ?? 'Something went wrong'}
              </td>
            </tr>
          ) : viewState.type === 'empty' ? (
            <tr>
              <td className="px-4 py-3 text-sm" colSpan={colCount}>
                {viewState.message ?? emptyText ?? 'No data'}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  const meta = cell.column.columnDef.meta as
                    | ColumnMeta
                    | undefined;
                  return (
                    <td
                      key={cell.id}
                      className={[
                        'px-4 py-3 text-sm',
                        justifyClass(meta?.alignment),
                        meta?.tdClassName ?? '',
                      ]
                        .join(' ')
                        .trim()}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
