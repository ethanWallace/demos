import { Host, h, } from "@stencil/core";
import { createTable, } from "@tanstack/table-core";
import { assignLanguage } from "../../utils/utils";
import I18N from "./i18n/i18n";
import { buildInitialSorting, buildTableOptions, updateTableOptions, } from "./utils/table-helpers";
import { getSortIcon, getSortTitle, renderTableStatus, renderFilterSortModal, renderFilterPills, renderSortPills, } from "./utils/render-helpers";
export class GcdsTable {
    constructor() {
        // ─── Props ────────────────────────────────────────────────────────────────
        /** Column definitions */
        this.columns = [];
        /** Row data */
        this.data = [];
        /** Enable global column sorting (can be overridden per column) */
        this.sort = false;
        /** Enable pagination */
        this.pagination = false;
        /** Current page index */
        this.paginationCurrentPage = 1;
        /** Number of rows per page */
        this.paginationSize = 10;
        /**
         * Available page-size options.
         * Use 0 to represent "All rows".
         */
        this.paginationSizeOptions = [
            10, 25, 50, 0,
        ];
        /** Enable global filter */
        this.filter = false;
        /** Current filter string */
        this.filterValue = '';
        // ─── Internal state ───────────────────────────────────────────────────────
        this.sorting = [];
        // @ts-ignore - this is used in building table options
        this.columnFilters = [];
        this.globalFilter = this.filterValue;
        this.paginationState = {
            pageIndex: Math.max(0, this.paginationCurrentPage - 1),
            pageSize: this.paginationSize === 0 ? Number.MAX_SAFE_INTEGER : this.paginationSize,
        };
        // TanStack table instance (not reactive – mutations trigger re-renders via @State)
        this.table = null;
        this.lastEmittedRowIds = '';
        // Store initial values to determine if they have been changed by the user
        // @ts-ignore - these are used in event handlers to reset filter/sort state
        this.initialFilter = this.filterValue;
        // @ts-ignore - these are used in event handlers to reset filter/sort state
        this.initialSorting = [];
    }
    // ─── Watchers ─────────────────────────────────────────────────────────────
    onColumnsChange(newVal) {
        if (typeof newVal === 'string') {
            try {
                this.columns = JSON.parse(newVal);
            }
            catch (e) {
                console.error('[gcds-table] Invalid JSON in column-data:', e);
            }
        }
        updateTableOptions(this);
    }
    onDataChange(newVal) {
        if (typeof newVal === 'string') {
            try {
                this.data = JSON.parse(newVal);
            }
            catch (e) {
                console.error('[gcds-table] Invalid JSON in column-data:', e);
            }
        }
        updateTableOptions(this);
    }
    onsortChange() {
        this.onDataChange(this.data);
    }
    onPaginationChange() {
        this.onDataChange(this.data);
    }
    onPageChange(newPage) {
        var _a;
        this.paginationState = Object.assign(Object.assign({}, this.paginationState), { pageIndex: Math.max(0, newPage - 1) });
        (_a = this.table) === null || _a === void 0 ? void 0 : _a.setOptions(prev => (Object.assign(Object.assign({}, prev), { state: Object.assign(Object.assign({}, prev.state), { pagination: this.paginationState }) })));
    }
    onPageSizeChange(newSize) {
        var _a, _b, _c, _d;
        const totalRows = (_c = (_b = (_a = this.table) === null || _a === void 0 ? void 0 : _a.getPreFilteredRowModel()) === null || _b === void 0 ? void 0 : _b.rows.length) !== null && _c !== void 0 ? _c : 0;
        if (newSize === 0) {
            this.paginationState = {
                pageIndex: 0,
                pageSize: totalRows === 0 ? 1 : totalRows,
            };
        }
        else {
            this.paginationState = {
                pageIndex: this.paginationState.pageIndex + 1 >
                    Math.ceil(totalRows / newSize)
                    ? 0
                    : this.paginationState.pageIndex,
                pageSize: newSize === 0 ? totalRows : newSize,
            };
        }
        (_d = this.table) === null || _d === void 0 ? void 0 : _d.setOptions(prev => (Object.assign(Object.assign({}, prev), { state: Object.assign(Object.assign({}, prev.state), { pagination: this.paginationState }) })));
    }
    onFilterValueChange(newVal) {
        var _a;
        this.globalFilter = newVal;
        (_a = this.table) === null || _a === void 0 ? void 0 : _a.setOptions(prev => (Object.assign(Object.assign({}, prev), { state: Object.assign(Object.assign({}, prev.state), { globalFilter: this.globalFilter }) })));
    }
    onLangChange(newVal) {
        this.lang = newVal;
    }
    // ─── Helpers ──────────────────────────────────────────────────────────────
    initTable() {
        this.table = createTable(buildTableOptions(this));
    }
    emitStateChangeIfDirty() {
        var _a, _b, _c, _d, _e;
        const rows = (_b = (_a = this.table) === null || _a === void 0 ? void 0 : _a.getRowModel().rows) !== null && _b !== void 0 ? _b : [];
        // Compute a stable fingerprint of the current visible row set
        const rowIdFingerprint = rows.map(r => r.id).join(',');
        // Only emit if the visible rows have actually changed
        if (rowIdFingerprint === this.lastEmittedRowIds)
            return;
        this.lastEmittedRowIds = rowIdFingerprint;
        this.gcdsTableStateChange.emit({
            visibleRows: rows.map((row, rowIndex) => ({
                rowId: row.id,
                rowIndex,
                original: row.original,
            })),
            page: this.paginationState.pageIndex + 1,
            pageSize: this.paginationSize,
            filterValue: this.filterValue,
            sortKey: (_d = (_c = this.sorting[0]) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : null,
            sortDirection: ((_e = this.sorting[0]) === null || _e === void 0 ? void 0 : _e.desc) ? 'desc' : 'asc',
        });
    }
    sortEnabled() {
        var _a;
        return (this.sort ||
            ((_a = this.columns) !== null && _a !== void 0 ? _a : []).some(col => col.sort));
    }
    getTemplate(columnKey) {
        return this.el.querySelector(`template[slot="cell:${columnKey}"]`);
    }
    applyBindings(el, row) {
        const bindings = Array.from(el.attributes).filter(attr => attr.name.startsWith('data-bind-'));
        for (const binding of bindings) {
            let prop;
            let value;
            if (binding.name.startsWith('data-bind-template-')) {
                prop = binding.name.replace('data-bind-template-', '');
                value = binding.value.replace(/\{(\w+)\}/g, (_, field) => { var _a; return String((_a = row[field]) !== null && _a !== void 0 ? _a : ''); });
            }
            else {
                prop = binding.name.replace('data-bind-', '');
                value = row[binding.value];
            }
            if (prop in el) {
                el[prop] = value;
            }
            else {
                el.setAttribute(prop, String(value !== null && value !== void 0 ? value : ''));
            }
        }
    }
    applyListeners(el, row, rowId) {
        const listeners = Array.from(el.attributes).filter(attr => attr.name.startsWith('data-on-'));
        for (const listener of listeners) {
            const eventName = listener.name.replace('data-on-', '');
            const dispatchName = listener.value;
            el.addEventListener(eventName, () => {
                this.el.dispatchEvent(new CustomEvent(dispatchName, {
                    bubbles: true,
                    composed: true,
                    detail: { row, rowId },
                }));
            });
        }
    }
    cloneAndInject(columnKey, row, rowId) {
        const template = this.getTemplate(columnKey);
        if (!template)
            return null;
        const fragment = template.content.cloneNode(true);
        const wrapper = document.createElement('div');
        wrapper.appendChild(fragment);
        const child = wrapper.firstElementChild;
        if (child) {
            if (child.tagName.includes('-')) {
                this.applyBindings(child, row);
                this.applyListeners(child, row, String(rowId));
                child.rowData = row;
                child.columnKey = columnKey;
                child.rowId = rowId;
            }
            else {
                this.applyBindings(child, row);
                this.applyListeners(child, row, String(rowId));
                child.dataset.rowId = String(rowId);
                child.dataset.columnKey = columnKey;
            }
        }
        return wrapper;
    }
    mountSlottedCell(tdEl, columnKey, row, rowId) {
        if (!tdEl)
            return;
        tdEl.innerHTML = '';
        const clone = this.cloneAndInject(columnKey, row, rowId);
        if (clone)
            tdEl.appendChild(clone);
    }
    // ─── Event handlers ───────────────────────────────────────────────────────
    /*
     * Handle sort toggling by updating table state
     */
    handleSortToggle(columnId) {
        var _a;
        const col = (_a = this.table) === null || _a === void 0 ? void 0 : _a.getColumn(columnId);
        if (!(col === null || col === void 0 ? void 0 : col.getCanSort()))
            return;
        col.toggleSorting();
    }
    /*
     * Handle page size selection by updating table state and focusing the table
     */
    handlePageSizeSelect(e) {
        const select = e.target;
        const val = Number(select.value);
        this.paginationSize = val;
    }
    /*
     * Handle pagination control clicks by updating table state and focusing the table
     */
    handlePaginationClick(e) {
        var _a, _b;
        this.paginationCurrentPage = e.detail.page;
        // focus table here to ensure keyboard users can navigate from pagination controls to table rows
        (_a = this.shadowElement) === null || _a === void 0 ? void 0 : _a.focus();
        (_b = this.shadowElement) === null || _b === void 0 ? void 0 : _b.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
    // ─── Methods ────────────────────────────────────────────────────────────
    async getVisibleRows() {
        var _a, _b;
        return ((_b = (_a = this.table) === null || _a === void 0 ? void 0 : _a.getRowModel().rows.map(row => ({
            rowId: row.id,
            rowIndex: row.index,
            original: row.original,
        }))) !== null && _b !== void 0 ? _b : []);
    }
    // ─── Lifecycle ────────────────────────────────────────────────────────────
    componentWillLoad() {
        // Define lang attribute
        this.lang = assignLanguage(this.el);
        // Validate if information is being passed as JSON strings and parse it
        this.onColumnsChange(this.columns);
        this.onDataChange(this.data);
        // Seed initial sort from sortDirection column definitions
        if (this.sortEnabled()) {
            this.sorting = buildInitialSorting(this.columns);
        }
        this.initialSorting = this.sorting;
        this.initTable();
    }
    componentDidRender() {
        this.emitStateChangeIfDirty();
    }
    // ─── Render ───────────────────────────────────────────────────────────────
    render() {
        var _a;
        if (!this.table)
            return null;
        const headerGroups = this.table.getHeaderGroups();
        const rows = this.pagination
            ? this.table.getPaginationRowModel().rows
            : this.table.getRowModel().rows;
        return (h(Host, null, h("section", { class: "gcds-table" }, this.el.querySelector('[slot="caption"]') && (h("div", { id: "gcds-table__caption" }, h("slot", { name: "caption" }))), (this.filter || this.sortEnabled()) && renderFilterSortModal(this), h("div", { class: "gcds-table__active-pills" }, renderFilterPills(this.filterValue, this.lang, () => {
            this.filterValue = '';
            updateTableOptions(this);
        }), renderSortPills(this.sorting, this.table, this.lang, (columnId) => {
            this.sorting = this.sorting.filter(s => s.id !== columnId);
            updateTableOptions(this);
        })), h("div", { class: "gcds-table__row-management" }, this.pagination && (h("div", { class: "gcds-table__page-size" }, h("gcds-select", { label: I18N[this.lang].rowsPerPage, name: "page-size", selectId: "gcds-table-page-size", value: this.paginationSize.toString(), onChange: e => this.handlePageSizeSelect(e) }, this.paginationSizeOptions.map(opt => (h("option", { key: opt, value: opt }, opt === 0 ? 'All' : opt)))))), h("span", { class: "gcds-table__page-info", role: "status", "aria-live": "polite" }, renderTableStatus(this.el, this.table, this.paginationState, this.lang))), h("table", { class: "gcds-table__table", tabindex: "-1", "aria-labelledby": this.el.querySelector('[slot="caption"]') ? 'gcds-table__caption' : undefined, ref: el => {
                if (el)
                    this.shadowElement = el;
            } }, h("thead", null, headerGroups.map(hg => (h("tr", { key: hg.id }, hg.headers.map(header => {
            var _a;
            const colDef = ((_a = this.columns) !== null && _a !== void 0 ? _a : []).find(c => c.field === header.id);
            const canSort = header.column.getCanSort();
            const alignmentClass = (colDef === null || colDef === void 0 ? void 0 : colDef.alignment)
                ? `alignment-${colDef.alignment}`
                : '';
            return (h("th", { key: header.id, class: `gcds-table__th ${alignmentClass}`, scope: "col", "aria-sort": header.column.getIsSorted() === 'asc'
                    ? 'ascending'
                    : header.column.getIsSorted() === 'desc'
                        ? 'descending'
                        : canSort
                            ? 'none'
                            : undefined }, canSort ? (h("button", { onClick: () => this.handleSortToggle(header.id), title: getSortTitle(header.column, this.lang) }, colDef === null || colDef === void 0 ? void 0 :
                colDef.header, h("span", { class: "gcds-table__sort-icon", "aria-hidden": "true" }, getSortIcon(header.column)))) : (colDef === null || colDef === void 0 ? void 0 : colDef.header)));
        }))))), h("tbody", null, rows.length === 0 ? (h("tr", null, h("td", { class: "gcds-table__empty", colSpan: ((_a = this.columns) !== null && _a !== void 0 ? _a : []).length }, I18N[this.lang].noData))) : (rows.map(row => (h("tr", { key: row.id, class: "gcds-table__row" }, row.getVisibleCells().map(cell => {
            var _a, _b;
            const colDef = ((_a = this.columns) !== null && _a !== void 0 ? _a : []).find(c => c.field === cell.column.id);
            const isSlotted = colDef === null || colDef === void 0 ? void 0 : colDef.slotted;
            const isManaged = colDef === null || colDef === void 0 ? void 0 : colDef.managed;
            let cellContent;
            let Tag = 'td';
            let scope = {};
            // Check if table header in row
            if (colDef === null || colDef === void 0 ? void 0 : colDef.rowHeader) {
                Tag = 'th';
                scope = {
                    scope: 'row',
                };
            }
            cellContent = !isSlotted
                ? String((_b = cell.getValue()) !== null && _b !== void 0 ? _b : '')
                : null;
            return (h(Tag, Object.assign({ key: cell.id, class: `gcds-table__td${(colDef === null || colDef === void 0 ? void 0 : colDef.alignment) ? ` alignment-${colDef.alignment}` : ''}`, "data-column": colDef === null || colDef === void 0 ? void 0 : colDef.header, "data-cell": `${cell.column.id}-${row.id}`, ref: isSlotted && !isManaged
                    ? tdEl => this.mountSlottedCell(tdEl, cell.column.id, row.original, Number(row.id))
                    : undefined }, scope), cellContent));
        }))))))), this.pagination && this.paginationSize !== 0 && (h("gcds-pagination", { display: "list", currentPage: this.paginationState.pageIndex + 1, totalPages: this.table.getPageCount(), label: I18N[this.lang].paginationLabel, onGcdsClick: e => this.handlePaginationClick(e) }))), h("slot", null)));
    }
    static get is() { return "gcds-table"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["./gcds-table.css"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["gcds-table.css"]
        };
    }
    static get properties() {
        return {
            "columns": {
                "type": "string",
                "attribute": "columns",
                "mutable": true,
                "complexType": {
                    "original": "string | TableColumn[]",
                    "resolved": "TableColumn[] | string",
                    "references": {
                        "TableColumn": {
                            "location": "import",
                            "path": "./utils/table-helpers",
                            "id": "src/components/gcds-table/utils/table-helpers.ts::TableColumn"
                        }
                    }
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Column definitions"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "[]"
            },
            "data": {
                "type": "string",
                "attribute": "data",
                "mutable": true,
                "complexType": {
                    "original": "string | object[]",
                    "resolved": "object[] | string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Row data"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "[]"
            },
            "sort": {
                "type": "boolean",
                "attribute": "sort",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Enable global column sorting (can be overridden per column)"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "false"
            },
            "pagination": {
                "type": "boolean",
                "attribute": "pagination",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Enable pagination"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "false"
            },
            "paginationCurrentPage": {
                "type": "number",
                "attribute": "pagination-current-page",
                "mutable": true,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Current page index"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "1"
            },
            "paginationSize": {
                "type": "number",
                "attribute": "pagination-size",
                "mutable": true,
                "complexType": {
                    "original": "number",
                    "resolved": "number",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Number of rows per page"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "10"
            },
            "paginationSizeOptions": {
                "type": "string",
                "attribute": "pagination-size-options",
                "mutable": true,
                "complexType": {
                    "original": "string | number[]",
                    "resolved": "number[] | string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Available page-size options.\nUse 0 to represent \"All rows\"."
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "[\n    10, 25, 50, 0,\n  ]"
            },
            "filter": {
                "type": "boolean",
                "attribute": "filter",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Enable global filter"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "false"
            },
            "filterValue": {
                "type": "string",
                "attribute": "filter-value",
                "mutable": true,
                "complexType": {
                    "original": "string",
                    "resolved": "string",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "Current filter string"
                },
                "getter": false,
                "setter": false,
                "reflect": false,
                "defaultValue": "''"
            }
        };
    }
    static get states() {
        return {
            "sorting": {},
            "columnFilters": {},
            "globalFilter": {},
            "paginationState": {},
            "lang": {}
        };
    }
    static get events() {
        return [{
                "method": "gcdsTableStateChange",
                "name": "gcdsTableStateChange",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": ""
                },
                "complexType": {
                    "original": "GcdsTableStateChange",
                    "resolved": "GcdsTableStateChange",
                    "references": {
                        "GcdsTableStateChange": {
                            "location": "import",
                            "path": "./utils/table-helpers",
                            "id": "src/components/gcds-table/utils/table-helpers.ts::GcdsTableStateChange"
                        }
                    }
                }
            }];
    }
    static get methods() {
        return {
            "getVisibleRows": {
                "complexType": {
                    "signature": "() => Promise<{ rowId: string; rowIndex: number; original: Record<string, unknown>; }[]>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        },
                        "Record": {
                            "location": "global",
                            "id": "global::Record"
                        }
                    },
                    "return": "Promise<{ rowId: string; rowIndex: number; original: Record<string, unknown>; }[]>"
                },
                "docs": {
                    "text": "",
                    "tags": []
                }
            }
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "columns",
                "methodName": "onColumnsChange"
            }, {
                "propName": "data",
                "methodName": "onDataChange"
            }, {
                "propName": "sort",
                "methodName": "onsortChange"
            }, {
                "propName": "pagination",
                "methodName": "onPaginationChange"
            }, {
                "propName": "paginationCurrentPage",
                "methodName": "onPageChange"
            }, {
                "propName": "paginationSize",
                "methodName": "onPageSizeChange"
            }, {
                "propName": "filterValue",
                "methodName": "onFilterValueChange"
            }, {
                "propName": "lang",
                "methodName": "onLangChange"
            }];
    }
}
//# sourceMappingURL=gcds-table.js.map
