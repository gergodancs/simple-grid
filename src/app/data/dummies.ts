import {TableProps} from "../table/models/table-models";

export const dummyData = [
  {id: 1, name: {firstName: "John"}, age: 25, city: 'New York', country: 'USA', occupation: 'Engineer'},
  {id: 2, name: {firstName: "Doe"}, age: 30, city: 'San Francisco', country: 'USA', occupation: 'Designer'},
  {id: 3, name: {firstName: "Bob"}, age: 28, city: 'Chicago', country: 'USA', occupation: 'Developer'},
  {id: 4, name: {firstName: "Eve"}, age: 22, city: 'Los Angeles', country: 'USA', occupation: 'Manager'},
  {id: 5, name: {firstName: "Charlie"}, age: 35, city: 'London', country: 'UK', occupation: 'Artist'},
  {id: 6, name: {firstName: "David"}, age: 32, city: 'Paris', country: 'France', occupation: 'Chef'},
  {id: 7, name: {firstName: "Sophie"}, age: 27, city: 'Berlin', country: 'Germany', occupation: 'Scientist'},
  {id: 8, name: {firstName: "Mia"}, age: 29, city: 'Tokyo', country: 'Japan', occupation: 'Writer'},
];
export const  columnInitializer: TableProps = {
  onRowSelected: (data: any) => console.log(data),
  columns: [
    {
      field: 'id',
      header: 'id',
      width: 50
    },
    {
      field: 'name',
      header: 'name',
      width: 150,
      sortable:true,
      sortDirection: 'asc',
      sortBy: 'name',
      valueSetter: (data: any) => data.firstName
    },
    {
      field: 'age',
      header: 'age',
      width: 50,
      sortable:true,
    },
    {
      field: 'city',
      header: 'city',
      sortable:true,
      width: 200
    },
    {
      field: 'country',
      header: 'country',
      width: 100
    },
    {
      field: 'occupation',
      header: 'occupation',
      width: 200
    }
  ]
};

export const dummyData2 = [
  {id:1, name: "panka", age: 25, city: "New York", country: "USA"},
  {id:2, name: "gergo", age: 2, city: "bp", country: "mo"}
]

export const columnInitializer2: TableProps = {
  columns: [
    {field: "id", header: "ID", width: 100},
    {field: "name", header: "NAME", width: 100},
    {field: "age", header: "Age", width: 100},
    {field: "city", header: "City", width: 100},
    {field: "country", header: "Country", width: 100},
  ]
}
