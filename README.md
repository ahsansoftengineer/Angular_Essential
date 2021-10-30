## Form Array of (Form Group)
> * In The example we are achieving the followings
> * Adding Form Group 
> * Removing Form Group 
> * Validating on Same Form Array Repetation

#### Imports
```javascript
import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { URLz } from 'src/app/model/base-classes/base.enum';
import { BaseFormDropDown } from 'src/app/model/base-classes/base.form.drop-down';
import { BaseService } from 'src/app/service/base.service';
import { environment } from 'src/environments/environment';
import { T } form 'interfaces'

@Component({
  selector: 'selector',
  templateUrl: './template.html',
})
```
#### Inheritance, Constructor & ngOnInit
> * BaseFormDropDown > BaseForm > BaseFormValidation
> * All the Properties, Methods & Services availaible in Base Classes are being Utilized
> *  ngOnInit is overriding several Properties as per need 
```javascript
export class Component extends BaseFormDropDown implements OnInit {
  constructor(injector: Injector, private ss: BaseService<T>) {
    super(injector);
    ss.url = environment.API_URL + URLz.OU_CUSTOM;
    super._service = this.ss;
  }
  ngOnInit() {
    this._pathLocation = '/path/location';
    this.initForm();
    this.initDropDown();
    this._activeId = this._activeRoute.snapshot.paramMap.get('id');
    if (this._activeId) {
      this.patchData();
    }
  }
```
### Initializing Form
> * Adding array_group on Startup
```javascript
  initForm() {
    this._form = this._fb.group({
      law: ['', this._validator('Law', 1, 4, 100)],
      address: ['', this._validator('Address', 1, 4, 100)],
      is_deposit: ['1', this._validator('Deposit', 1, 4, 100)],
      array_group: this._fb.array([this.array_group()]),
    });
  }
```
### Patching for Update
```javascript
  patchData() {
    this._service.getByCode(this._activeId).subscribe((res: any) => {
      let data: T = res.data.row;
      this._form.patchValue({
        law: data?.law,
        address: data?.address,
        is_deposit: data?.is_deposit,
      });
      if(data.array_group.length > 0)
        this.patcharray_group(data.array_group);
    });
  }
```
### Intializing Drop Downs
```javascript
  initDropDown() {
    this._dropdown(URLz.field_2).subscribe(
      (res) => (this.__ddl.field_2_id = res.data.records)
    );
    this._dropdown(URLz.ORG).subscribe(
      (res) => (this.__ddl.field_1_id = res.data.records)
    );
  }
```
### TS Changes to Implement Form Array
#### 1 array_group (Initialization)
> * Adding No Repeat Validator
```javascript
  // 
  array_group(): FormGroup {
    return this._fb.group(
      {
        field_1_id: ['', this._validator('Organization', 0)],
        field_2_id: ['', this._validator('field_2', 0)],
        field_3: ['', this._validator('field_3')],
      },
      {
        validators: this._duplicate_FormArray_FormGroup_Validator(
          'field_1_id',
          'field_2_id',
          'array_group'
        ),
      }
    );
  }
```
#### 2 array_group (Template Iteration)
```javascript
  get array_groups() {
    return this._form?.get('array_group') as FormArray;
  }
```
#### 4 array_group (Removing)
```javascript
  rmvCustom(index: number) {
    let arrayz = <FormArray>this._form.get('array_group');
    arrayz.removeAt(index);
  }
```
#### 5 array_group (Patching)
> * Patching array_group is Conditionally
> * If array_group is exsist then remove the default that is proved
```javascript
  patchCustom(
    array_group: {
      field_1_id: string;
      field_2_id: string;
      field_3: string;
    }[]
  ) {
    let formArray = this._form.get('array_group') as FormArray;
    if(array_group.length > 0)
      formArray.clear();
    array_group.forEach((custom) => {
      formArray.push(
        this._fb.group({
          field_1_id: custom.field_1_id,
          field_2_id: custom.field_2_id,
          field_3: custom.field_3,
        })
      );
    });
  }
```
#### 6 Validate Duplicate Form Array
> * Currently This Validator is only Working on 2 Fields
> * But this Validator can Extends as Required
```javascript
  // Stop Duplication of FormGroup in FormArray
  _duplicate_FormArray_FormGroup_Validator(field1: string, field2: string, arrayName: string) {
    return (
      group: FormGroup
    ): {
      [key: string]: { key: string; message: string };
    } | null => {
      let msgDuplicate = {
        ERROR: {
          key: 'Duplicate',
          message: 'Duplicate Selection Not Allowed',
        },
      };
      let fieldA = group?.get(field1);
      let fieldB = group?.get(field2);
      let result = this._form?.get(arrayName)?.value;
      let repeat = 0;
      result?.forEach((item) => {
        if (item[field1] == fieldA.value && item[field2] == fieldB.value)
          repeat++;
      });
      if (repeat > 1) {
        fieldA.setErrors(msgDuplicate);
        fieldB.setErrors(msgDuplicate);
        return msgDuplicate;
      } else if(fieldA.value !== ''){
        fieldA.setErrors(null);
      } else if(fieldB.value !== ''){
        fieldB.setErrors(null);
        return null};
    };
  }

```
#### 7 Error Message Display
> * This Validator for Both
> 1. Fields Error
> 2. Group Duplicate Value Error
> 3. Could also display other errors like (min, max etc...)
```javascript
  _error_FormArray(internalGroup: FormGroup, control: string){
    let controlz = internalGroup?.get(control)
    if (controlz?.errors) {
      return controlz.errors['ERROR']
    } else return null
  }
```
#### 8 array_group Template
> * Conditionally (Add / Remove) is Conditionally (Hide / Show)
```html
<div class="col-12">
  <div formArrayName="array_group">
    <div class="row mb-4" *ngFor="let item of array_groups.controls;
    let i = index" [formGroupName]="i">
      <div class="col-md-3 p-0">
        <mat-form-field appearance="outline" class="col-md-12">
          <mat-label>field_1</mat-label>
          <mat-select formControlName="field_1_id" required>
            <mat-option *ngFor="let it of __ddl?.field_1_id" [value]="it.id">
              {{ it.title }}
            </mat-option>
          </mat-select>
          <mat-error>{{ _error_FormArray(item, 'field_1_id')?.message }}</mat-error>
        </mat-form-field>
      </div>
      <div class="col-md-3 p-0">
        <mat-form-field appearance="outline" class="col-md-12">
          <mat-label>field_2</mat-label>
          <mat-select formControlName="field_2_id" required>
            <mat-option *ngFor="let it of __ddl?.field_2_id" [value]="it.id">
              {{it.title}}
            </mat-option>
          </mat-select>
          <mat-error>{{ _error_FormArray(item, 'field_2_id')?.message }}</mat-error>
        </mat-form-field>
      </div>
      <div class="col-md-3 p-0">
        <mat-form-field appearance="outline" class="col-md-12">
          <mat-label>field_3</mat-label>
          <input matInput type="text" formControlName="field_3">
          <mat-error>
            {{ _error_FormArray(item, 'field_3')?.message }}
          </mat-error>
        </mat-form-field>
      </div>
      <div class="col-md-3 p-0">
        <div class="col-md-12 d-flex justify-content-lg-start justify-content-sm-end">
          <button type="button" [disabled]="!(array_groups.length > 1)"
            class="btn btn-sm btn-outline-danger my-2" (click)="rmvCustom(i)">Remove</button>
          <button type="button"
            [disabled]="!(item.valid && _form.get('array_group').valid && array_groups?.length == (i + 1))"
            [ngStyle]="{'display':array_groups?.length == (i + 1)? 'inline' : 'none'}"
            class="btn btn-sm btn-outline-info my-2" (click)="addCustom()">Add</button>
        </div>
      </div>
    </div>
  </div>
</div>
```
