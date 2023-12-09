import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {sortTableRows} from "../utils/sorting-utils";
import {FilterType} from "../models/table-models";

@Injectable({
  providedIn: 'root'
})
export class RowDataService {

  private _originalTableRows: any[] = [];
  private _actualTableRows: any[] = [];

  private _tableRowDataSubject: BehaviorSubject<any> = new BehaviorSubject([]);
  public tableRowData$: Observable<any> = this._tableRowDataSubject.asObservable();

  private _hasDataSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public hasData$: Observable<boolean> = this._hasDataSubject.asObservable();

  private _selectedRowDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public selectedRowData$: Observable<any> = this._selectedRowDataSubject.asObservable();

  setTableRowData(tableData: any[]): void {
    this._actualTableRows = [...tableData];
    this._tableRowDataSubject.next(tableData);
    this._hasDataSubject.next(tableData.length > 0);
  }

  setOriginalRowData(originalData: any[]): void {
    this._originalTableRows = originalData;
  }

  setSelectedRowData(rowIndex: number) {
    this._selectedRowDataSubject.next(this._actualTableRows[rowIndex]);
  }

  sortTableRows(columnIndex: number, direction: 'asc' | 'desc' | undefined) {
    if (direction === undefined) {
      this.setTableRowData([...this._originalTableRows]);
      return;
    } else {
      this.setTableRowData(sortTableRows([...this._actualTableRows], columnIndex, direction));
    }
  }

  filterTableRows(columnIndex: number, filterValue: string, filterType: FilterType) {
    if (!filterValue && columnIndex === -1) {
      // it runs when the filter is cleared or toggle between filter inputs
      return;
    } else if (columnIndex === -1) {
      return;
    }

    let filteredTableRows: any[];

    switch (filterType) {
      case FilterType.Contains:
        filteredTableRows = this._originalTableRows.filter((row: any) =>
          row[columnIndex].toString().toLowerCase().includes(filterValue.toLowerCase())
        );
        break;
      case FilterType.StartWith:
        filteredTableRows = this._originalTableRows.filter((row: any) =>
          row[columnIndex].toString().toLowerCase().startsWith(filterValue.toLowerCase())
        );
        break;
      case FilterType.EndWith:
        filteredTableRows = this._originalTableRows.filter((row: any) =>
          row[columnIndex].toString().toLowerCase().endsWith(filterValue.toLowerCase())
        );
        break;
      case FilterType.NotContains:
        if (!filterValue) {
          return this.setTableRowData(this._originalTableRows);
        }
        filteredTableRows = this._originalTableRows.filter((row: any) =>
          !row[columnIndex].toString().toLowerCase().includes(filterValue.toLowerCase())
        );
        break;
      default:
        return;
    }
    this.setTableRowData(filteredTableRows);
  }
}
