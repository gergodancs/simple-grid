import {SortDirection, TableProps} from "../models/table-models";
import {sortTableRows} from "./sorting-utils";

export const createSimpleTable = <TData>(
  tableData: TData[],
  tableOptions: TableProps
): Array<Array<string | number>> => {
  if (tableData.length === 0) {
    console.log('nincs data');
    return [];
  }
  const numberOfColumns = tableOptions.columns.length;
  console.log(numberOfColumns)
  let displayData: Array<string | number>[] = [];
  let columnIndexToSort = -1;
  let direction: SortDirection = undefined;

  tableOptions.columns.forEach((column, index) => {
    if (column.sortDirection !== undefined) {
      columnIndexToSort = index;
      direction = column.sortDirection;
    }
  })

  tableData.forEach((rowData: any) => {
    const tableRow: Array<string | number> = [];
    for (let i = 0; i < numberOfColumns; i++) {
      const columnHeader = tableOptions.columns[i]?.field;
      let cellValue: string | number = '';

      if (columnHeader !== undefined) {
        const valueSetter = tableOptions.columns[i]?.valueSetter;
        if (valueSetter !== undefined) {
          cellValue = valueSetter(rowData[columnHeader]);
        } else {
          cellValue = rowData[columnHeader] ?? '';
        }
      }
      tableRow.push(cellValue);
    }
    displayData.push(tableRow);
  });
  if (columnIndexToSort !== -1) {
    return sortTableRows(displayData, columnIndexToSort, direction)
  } else {
    console.log('displaay:', displayData)
    return displayData;
  }
};


export const initTableHeaders = (tableOptions: TableProps): string[] => {
  return tableOptions.columns.map((column, index) => {
    return column.header;
  });
}

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}



