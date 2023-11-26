import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {TableDataService} from "../../../service/table-service";
import {Observable, Subject} from "rxjs";
import {TableProps} from "../../../models/table-models";


@Component({
  selector: 'table-header',
  standalone: true,
  styleUrls: ['./table-header.component.scss', '../base-table.component.scss'],
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './table-header.component.html'
})
export class TableHeaderComponent implements OnInit, OnDestroy {

  tableHeader$: Observable<string[]> = this.service.tableHeader$;
  columnForFilter$: Observable<number> = this.service.columnToFilter$;
  @Input()
  columnInitializer!: TableProps;
  @Input()
  currentSort: { column: string, direction: 'asc' | 'desc' | undefined } = {column: '', direction: 'asc'};
  headerLength: number = -1;
  private _headerLength$: Observable<number> = this.service.headerLength$;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private service: TableDataService) {
  }

  setCellWidth(columnIndex: number): number | undefined {
    return this.columnInitializer.columns[columnIndex].width;
  }

  ngOnInit(): void {
    this._headerLength$.subscribe((headerLength: number) => this.headerLength = headerLength);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
