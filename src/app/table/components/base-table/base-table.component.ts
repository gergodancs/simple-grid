import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {createMapFromTableData} from "../../utils/utils";
import {ReactiveFormsModule} from "@angular/forms";
import {TableProps} from "../../models/table-models";
import {createSimpleTable, initTableHeaders} from "../../utils/init-utils";
import {applySortBySortProp, applySorting, determineSortDirection} from "../../utils/sorting-utils";
import {TableDataService} from "../../service/table-service";
import {map, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {TableHeaderComponent} from "./table-header/table-header.component";


@Component({
  selector: 'd-table',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, TableHeaderComponent],
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
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
  columnToSort$: Observable<number> = this.service.columnToSort$;
  columnToFilter$: Observable<number> = this.service.columnToFilter$;
  filterValue$: Observable<string> = this.service.filterValue$;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private _cashedTableRows: any[] = [];


  filterSubscription$ = this.columnToFilter$.pipe(
    switchMap((columnIndex) => {
      return this.filterValue$.pipe(
        map((filterValue: string) => {
          if (filterValue === '') {
           // it runs when the filter is cleared or toggle between filter inputs
          } else {
            this.tableRows = this._cashedTableRows.filter((row: any) => {
              return row[columnIndex].toString().toLowerCase().includes(filterValue.toLowerCase());
            });
          }
        }),
        takeUntil(this.ngUnsubscribe),
      );
    })
  );

  constructor(private service: TableDataService) {

  }

  ngOnInit(): void {
    if (this.tableData && this.tableData.length > 0) {
      this.service.setTableHeader(initTableHeaders(this.columnInitializer));
      this.service.setColumnInitializer(this.columnInitializer);
      this.tableHeader = initTableHeaders(this.columnInitializer);
      this.tableRows = createSimpleTable(this.tableData, this.columnInitializer);
      this._cashedTableRows = [...this.tableRows];
      this.mappedData = createMapFromTableData(this.tableData);

      this.columnToSort$.subscribe((columnIndex: number) => {
        if (columnIndex !== -1) {
          this.sortData(columnIndex);
        }

      });
      this.filterSubscription$.subscribe();
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

  sortData(columnIndex: number) {
    const {currentSort, currentColumn} = determineSortDirection(this.currentSort, this.columnInitializer, columnIndex);
    this.currentSort = currentSort
    this.tableData = !currentColumn.sortBy ?
      applySorting(currentColumn, [...this.tableData]) :
      applySortBySortProp(currentColumn, [...this.tableData]);
    this.tableRows = createSimpleTable(this.tableData, this.columnInitializer);
    this.mappedData = createMapFromTableData([...this.tableData]);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
