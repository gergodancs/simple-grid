import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {createMapFromTableData} from "../../utils/utils";
import {ReactiveFormsModule} from "@angular/forms";
import {TableProps} from "../../models/table-models";
import {createSimpleTable} from "../../utils/init-utils";
import {determineSortDirection} from "../../utils/sorting-utils";
import {TableDataService} from "../../service/table-service";
import {Observable, Subject, Subscription} from "rxjs";
import {TableHeaderComponent} from "./table-header/table-header.component";
import {TableBodyComponent} from "./table-body/table-body.component";
import {RowDataService} from "../../service/data-service";


@Component({
  selector: 'd-table',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, TableHeaderComponent, TableBodyComponent],
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
  mappedData: any[] = [];
  @Input()
  columnInitializer!: TableProps;
  @Input()
  tableData: any;
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _rowDataService: RowDataService) {
  }

  ngOnInit(): void {
    if (this.tableData && this.tableData.length > 0) {
      this._initTable();
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  private _initTable() {
    const originalTableData = createSimpleTable(this.tableData, this.columnInitializer);
    this._rowDataService.setTableRowData([...originalTableData]);
    this._rowDataService.setOriginalRowData([...originalTableData]);
    this.mappedData = createMapFromTableData(this.tableData);
  }
}
