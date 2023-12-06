import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {TableDataService} from "../../../../service/table-service";
import {RowDataService} from "../../../../service/data-service";
import {map, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {FilterType, TableProps} from "../../../../models/table-models";


@Component({
  selector: 'd-filter-input',
  templateUrl: './filter.component.html',
  standalone: true,
  styleUrls: ['../table-header.component.scss','filter.component.scss'],
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
})
export class FilterInputComponent implements OnInit, OnDestroy {

  @Input()
  columnIndex: number = -1;
  @Input()
  columnInitializer!: TableProps;


  columnToFilter$: Observable<number> = this.service.columnToFilter$;
  filterType: FilterType = FilterType.Contains;
  protected readonly FilterType = FilterType;
  private _filterValue$: Observable<string> = this.service.filterValue$;
  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private service: TableDataService,
              private _rowDataService: RowDataService) {
  }

  ngOnInit(): void {
    this._filterSubscription().subscribe();
  }

  setInputWidth(cellIndex: number, input: HTMLElement): number | undefined {
    return this.columnInitializer.columns[cellIndex].width;
  }

  onFilterColumn($event: any, filterType: FilterType) {
    this.filterType = filterType;
    let searchTerm = ($event.target as HTMLInputElement).value;
    this.service.setFilterValue(searchTerm)
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  private _filterSubscription(): Observable<any> {
    return this.columnToFilter$.pipe(
      switchMap((columnIndex) => {
        return this._filterValue$.pipe(
          map((filterValue: string) => {
            this._rowDataService.filterTableRows(columnIndex, filterValue, this.filterType);
          }),
          takeUntil(this._ngUnsubscribe),
        );
      })
    );
  }
}
