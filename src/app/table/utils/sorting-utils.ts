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
export const applySorting = (currentColum: any, tableData: any[]) => {
  const direction = currentColum.sortDirection;
  const column = currentColum.header;
  return tableData.sort((a: any, b: any) => {
    if (direction === 'asc') {
      if (a[column] > b[column]) {
        return 1;
      } else if (a[column] < b[column]) {
        return -1;
      } else {
        return 0;
      }
    } else {
      if (a[column] < b[column]) {
        return 1;
      } else if (a[column] > b[column]) {
        return -1;
      } else {
        return 0;
      }
    }
  })
};

export const applySortBySortProp = (currentColumn: any, tableData: any[]) => {
  const direction = currentColumn.sortDirection;
  const column = currentColumn.header;
  return tableData.sort((a: any, b: any) => {
    const valueA = getValueByProperty(a[column], currentColumn.sortBy);
    const valueB = getValueByProperty(b[column], currentColumn.sortBy);

    if (direction === 'asc') {
      if (valueA > valueB) {
        return 1;
      } else if (valueA < valueB) {
        return -1;
      } else {
        return 0;
      }
    } else {
      if (valueA < valueB) {
        return 1;
      } else if (valueA > valueB) {
        return -1;
      } else {
        return 0;
      }
    }
  });
};

const getValueByProperty = (data: any, property: string): any => {
  const fields = property.split('.');
  let value = data;

  for (const field of fields) {
    value = value[field];
  }

  return value;
};
