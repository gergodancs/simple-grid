import {Component, Input, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {applySorting, createMapFromTableData} from "../../utils/utils";
import {ReactiveFormsModule} from "@angular/forms";
import {TableProps} from "../../models/table-models";
import {createSimpleTable, initTableHeaders} from "../../utils/init-utils";
import {determineSortDirection} from "../../utils/sorting-utils";


@Component({
  selector: 'd-table',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss']
})
export class TableComponent implements OnInit {


  @Input()
  columnInitializer!: TableProps;

  @Input()
  tableData: any;

  tableHeader: string[] = [];

  tableRows: any[] = [];
  mappedData: any[] = [];
  currentSort: { column: string, direction: 'asc' | 'desc' | undefined } = {column: '', direction: 'asc'};
  selectedRow: {
    rowIndex: number,
    data: {},
    style: ""
  } = {
    rowIndex: -1,
    data: {},
    style: ""
  };
  columnForFilter: number = -1;
  private _cashedTableRows: any[] = [];

  constructor() {

  }

  ngOnInit(): void {
    if (this.tableData && this.tableData.length > 0) {
      this.tableHeader = initTableHeaders(this.columnInitializer);
      this.tableRows = createSimpleTable(this.tableData, this.columnInitializer);
      this._cashedTableRows = [...this.tableRows];
      this.mappedData = createMapFromTableData(this.tableData);
    } else {
      this.tableHeader = initTableHeaders(this.columnInitializer);
    }
  }

  setSelectedRow(rowIndex: number): void {
    this.columnForFilter = -1;
    this.selectedRow.data = this.tableData[rowIndex];
    this.selectedRow.rowIndex = rowIndex;
    if (this.columnInitializer.onRowSelected) {
      this.columnInitializer.onRowSelected(this.selectedRow.data);
    }
  }

  onFilterIconClick(event: Event, columnIndex: number): void {
    event.stopPropagation();
    this.columnForFilter = columnIndex;


  }

  setRowStyle(rowIndex: number): string {
    if (this.selectedRow.rowIndex === rowIndex) {
      return "selected-row";
    } else {
      return "";
    }
  }

  setCellWidth(cellIndex: number): number | undefined {
    return this.columnInitializer.columns[cellIndex].width;
  }

  setInputWidth(cellIndex: number, input: HTMLElement): number | undefined {
    input.focus();
    return this.columnInitializer.columns[cellIndex].width;

  }

  setInputCellWidth(cellIndex: number): number {
    if (this.columnInitializer.columns[cellIndex].width !== undefined) {
      const {width} = this.columnInitializer!.columns[cellIndex]!;
      return width as number - 10;
    }
    return 0;

  }

  sortData(columnIndex: number) {
    const {currentSort, currentColumn} = determineSortDirection(this.currentSort, this.columnInitializer, columnIndex);
    this.currentSort = currentSort
    this.tableData = applySorting(currentColumn.header, currentColumn.sortDirection, [...this.tableData]);
    this.tableRows = createSimpleTable(this.tableData, this.columnInitializer);
    this.mappedData = createMapFromTableData([...this.tableData]);
  }

  filterInputClick($event: Event, columnIndex: number) {
    $event!.stopPropagation();
  }

  onFilterColumn($event: KeyboardEvent, columnIndex: number) {
    let searchTerm = ($event.target as HTMLInputElement).value;
    if (searchTerm === '') {
      this.tableRows = [...this._cashedTableRows];
    } else {
      this.tableRows = this.tableRows.filter((row: any) => {
        return row[columnIndex].toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
    }
  }
}
