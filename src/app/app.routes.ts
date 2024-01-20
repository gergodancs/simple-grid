import {Routes} from '@angular/router';
import {SimpleGridComponent} from "./simple-grid/simple-grid.component";
import {GridComponent} from "./grid/grid.component";

export const routes: Routes = [

  {path: 'simple-grid', component: SimpleGridComponent},
  {path: 'grid', component: GridComponent},
  // default route
  {path: '', redirectTo: '', pathMatch: 'full'}
];
