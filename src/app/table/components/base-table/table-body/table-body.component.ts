import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {SelectedRow, TableProps} from "../../../models/table-models";
import {TableDataService} from "../../../service/table-service";
import {map, Observable, Subject, takeUntil} from "rxjs";
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
  selectedRow: SelectedRow ={
    rowIndex: -1,
    data: {},
    style: ""
  };
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _service: TableDataService,
              private _rowDataService: RowDataService) {
  }

  ngOnInit(): void {
    this._onRowSelectedSubscription().subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  setCellWidth(cellIndex: number): number | undefined {
    return this.columnInitializer.columns[cellIndex].width;
  }

  setSelectedRowStyle(rowIndex: number): string {
    if (this.selectedRow!.rowIndex === rowIndex) {
      return "selected-row";
    } else {
      return "";
    }
  }

  setSelectedRow(rowIndex: number): void {
    this._rowDataService.setSelectedRowData(rowIndex);
    this._service.setColumnToFilter(-1);
    this.selectedRow!.rowIndex = rowIndex;
  }

  private _onRowSelectedSubscription(): Observable<any> {
    return this._rowDataService.selectedRowData$.pipe(
      takeUntil(this.ngUnsubscribe),
      map((selectedRowData: any) => {
        this.selectedRow!.data = selectedRowData;
        if (this.columnInitializer.onRowSelected) {
          this.columnInitializer.onRowSelected(this.selectedRow!.data);
        }
      }),
    );
  }
}
