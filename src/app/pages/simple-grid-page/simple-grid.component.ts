import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {columnInitializer2, dummyData, dummyData2} from "../../data/dummies";
import {TableComponent} from "../../table/components/base-table/base-table.component";


@Component({
  selector: 'd-simple-table',
  templateUrl: 'simple-grid.component.html',
  styleUrls: ['simple-grid.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, TableComponent],
})
export class SimpleGridComponent {
  dummyData = dummyData2;
  columnInitializer = columnInitializer2;
}
