import {Routes} from '@angular/router';
import {SimpleGridComponent} from "./pages/simple-grid-page/simple-grid.component";
import {GridComponent} from "./pages/grid-page/grid.component";
import {CreateGridComponent} from "./pages/create-grid-page/create-grid.component";

export const routes: Routes = [

  {path: 'simple-grid', component: SimpleGridComponent},
  {path: 'grid', component: GridComponent},
  {path: 'create-grid', component: CreateGridComponent},
  // default route
  {path: '', redirectTo: '', pathMatch: 'full'}
];
