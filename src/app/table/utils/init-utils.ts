import {TableProps} from "../models/table-models";

export const createSimpleTable = <TData>(
  tableData: TData[],
  tableOptions: TableProps
): Array<Array<string | number>> => {
  if (tableData.length === 0) {
    return [];
  }
  const numberOfColumns = tableOptions.columns.length;
  let displayData: Array<string | number>[] = [];

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

  return displayData;
};


export const initTableHeaders = (tableOptions: TableProps): string[] => {
  return tableOptions.columns.map((column, index) => {
    return column.header;
  });
}

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
