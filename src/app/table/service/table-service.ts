import {Injectable, signal, Signal} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {FilterType} from "../models/table-models";

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  private _columnToSortSubject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public columnToSort$: Observable<number> = this._columnToSortSubject.asObservable();

  private _filterSignal = signal('');
  readonly filter = this._filterSignal.asReadonly();
  private _filterColumnSignal = signal(-1);
  readonly filterColumn = this._filterColumnSignal.asReadonly();
  constructor() {
  }

  setFilterSignal(filterValue: string) {
    this._filterSignal.set(filterValue);
  }
  setFilterColumn(filterValue: number) {
    this._filterColumnSignal.set(filterValue);
  }
  setColumnToSort(columnIndex: number): void {
    this._columnToSortSubject.next(columnIndex);
  }
}
