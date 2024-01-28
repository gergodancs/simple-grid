import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";
import {TableComponent} from "../../table/components/base-table/base-table.component";
import {columnInitializer, dummyData} from "../../data/dummies";


@Component({
  selector: 'd-grid',
  templateUrl: 'grid.component.html',
  styleUrls: ['grid.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, TableComponent],
})
export class GridComponent {
  dummyData = dummyData;
  columnInitializer = columnInitializer;
}
