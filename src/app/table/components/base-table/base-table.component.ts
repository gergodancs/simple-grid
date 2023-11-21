import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {createMapFromTableData} from "../../utils/utils";
import {ReactiveFormsModule} from "@angular/forms";
import {TableProps} from "../../models/table-models";
import {createSimpleTable, initTableHeaders} from "../../utils/init-utils";
import {applySortBySortProp, applySorting, determineSortDirection} from "../../utils/sorting-utils";
import {TableDataService} from "../../service/table-service";
import {map, Observable, Subject, Subscription, switchMap, takeUntil} from "rxjs";
import {TableHeaderComponent} from "./table-header/table-header.component";
import {TableBodyComponent} from "./table-body/table-body.component";


@Component({
    selector: 'd-table',
    standalone: true,
    imports: [CommonModule, RouterOutlet, ReactiveFormsModule, TableHeaderComponent, TableBodyComponent],
    templateUrl: './base-table.component.html',
    styleUrls: ['./base-table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {
    mappedData: any[] = [];
    currentSort: { column: string, direction: 'asc' | 'desc' | undefined } = {column: '', direction: 'asc'};
    @Input()
    columnInitializer!: TableProps;
    @Input()
    tableData: any;
    originalTableData: any;
    private _columnToSort$: Observable<number> = this.service.columnToSort$;
    private _columnToFilter$: Observable<number> = this.service.columnToFilter$;
    private _filterValue$: Observable<string> = this.service.filterValue$;
    private _ngUnsubscribe: Subject<void> = new Subject<void>();
    private _cashedTableRows: any[] = [];
    private _sortSubscription: Subscription | undefined;
    private _filterSubscription$ = this._columnToFilter$.pipe(
        switchMap((columnIndex) => {
            return this._filterValue$.pipe(
                map((filterValue: string) => {
                    if (filterValue === '' && columnIndex === -1) {
                        // it runs when the filter is cleared or toggle between filter inputs
                        return;
                    } else if (columnIndex === -1) {
                        return;
                    } else {
                        let filteredTableRows = this._cashedTableRows.filter((row: any) => {
                            console.log(columnIndex)
                            return row[columnIndex].toString().toLowerCase().includes(filterValue.toLowerCase());
                        });
                        this.service.setTableRowData(filteredTableRows);
                    }
                }),
                takeUntil(this._ngUnsubscribe),
            );
        })
    );

    constructor(private service: TableDataService) {
    }

    ngOnInit(): void {
        if (this.tableData && this.tableData.length > 0) {
            this.originalTableData = [...this.tableData];
            this.service.setTableHeader(initTableHeaders(this.columnInitializer));
            this.service.setColumnInitializer(this.columnInitializer);
            this.service.setTableRowData(createSimpleTable(this.tableData, this.columnInitializer));
            this._cashedTableRows = [...createSimpleTable(this.tableData, this.columnInitializer)];
            this.mappedData = createMapFromTableData(this.tableData);
            this._sortSubscription = this._columnToSort$.subscribe((columnIndex: number) => {
                if (columnIndex !== -1) {
                    this._sortData(columnIndex);
                }

            });
            this._filterSubscription$.subscribe();
        } else {
            this.service.setTableHeader(initTableHeaders(this.columnInitializer));
        }
    }

    ngOnDestroy(): void {
        this._sortSubscription?.unsubscribe();
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }

    private _sortData(columnIndex: number) {
        const {currentSort, currentColumn} = determineSortDirection(this.currentSort, this.columnInitializer, columnIndex);
        this.currentSort = currentSort
        this.tableData = !currentColumn.sortBy ?
            applySorting(currentColumn, [...this.tableData]) :
            applySortBySortProp(currentColumn, [...this.tableData]);
        this.service.setTableRowData(createSimpleTable([...this.tableData], this.columnInitializer));
        this._cashedTableRows = [...createSimpleTable([...this.tableData], this.columnInitializer)];
        this.mappedData = createMapFromTableData([...this.tableData]);
    }
}
