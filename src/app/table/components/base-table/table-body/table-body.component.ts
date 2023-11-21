import {Component, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {TableProps} from "../../../models/table-models";
import {TableDataService} from "../../../service/table-service";
import {Observable, Subject} from "rxjs";

@Component({
  selector: 'd-table-rows',
  styleUrls: ['./table-body.component.scss', '../base-table.component.scss'],
  templateUrl: 'table-body.component.html',
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  standalone: true,
})
export class TableBodyComponent implements OnInit, OnDestroy {

  columnInitializer: TableProps = {columns: []};
  tableRows$: Observable<any> = this.service.tableRowData$
  hasData$: Observable<boolean> = this.service.hasData$
  selectedRow: {
    rowIndex: number,
    data: {},
    style: ""
  } = {
    rowIndex: -1,
    data: {},
    style: ""
  };
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private service: TableDataService) {
  }

  ngOnInit(): void {
    this.service.columnInitializer
      .subscribe((columnInitializer: TableProps) => {
        this.columnInitializer = columnInitializer;
      })
    this.service.selectedRowData$.subscribe((selectedRowData: any) => {
      this.selectedRow.data = selectedRowData;
      if (this.columnInitializer.onRowSelected) {
        this.columnInitializer.onRowSelected(this.selectedRow.data);
      }
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setCellWidth(cellIndex: number): number | undefined {
    return this.columnInitializer.columns[cellIndex].width;
  }

  setSelectedRowStyle(rowIndex: number): string {
    if (this.selectedRow.rowIndex === rowIndex) {
      return "selected-row";
    } else {
      return "";
    }
  }

  setSelectedRow(rowIndex: number): void {
    this.service.setSelectedRow(rowIndex);
    this.service.setSelectedRowData(rowIndex);
    this.service.setColumnToFilter(-1);
    this.selectedRow.rowIndex = rowIndex;
  }
}
