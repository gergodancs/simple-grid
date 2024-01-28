import {Component, effect, Input, signal} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {ReactiveFormsModule} from "@angular/forms";
import {TableDataService} from "../../../../service/table-service";
import {RowDataService} from "../../../../service/data-service";
import {FilterType, TableProps} from "../../../../models/table-models";


@Component({
  selector: 'd-filter-input',
  templateUrl: './filter.component.html',
  standalone: true,
  styleUrls: ['../table-header.component.scss', 'filter.component.scss'],
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
})
export class FilterInputComponent {

  @Input()
  columnIndex: number = -1;
  @Input()
  columnInitializer!: TableProps;

  columnSignal = this._service.filterColumn;
  filterSignal = this._service.filter;
  filterTypeSignal = signal(FilterType.Contains)
  protected readonly FilterType = FilterType;

  constructor(private _service: TableDataService,
              private _rowDataService: RowDataService) {
    effect(() => {
      if (this.filterTypeSignal() && this.filterSignal && this.columnSignal) {
        this._rowDataService.filterTableRows(this.columnSignal(), this.filterSignal(), this.filterTypeSignal());
      }
    });
  }
  setInputWidth(cellIndex: number): number | undefined {
    return this.columnInitializer.columns[cellIndex].width;
  }
  onFilterColumn($event: any, filterType: FilterType) {
    this.filterTypeSignal.set(filterType);
    let searchTerm = ($event.target as HTMLInputElement).value;
    this._service.setFilterSignal(searchTerm);
  }
}
