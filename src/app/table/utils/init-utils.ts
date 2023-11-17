import {ColumnProps, TableProps} from "../models/table-models";

export const createSimpleTable = <TData>(tableData: TData[], tableOptions: TableProps): Array<Array<string | number>> => {
    if (tableData.length === 0) {
        return [];
    }
    const numberOfColumns = tableOptions.columnProps.length;
    let displayData: Array<string | number>[] = [];

    tableData.forEach((rowData: any) => {
        const tableRow: Array<string | number> = [];
        for (let i = 0; i < numberOfColumns; i++) {
            const columnHeader = tableOptions.columnProps[i].field;
            const cellValue = rowData[columnHeader] ?? '';
            tableRow.push(cellValue);
        }
        displayData.push(tableRow);
    });

    return displayData;
};

export const initTableHeaders = (tableOptions: TableProps): string[] => {
    return tableOptions.columnProps.map((column, index) => {
        return column.header;
    });
}

export const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
