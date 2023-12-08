import {TableProps} from "../models/table-models";

export type CurrentSort = { column: string, direction: 'asc' | 'desc' | undefined }
export const determineSortDirection = (currentSort: CurrentSort, tableOptions: TableProps, columnIndex: number): any => {
    const currentColumn = tableOptions.columns[columnIndex];
    if (currentSort.column === currentColumn.header) {
        currentSort.direction =
            currentSort.direction === 'asc' ? 'desc' : currentSort.direction === 'desc' ? undefined : 'asc';
    } else {
        currentSort.column = currentColumn.header;
        currentSort.direction = 'asc';
    }

    const currentSortDirection = currentColumn.sortDirection;
    if (currentSortDirection === undefined) {
        currentColumn.sortDirection = 'asc';
    } else if (currentSortDirection === 'asc') {
        currentColumn.sortDirection = 'desc';
    } else {
        currentColumn.sortDirection = undefined;
        currentSort.column = '';
        currentSort.direction = 'asc';
    }
    return {currentSort, currentColumn, currentSortDirection};
}
