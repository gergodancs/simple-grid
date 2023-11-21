import {Component, Input, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {TableDataService} from "../../../service/table-service";
import {Observable} from "rxjs";
import {TableProps} from "../../../models/table-models";


@Component({
  selector: 'table-header',
  standalone: true,
  styleUrls: ['./table-header.component.scss', '../base-table.component.scss'],
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './table-header.component.html'
})
export class TableHeaderComponent implements OnInit {

  tableHeader: Observable<string[]> = this.service.tableHeader$;
  headerLength$: Observable<number> = this.service.headerLength$;
  columnInitializer: TableProps = {columns: []};
  columnForFilter: Observable<number> = this.service.columnToFilter$;
  @Input()
  currentSort: { column: string, direction: 'asc' | 'desc' | undefined } = {column: '', direction: 'asc'};

  headerLength: number = -1;

  constructor(private service: TableDataService) {
    this.tableHeader = service.tableHeader$

  }

  setCellWidth(columnIndex: number): number | undefined {
    return this.columnInitializer.columns[columnIndex].width;
  }

  ngOnInit(): void {
    this.service.columnInitializer.subscribe((columnInitializer: TableProps) => {
      this.columnInitializer = columnInitializer;
    })
    this.headerLength$.subscribe((headerLength: number) => this.headerLength = headerLength);
  }

  sortData(columnIndex: number) {
    this.service.setColumnToSort(columnIndex);
  }

  filterInputClick($event: Event, columnIndex: number) {
    $event!.stopPropagation();
  }

  onFilterIconClick(event: Event, columnIndex: number): void {
    event.stopPropagation();
    // this.service.setFilterValue('');
    this.service.setColumnToFilter(columnIndex);
  }

  setInputWidth(cellIndex: number, input: HTMLElement): number | undefined {
    input.focus();
    return this.columnInitializer.columns[cellIndex].width;

  }

  onFilterColumn($event: KeyboardEvent) {
    let searchTerm = ($event.target as HTMLInputElement).value;
    this.service.setFilterValue(searchTerm)
  }

  onFilterInputBlur() {
    this.service.setColumnToFilter(-1);
  }
}
