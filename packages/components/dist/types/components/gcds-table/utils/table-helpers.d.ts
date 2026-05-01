import { type SortingState, type ColumnDef } from '@tanstack/table-core';
/** Table column definition
 * @interface TableColumn
 * @property {string} field - The key of the data object to display in GcdsTable column.
 * @property {string} header - The text to display in the column header.
 * @property {'asc' | 'desc'} [sortDirection] - The current sort direction of the column on load.
 * @property {'start' | 'center' | 'end'} [alignment] - The alignment of the cell content.
 * @property {boolean} [sort] - Whether the column is sortable.
 * @property {(value: unknown, row: Record<string, unknown>) => any} [renderCell] - A function to customize cell rendering.
 * @property {boolean} [rowHeader] - Whether GcdsTable column should be treated as a row header (for accessibility).
 */
interface TableColumn {
    field: string;
    header: string;
    sortDirection?: 'asc' | 'desc';
    alignment?: 'start' | 'center' | 'end';
    sort?: boolean;
    rowHeader?: boolean;
    slotted?: boolean;
    managed?: boolean;
}
export interface GcdsTableStateChange {
    visibleRows: Array<{
        rowId: string;
        rowIndex: number;
        original: unknown;
    }>;
    page: number;
    pageSize: number;
    filterValue: string;
    sortKey: string | null;
    sortDirection: 'asc' | 'desc' | false;
}
declare const buildInitialSorting: (columns: TableColumn[] | undefined) => SortingState;
declare const buildColumnDefs: (columns: TableColumn[] | undefined, sort: boolean) => ColumnDef<Record<string, unknown>>[];
declare const buildTableOptions: (GcdsTable: any) => {
    data: Record<string, unknown>[];
    columns: ColumnDef<Record<string, unknown>>[];
    state: {
        sorting: any;
        columnFilters: any;
        globalFilter: any;
        pagination: any;
        columnPinning: {};
    };
    onStateChange: () => void;
    renderFallbackValue: any;
    enableSorting: any;
    sortDescFirst: boolean;
    manualSorting: boolean;
    onSortingChange: (updater: (arg0: any) => any) => void;
    enableFilters: any;
    onGlobalFilterChange: (updater: (arg0: any) => any) => void;
    manualPagination: boolean;
    onPaginationChange: (updater: (arg0: any) => any) => void;
    getCoreRowModel: (table: import("@tanstack/table-core").Table<unknown>) => () => import("@tanstack/table-core").RowModel<unknown>;
    getSortedRowModel: (table: import("@tanstack/table-core").Table<unknown>) => () => import("@tanstack/table-core").RowModel<unknown>;
    getPaginationRowModel: (table: import("@tanstack/table-core").Table<unknown>) => () => import("@tanstack/table-core").RowModel<unknown>;
    getFilteredRowModel: (table: import("@tanstack/table-core").Table<unknown>) => () => import("@tanstack/table-core").RowModel<unknown>;
    autoResetPageIndex: boolean;
};
declare const updateTableOptions: (GcdsTable: any) => void;
export { TableColumn, buildInitialSorting, buildColumnDefs, buildTableOptions, updateTableOptions, };
