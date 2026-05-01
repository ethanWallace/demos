import { EventEmitter } from '../../stencil-public-runtime';
import { TableColumn, GcdsTableStateChange } from './utils/table-helpers';
export declare class GcdsTable {
    el: HTMLGcdsTableElement;
    private shadowElement;
    private sortRadios;
    private filterInput;
    private filterSortModal;
    /** Column definitions */
    columns: string | TableColumn[];
    /** Row data */
    data: string | object[];
    /** Enable global column sorting (can be overridden per column) */
    sort: boolean;
    /** Enable pagination */
    pagination: boolean;
    /** Current page index */
    paginationCurrentPage: number;
    /** Number of rows per page */
    paginationSize: number;
    /**
     * Available page-size options.
     * Use 0 to represent "All rows".
     */
    paginationSizeOptions: string | number[];
    /** Enable global filter */
    filter: boolean;
    /** Current filter string */
    filterValue: string;
    private sorting;
    private columnFilters;
    private globalFilter;
    private paginationState;
    lang: string;
    gcdsTableStateChange: EventEmitter<GcdsTableStateChange>;
    private table;
    private lastEmittedRowIds;
    private initialFilter;
    private initialSorting;
    onColumnsChange(newVal: string | TableColumn[]): void;
    onDataChange(newVal: string | object[]): void;
    onsortChange(): void;
    onPaginationChange(): void;
    onPageChange(newPage: number): void;
    onPageSizeChange(newSize: number): void;
    onFilterValueChange(newVal: string): void;
    onLangChange(newVal: string): void;
    private initTable;
    private emitStateChangeIfDirty;
    private sortEnabled;
    private getTemplate;
    private applyBindings;
    private applyListeners;
    private cloneAndInject;
    private mountSlottedCell;
    private handleSortToggle;
    private handlePageSizeSelect;
    private handlePaginationClick;
    getVisibleRows(): Promise<{
        rowId: string;
        rowIndex: number;
        original: Record<string, unknown>;
    }[]>;
    componentWillLoad(): void;
    componentDidRender(): void;
    render(): any;
}
