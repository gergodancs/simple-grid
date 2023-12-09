import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {TableDataService} from "../../../service/table-service";
import {map, Observable, Subject, takeUntil} from "rxjs";
import {CurrentSort, TableProps} from "../../../models/table-models";
import {initTableHeaders} from "../../../utils/init-utils";
import {RowDataService} from "../../../service/data-service";
import {determineSortDirection} from "../../../utils/sorting-utils";
import {FilterInputComponent} from "./filter/filter.component";
import {DragDropModule} from "@angular/cdk/drag-drop";


@Component({
  selector: 'd-table-header',
  standalone: true,
  styleUrls: ['./table-header.component.scss', '../base-table.component.scss'],
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, FilterInputComponent, DragDropModule],
  templateUrl: './table-header.component.html'
})
export class TableHeaderComponent implements OnInit, OnDestroy {

  @Input()
  columnInitializer!: TableProps;
  tableHeader: string[] = [];
  currentSort: CurrentSort = {column: '', direction: 'asc'};
  private _columnToSort$: Observable<number> = this.service.columnToSort$;
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private service: TableDataService,
              private _rowDataService: RowDataService) {
  }


  ngOnInit(): void {
    this.tableHeader = initTableHeaders(this.columnInitializer);
    this._sortSubscription().subscribe();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  setCellWidth(columnIndex: number): number | undefined {
    let width = this.columnInitializer.columns[columnIndex].width;
    if (width !== undefined && columnIndex === 0) {
      return width + 16;
    }
    return width;
  }

  sortData(columnIndex: number) {
    this.service.setColumnToSort(columnIndex);
  }

  onFilterIconClick(event: Event, columnIndex: number): void {
    event.stopPropagation();
    this.service.setColumnToFilter(-1);
    this.service.setColumnToFilter(columnIndex);
    this.service.setFilterValue('');
  }

  private _sortSubscription(): Observable<any> {
    return this._columnToSort$.pipe(
      takeUntil(this._ngUnsubscribe),
      map((columnIndex) => {
        if (columnIndex !== -1) {
          const {currentSort} = determineSortDirection(this.currentSort, this.columnInitializer, columnIndex);
          this._rowDataService.sortTableRows(columnIndex, currentSort.direction);
        }
      }),
    );
  }
}
