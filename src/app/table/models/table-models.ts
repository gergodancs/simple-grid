export interface TableProps {
    headers: string[];
    onRowSelected?: (data: any) => void;
    columnProps: ColumnProps[];

}

export type ColumnProps = {
    header: string;
    field: string;
    width?: number;
    sortable?: boolean;
    sortDirection?: 'asc' | 'desc';
    valueSetter?: (value: any) => string | number;
}
