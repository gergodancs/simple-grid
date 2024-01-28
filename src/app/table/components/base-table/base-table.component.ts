import {Component, effect, input, Input, OnDestroy, OnInit, Signal} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {createMapFromTableData} from "../../utils/utils";
import {ReactiveFormsModule} from "@angular/forms";
import {TableProps} from "../../models/table-models";
import {createSimpleTable} from "../../utils/init-utils";
import {Subject} from "rxjs";
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

  data = input<any>([]) ;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _rowDataService: RowDataService) {
    effect(() => {
      if(this.data().length > 0){
      this._initTable(this.data())
      }
    });
  }

  ngOnInit(): void {
    if (this.tableData && this.tableData.length > 0) {
      this._initTable(this.tableData);
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  private _initTable(arr: any) {
    const originalTableData = createSimpleTable(arr, this.columnInitializer);
    this._rowDataService.setTableRowData([...originalTableData]);
    this._rowDataService.setOriginalRowData([...originalTableData]);
    this.mappedData = createMapFromTableData(this.tableData);
  }
}
