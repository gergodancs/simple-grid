import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TableComponent} from "./table/components/base-table/base-table.component";
import {MatTabsModule} from "@angular/material/tabs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TableComponent, MatTabsModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
