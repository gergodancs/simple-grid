import {Component, Input, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {applySorting, createMapFromTableData} from "../../utils/utils";
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ColumnProps, TableProps} from "../../models/table-models";
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

  constructor() {

  }

  ngOnInit(): void {
    if (this.tableData && this.tableData.length > 0) {
      this.tableHeader = initTableHeaders(this.columnInitializer);
      this.tableRows = createSimpleTable(this.tableData, this.columnInitializer);
      this.mappedData = createMapFromTableData(this.tableData);
      console.log(this.mappedData);
    } else {
      this.tableHeader = initTableHeaders(this.columnInitializer);
    }
  }

  setSelectedRow(rowIndex: number): void {
    this.selectedRow.data = this.tableData[rowIndex];
    this.selectedRow.rowIndex = rowIndex;
    if (this.columnInitializer.onRowSelected) {
      this.columnInitializer.onRowSelected(this.selectedRow.data);
    }
  }

  setRowStyle(rowIndex: number): string {
    if (this.selectedRow.rowIndex === rowIndex) {
      return "selected-row";
    } else {
      return "";
    }
  }

  setCellWidth(cellIndex: number): number | undefined {
    return this.columnInitializer.columnProps[cellIndex].width;
  }

  setInputCellWidth(cellIndex: number): number {
    if (this.columnInitializer.columnProps[cellIndex].width !== undefined) {
      const {width} = this.columnInitializer!.columnProps[cellIndex]!;
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
}
