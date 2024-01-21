import {Routes} from '@angular/router';
import {SimpleGridComponent} from "./simple-grid-page/simple-grid.component";
import {GridComponent} from "./grid-page/grid.component";

export const routes: Routes = [

  {path: 'simple-grid', component: SimpleGridComponent},
  {path: 'grid', component: GridComponent},
  // default route
  {path: '', redirectTo: '', pathMatch: 'full'}
];
