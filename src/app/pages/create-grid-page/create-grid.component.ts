import {Component, signal, WritableSignal} from "@angular/core";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgStyle} from "@angular/common";
import {TableProps} from "../../table/models/table-models";
import {TableComponent} from "../../table/components/base-table/base-table.component";

@Component({
  selector: 'd-create-grid',
  templateUrl: 'create-grid.component.html',
  styleUrls: ['create-grid.component.scss'],
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    TableComponent,
    NgStyle
  ]
})
export class CreateGridComponent {

  headerFormGroup: FormGroup = this.fb.group({
    formArray: this.fb.array([])
  });
  rowFormGroup: FormGroup = new FormGroup<any>({});
  dataSignal: WritableSignal<Array<{}>> = signal([]);
  columnInitializer: TableProps = {
    columns: []
  }

  constructor(private fb: FormBuilder) {
  }

  get formArray() {
    return this.headerFormGroup.get('formArray') as FormArray;
  }

  addInputField() {
    const group = this.fb.group({
      header: '',
      width: ''
    });
    this.formArray.push(group);
  }

  createRowData() {
    const rowValues = this.rowFormGroup?.getRawValue();
    const headerValues = this.headerFormGroup.getRawValue();
    let result: any = {};
    headerValues.formArray.forEach((value: any, index: number) => {
      result[value.header] = rowValues[index];
    });
    this.dataSignal.update(prev => [...prev, result]);
    this._resetRowForm();
  }

  createColumnInitializer() {
    let columns: any = [];
    const headerForm = this.headerFormGroup.getRawValue();
    headerForm.formArray.forEach((group: any) => {
      let prop = {
        header: group.header,
        field: group.header,
        width: Number(group.width)
      };
      columns.push(prop);
    });
    this._createNewRowForm();
    this.columnInitializer.columns = columns;

  }

  hasErrorsInRowForm(): boolean {
    return Object.keys(this.rowFormGroup.controls)
      .some(key => this.rowFormGroup?.get(key)?.errors !== null);
  }

  fieldIsInvalid(i: number) {
    return this.rowFormGroup.controls[i].invalid
      && (this.rowFormGroup.controls[i].dirty
        || this.rowFormGroup.controls[i].touched)
  }

  private _resetRowForm() {
    this.rowFormGroup.reset();
  }


  private _createNewRowForm() {
    const headerForm = this.headerFormGroup.getRawValue();
    const controls: any = {};
    headerForm.formArray.forEach((_: any, index: number) => {
      controls[index] = new FormControl('', [Validators.required]);
    });
    this.rowFormGroup = this.fb.group(controls);
  }
}
