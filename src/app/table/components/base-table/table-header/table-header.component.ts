import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {TableDataService} from "../../../service/table-service";
import {map, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {CurrentSort, TableProps} from "../../../models/table-models";
import {initTableHeaders} from "../../../utils/init-utils";
import {RowDataService} from "../../../service/data-service";
import {determineSortDirection} from "../../../utils/sorting-utils";


@Component({
  selector: 'd-table-header',
  standalone: true,
  styleUrls: ['./table-header.component.scss', '../base-table.component.scss'],
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './table-header.component.html'
})
export class TableHeaderComponent implements OnInit, OnDestroy {

  @Input()
  columnInitializer!: TableProps;
  tableHeader: string[] = [];
  currentSort: CurrentSort = {column: '', direction: 'asc'};
  columnToFilter$: Observable<number> = this.service.columnToFilter$;
  private _filterValue$: Observable<string> = this.service.filterValue$;
  private _columnToSort$: Observable<number> = this.service.columnToSort$;
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private service: TableDataService,
              private _rowDataService: RowDataService) {
  }


  ngOnInit(): void {
    this.tableHeader = initTableHeaders(this.columnInitializer);
    this._filterSubscription().subscribe();
    this._sortSubscription().subscribe();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  setCellWidth(columnIndex: number): number | undefined {
    return this.columnInitializer.columns[columnIndex].width;
  }

  sortData(columnIndex: number) {
    this.service.setColumnToSort(columnIndex);
  }

  filterInputClick($event: Event) {
    $event!.stopPropagation();
  }

  onFilterIconClick(event: Event, columnIndex: number): void {
    event.stopPropagation();
    this.service.setColumnToFilter(-1);
    this.service.setColumnToFilter(columnIndex);
    this.service.setFilterValue('');
  }

  setInputWidth(cellIndex: number, input: HTMLElement): number | undefined {
    input.focus();
    return this.columnInitializer.columns[cellIndex].width;

  }

  onFilterColumn($event: KeyboardEvent) {
    let searchTerm = ($event.target as HTMLInputElement).value;
    this.service.setFilterValue(searchTerm)
  }

  onFilterInputBlur(actualColumn: number) {
    // this.service.setFilterValue('');
    //this.service.setColumnToFilter(-1);
  }

  private _filterSubscription(): Observable<any> {
    return this.columnToFilter$.pipe(
      switchMap((columnIndex) => {
        return this._filterValue$.pipe(
          map((filterValue: string) => {
            this._rowDataService.filterTableRows(columnIndex, filterValue);
          }),
          takeUntil(this._ngUnsubscribe),
        );
      })
    );
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
