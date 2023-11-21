import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {TableProps} from "../models/table-models";

@Injectable({
  providedIn: 'root'
})
export class TableDataService {
  private tableRowDataSubject: BehaviorSubject<any> = new BehaviorSubject([]);
  public  tableRowData$: Observable<any>= this.tableRowDataSubject.asObservable();

  private selectedRowSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public selectedRow$: Observable<any> = this.selectedRowSubject.asObservable();

  private columnToSortSubject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public columnToSort$: Observable<number> = this.columnToSortSubject.asObservable();

  private headerLengthSubject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public headerLength$: Observable<number> = this.headerLengthSubject.asObservable();

  private columnToFilterSubject: BehaviorSubject<number> = new BehaviorSubject<number>(-1);
  public columnToFilter$: Observable<number> = this.columnToFilterSubject.asObservable();

  private tableHeaderSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public tableHeader$: Observable<string[]> = this.tableHeaderSubject.asObservable();

  private columnInitializerSubject: BehaviorSubject<TableProps> = new BehaviorSubject<TableProps>({columns:[]});
  public columnInitializer: Observable<TableProps> = this.columnInitializerSubject.asObservable();

  private filterValueSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public filterValue$: Observable<string> = this.filterValueSubject.asObservable();

  private hasDataSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public hasData$: Observable<boolean> = this.hasDataSubject.asObservable();

  private selectedRowDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>({});
  public selectedRowData$: Observable<any> = this.selectedRowDataSubject.asObservable();
  constructor() {}

  setSelectedRowData(rowIndex:number){
    this.selectedRowDataSubject.next(this.tableRowDataSubject.getValue()[rowIndex]);
  }
  setFilterValue(filterValue: string) {
    this.filterValueSubject.next(filterValue);
  }

  setColumnToFilter(columnIndex: number): void {
    this.columnToFilterSubject.next(columnIndex);
  }
  setColumnInitializer(columnInitializer: TableProps): void {
    this.columnInitializerSubject.next(columnInitializer);
  }

  setColumnToSort(columnIndex: number): void {
    this.columnToSortSubject.next(columnIndex);
  }
  setTableHeader(tableHeader: string[]): void {
    this.tableHeaderSubject.next(tableHeader);
    this.headerLengthSubject.next(tableHeader.length);
  }
  setTableRowData(tableData:any[]):void {
    this.tableRowDataSubject.next(tableData);
    this.hasDataSubject.next(tableData.length > 0);
  }
  setSelectedRow(data: any): void {
    this.selectedRowSubject.next(data);
  }
}
