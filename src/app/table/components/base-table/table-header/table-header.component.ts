import {Component, HostListener, Input, OnDestroy, OnInit} from "@angular/core";
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
  private startX = 0;
  private columnIndexResizing = -1;

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

  onSeparatorMouseDown(event: MouseEvent, columnIndex: number) {
    this.startX = event.clientX;
    this.columnIndexResizing = columnIndex;

    console.log("clicked")
  }

  // Function triggered when the mouse moves after pressing down on the separator
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.columnIndexResizing >= 0) {
      const movementX = event.clientX - this.startX;
      // You can use `movementX` to track the amount of horizontal movement of the mouse
      console.log('MovementX:', movementX);
      // Implement resizing logic here based on the movementX value
      // For example, update the width of columns based on the movement
      // this.updateColumnWidth(this.columnIndexResizing, movementX);

      this.startX = event.clientX;
      this.columnInitializer.columns[this.columnIndexResizing].width = this.columnInitializer.columns[this.columnIndexResizing].width! + movementX


    }
  }

  // Function triggered when the mouse button is released after dragging the separator
  @HostListener('document:mouseup')
  onMouseUp() {
    this.columnIndexResizing = -1;
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
