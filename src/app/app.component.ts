import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {TableComponent} from "./table/components/base-table/base-table.component";
import {TableProps} from "./table/models/table-models";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TableComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  dummyData = [
    {id: 1, name: 'John', age: 25, city: 'New York', country: 'USA', occupation: 'Engineer'},
    {id: 2, name: 'Alice', age: 30, city: 'San Francisco', country: 'USA', occupation: 'Designer'},
    {id: 3, name: 'Bob', age: 28, city: 'Chicago', country: 'USA', occupation: 'Developer'},
    {id: 4, name: 'Eve', age: 22, city: 'Los Angeles', country: 'USA', occupation: 'Manager'},
    {id: 5, name: 'Charlie', age: 35, city: 'London', country: 'UK', occupation: 'Artist'},
    {id: 6, name: 'David', age: 32, city: 'Paris', country: 'France', occupation: 'Chef'},
    {id: 7, name: 'Sophie', age: 27, city: 'Berlin', country: 'Germany', occupation: 'Scientist'},
    {id: 8, name: 'Mia', age: 29, city: 'Tokyo', country: 'Japan', occupation: 'Writer'},
  ];

  onRowSelected = (data: any) => console.log(data);

  columnInitializer: TableProps = {
    headers: ['id', 'name', 'age', 'city', 'country', 'occupation'],
    onRowSelected: this.onRowSelected,
    columnProps: [
      {
        field: 'id',
        header: 'id',
        width: 50
      },
      {
        field: 'name',
        header: 'name',
        width: 100
      },
      {
        field: 'age',
        header: 'age',
        width: 50
      },
      {
        field: 'city',
        header: 'city',
        width: 150
      },
      {
        field: 'country',
        header: 'country',
        width: 100
      },
      {
        field: 'occupation',
        header: 'occupation',
        width: 100
      }
    ]
  };


}
