import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {FilterType} from "../models/table-models";

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  private _columnToSortSubject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public columnToSort$: Observable<number> = this._columnToSortSubject.asObservable();

  private _columnToFilterSubject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public columnToFilter$: Observable<number> = this._columnToFilterSubject.asObservable();

  private _filterValueSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public filterValue$: Observable<string> = this._filterValueSubject.asObservable();

  constructor() {
  }

  setFilterValue(filterValue: string) {
    this._filterValueSubject.next(filterValue);
  }

  setColumnToFilter(columnIndex: number): void {
    this._columnToFilterSubject.next(columnIndex);
  }

  setColumnToSort(columnIndex: number): void {
    this._columnToSortSubject.next(columnIndex);
  }
}
