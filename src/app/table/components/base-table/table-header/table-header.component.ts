import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {TableDataService} from "../../../service/table-service";
import {map, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {TableProps} from "../../../models/table-models";
import {initTableHeaders} from "../../../utils/init-utils";
import {RowDataService} from "../../../service/data-service";


@Component({
  selector: 'table-header',
  standalone: true,
  styleUrls: ['./table-header.component.scss', '../base-table.component.scss'],
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './table-header.component.html'
})
export class TableHeaderComponent implements OnInit, OnDestroy {

  tableHeader: string[] = [];
  columnToFilter$: Observable<number> = this.service.columnToFilter$;
  @Input()
  columnInitializer!: TableProps;
  @Input()
  currentSort: { column: string, direction: 'asc' | 'desc' | undefined } = {column: '', direction: 'asc'};
  private _filterValue$: Observable<string> = this.service.filterValue$;
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  private _filterSubscription$ = this.columnToFilter$.pipe(
    switchMap((columnIndex) => {
      return this._filterValue$.pipe(
        map((filterValue: string) => {
          this._rowDataService.filterTableRows(columnIndex, filterValue);
        }),
        takeUntil(this._ngUnsubscribe),
      );
    })
  );

  constructor(private service: TableDataService,
              private _rowDataService: RowDataService) {
  }

  setCellWidth(columnIndex: number): number | undefined {
    return this.columnInitializer.columns[columnIndex].width;
  }

  ngOnInit(): void {
    this.tableHeader = initTableHeaders(this.columnInitializer);
    this._filterSubscription$.subscribe();
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
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
}
