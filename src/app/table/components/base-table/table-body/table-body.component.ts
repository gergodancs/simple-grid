import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {TableProps} from "../../../models/table-models";
import {TableDataService} from "../../../service/table-service";
import {Observable, Subject} from "rxjs";
import {RowDataService} from "../../../service/data-service";

@Component({
  selector: 'd-table-rows',
  styleUrls: ['./table-body.component.scss', '../base-table.component.scss'],
  templateUrl: 'table-body.component.html',
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  standalone: true,
})
export class TableBodyComponent implements OnInit, OnDestroy {
  @Input()
  columnInitializer!: TableProps;
  tableRows$: Observable<any> = this._rowDataService.tableRowData$;
  hasData$: Observable<boolean> = this._rowDataService.hasData$;
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

  constructor(private service: TableDataService,
              private _rowDataService: RowDataService) {
  }

  ngOnInit(): void {
    this._rowDataService.selectedRowData$.subscribe((selectedRowData: any) => {
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
    this._rowDataService.setSelectedRowData(rowIndex);
    this.service.setColumnToFilter(-1);
    this.selectedRow.rowIndex = rowIndex;
  }
}
