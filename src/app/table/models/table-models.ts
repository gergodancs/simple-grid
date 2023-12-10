export interface TableProps {
  /**
   * A callback function triggered when a row is selected.
   * @param data - The data of the selected row.
   * This function receives the data of the selected row when a user interacts with it in the table.
   * Use this function to perform actions or operations based on the selected row data.
   * For instance trigger side effects, or update other components based on the selected row's data.
   * If not provided, no action will be taken upon row selection.
   */
  onRowSelected?: (data: any) => void;
  /**
   * Set it true to let user sort rows by drag and drop
   */
  // todo: implement functionality
  movableRows?: boolean;
  /**
   * The list of column initializer.
   * Each column initializer is an object with the following properties:
   * - `field` - The name of the column.
   * - `header` - The header text of the column.
   * - `width` - The width of the column in pixels.
   * - `valueSetter` - A callback function that receives the data of the selected row.
   */

  columns: ColumnProps[];

}

export type ColumnProps = {
  /**
   * The header or title of the column.
   */
  header: string;
  /**
   * The field or key in the data object representing this column.
   */
  field: string;
  /**
   * The width of column in pixels.
   */
  width?: number;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc';
  sortBy?: string;


  /**
   * A function that transforms the raw data before displaying it in the table.
   * @param data - The raw data value to be transformed.
   * @returns The transformed string or number value to display in the table.
   */
  valueSetter?: (data: any) => string | number;
}

export type SortDirection = 'asc' | 'desc' | undefined;

export type CurrentSort = {
  column: string;
  direction: SortDirection;
}
 export type SelectedRow = {
   rowIndex: number,
   data: {},
   style: string
 }

export enum FilterType {
  Contains = 'contains',
  StartWith = 'startWith',
  EndWith = 'endWith',
  NotContains = 'notContains',
}
