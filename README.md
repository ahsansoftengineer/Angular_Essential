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
    this._activeId = this._activeRoute.snapshot.paramMap.get('id');
    if (this._activeId) {
      this.patchData();
    }
  }
```
### Initializing Form
> * Adding Customization on Startup
```javascript
  initForm() {
    this._form = this._fb.group({
      law: ['', this._validator('Law', 1, 4, 100)],
      address: ['', this._validator('Address', 1, 4, 100)],
      is_deposit: ['1', this._validator('Deposit', 1, 4, 100)],
      customization: this._fb.array([this.customization()]),
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
      if(data.customization.length > 0)
        this.patchCustomization(data.customization);
    });
  }
```
### TS Changes to Implement Form Array
#### 1 Customization (Initialization)
> * Adding No Repeat Validator
```javascript
  // 
  customization(): FormGroup {
    return this._fb.group(
      {
        organisation_id: ['', this._validator('Organization', 0)],
        system_id: ['', this._validator('System', 0)],
        prefix: ['', this._validator('Prefix')],
      },
      {
        validators: this._groupValidator(
          'organisation_id',
          'system_id',
          'customization'
        ),
      }
    );
  }
```
#### 2 Customization (Template Iteration)
```javascript
  get customizations() {
    return this._form?.get('customization') as FormArray;
  }
```
#### 4 Customization (Removing)
```javascript
  rmvCustom(index: number) {
    let arrayz = <FormArray>this._form.get('customization');
    arrayz.removeAt(index);
  }
```
#### 5 Customization (Patching)
> * Patching Customization is Conditionally
> * If Customization is exsist then remove the default that is proved
```javascript
  patchCustom(
    customization: {
      organisation_id: string;
      system_id: string;
      prefix: string;
    }[]
  ) {
    let formArray = this._form.get('customization') as FormArray;
    if(customization.length > 0)
      formArray.clear();
    customization.forEach((custom) => {
      formArray.push(
        this._fb.group({
          organisation_id: custom.organisation_id,
          system_id: custom.system_id,
          prefix: custom.prefix,
        })
      );
    });
  }
```
#### Validate Duplicate Form Array
> * Currently This Validator is only Working on 2 Fields
> * But this Validator can Extends as Required
```javascript
  // Stop Duplication of FormGroup in FormArray
  _groupValidator(field1: string, field2: string, arrayName: string) {
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
#### Customization Template
> * Conditionally (Add / Remove) is Conditionally (Hide / Show)
```html
<div class="col-12">
  <div formArrayName="customization">
    <div class="row mb-4" *ngFor="let item of customizations.controls;
    let i = index" [formGroupName]="i">
      <div class="col-md-3 p-0">
        <mat-form-field appearance="outline" class="col-md-12">
          <mat-label>Organaization</mat-label>
          <mat-select formControlName="organisation_id" required>
            <mat-option *ngFor="let it of __ddl?.organisation_id" [value]="it.id">
              {{ it.title }}
            </mat-option>
          </mat-select>
          <mat-error>{{ _error_FormArray(item, 'organisation_id')?.message }}</mat-error>
        </mat-form-field>
      </div>
      <div class="col-md-3 p-0">
        <mat-form-field appearance="outline" class="col-md-12">
          <mat-label>System</mat-label>
          <mat-select formControlName="system_id" required>
            <mat-option *ngFor="let it of __ddl?.system_id" [value]="it.id">
              {{it.title}}
            </mat-option>
          </mat-select>
          <mat-error>{{ _error_FormArray(item, 'system_id')?.message }}</mat-error>
        </mat-form-field>
      </div>
      <div class="col-md-3 p-0">
        <mat-form-field appearance="outline" class="col-md-12">
          <mat-label>Prefix</mat-label>
          <input matInput type="text" formControlName="prefix">
          <mat-error>
            {{ _error_FormArray(item, 'prefix')?.message }}
          </mat-error>
        </mat-form-field>
      </div>
      <div class="col-md-3 p-0">
        <div class="col-md-12 d-flex justify-content-lg-start justify-content-sm-end">
          <button type="button" [disabled]="!(customizations.length > 1)"
            class="btn btn-sm btn-outline-danger my-2" (click)="rmvCustom(i)">Remove</button>
          <button type="button"
            [disabled]="!(item.valid && _form.get('customization').valid && customizations?.length == (i + 1))"
            [ngStyle]="{'display':customizations?.length == (i + 1)? 'inline' : 'none'}"
            class="btn btn-sm btn-outline-info my-2" (click)="addCustom()">Add</button>
        </div>
      </div>
    </div>
  </div>
</div>
```
#### Error Message Display
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