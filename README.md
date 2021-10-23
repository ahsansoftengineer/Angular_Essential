## Form Data Implementation
> 1. This Form is an example of Uploading Images on Server using Form Data
> 2. 

#### Imports
```javascript
import { Component, Injector, OnInit} from '@angular/core';
import { FormControl } from '@angular/forms';
import { URLz } from 'src/app/model/base-classes/base.enum';
import { Custom } from 'src/app/model/base-classes/custom';
import { ImgType } from 'src/app/model/interface/img-type';
import { BaseService } from 'src/app/service/base.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
```
#### 1. Constructor and Services
```javascript
@Component({
  selector: 'app-ou-add',
  templateUrl: './ou-add.component.html',
  styleUrls: ['./ou-add.component.css'],
})
export class Component extends BaseForm implements OnInit {
  constructor(
    public injector: Injector, 
    public ss: BaseService<T>) {
    super(injector);
    ss.url = environment.API_URL + URLz.OU_CUSTOM;
    super._service = ss;
  }
}
```
#### 2. ngOnInit Life Cycle Hook
```javascript
  ngOnInit() {
    this._pathLocation = '/path/location';
    this.initForm();
    this._activeId = this._activeRoute.snapshot.paramMap.get('id');
    if (this._activeId) {
      this.patchData();
    }
  }
```

#### 3. Initializing Form
> * At the of Initializing Form Doesn't has the Image Property
> * Because we are going to Submit the FormData to Server
```javascript
  initForm() {
    this._form = this._fb.group({
      law: ['', this._validator('Law', 1, 4, 100)],
      address: ['', this._validator('Address', 1, 4, 100)],
      is_deposit: ['1', this._validator('Deposit', 1, 4, 100)],
    });
  }
```

#### 4. Patch Data Method
```javascript
  patchData() {
    this._service.getByCode(this._activeId).subscribe((res: any) => {
      let data: OperatingUnit = res.data.row;
      this._form.patchValue({
        law: data?.law,
        address: data?.address,
        is_deposit: data?.is_deposit,
      });
      this.imgLogo.link =  data.logo;
      this.imgTop.link = data.top_image ;
      this.imgWarn.link = data.warning_image;
      this.imgFooter.link = data.footer_image;
    });
  }
```
#### Image Type Interface
> * May be Size will also needs to be Included
```javascript
export interface ImgType {
  link?: any;
  file?: File;
  name?: string;
  display?: string;
  error?: boolean;
}
```
```javascript
  // Images Access
  imgTop: ImgType = {display: 'Top Image'};
  imgLogo: ImgType  = {display: 'Logo Image'} ;
  imgWarn: ImgType = {display: 'Warning Image'} ;
  imgFooter: ImgType = {display: 'Footer Image'} ;
  imgPath: string = 'assets/images/select.png';
  readUrl(event: any, imgType: ImgType) {
   Custom.imageSelector(event, imgType)
  }
```
#### Json to Form Data Converter Method
> 1. Required three properties
> * Json Object / Form Group
> * Parent Key -> If you want to append the Form Data to Specific Key in Object
> * Carry Form Data -> Passing Reference Type
```javascript
public static jsontoFormData(jo: Object, pk = '' cfd: FormData): FormData {
    const fd = cfd || new FormData();
    let index = 0;
    for (var key in jo) {
      if (jo.hasOwnProperty(key)) {
        if (jo[key] !== null && jo[key] !== undefined) {
          var propName = pk || key;
          if (pk && this.isObject(jo)) {
            propName = pk + '[' + key + ']';
          }
          if (pk && this.isArray(jo)) {
            propName = pk + '[' + index + ']';
          }
          if (jo[key] instanceof File) {
            fd.append(propName, jo[key]);
          } else if (jo[key] instanceof FileList) {
            for (var j = 0; j < jo[key].length; j++) {
              fd.append(propName + '[' + j + ']', jo[key].item(j));
            }
          } else if (this.isArray(jo[key]) || this.isObject(jo[key])) {
            this.jsontoFormData(jo[key], propName, formData);
          } else if (typeof jo[key] === 'boolean') {
            fd.append(propName, +jo[key] ? '1' : '0');
          } else {
            fd.append(propName, jo[key]);
          }
        }
      }
      index++;
    }
    return fd;
  }
```
#### OnSubmit Method
> 1. Here we have to Override the OnSubmit due to Form Data
> 2. Action to Perform
> * markAllAsTouched
> * _submitted for Image Validation
> * validate All Images
```javascript
  _onSubmit(id: string = 'id') {
    this._form.markAllAsTouched()
    this._submitted = true;
    let fd = new FormData();
    // Validating Images
    if ((!this.imgFooter.link || !this.imgLogo.link
      || !this.imgTop.link || !this.imgWarn.link)){
        return this._isFormValid = false
    }else if (this.imgFooter.error || this.imgLogo.error ||
      this.imgTop.error || this.imgWarn.error){
        return this._isFormValid = false
    }
    // If Images already exsist then don't add them to Server
    // Incase of Update
    if (this.imgLogo.file) fd.append('logo', this.imgLogo.file);
    if (this.imgTop.file) fd.append('top_image', this.imgTop.file);
    if (this.imgWarn.file) fd.append('warning_image', this.imgWarn.file);
    if (this.imgFooter.file) fd.append('footer_image', this.imgFooter.file);
    if (this._form.valid) {
      this._isFormValid = true;
      // Submitting Form to Server
      if (this._activeId) {
        this._form.addControl(id, new FormControl(this._activeId));
        Custom.jsontoFormData(this._form.value, '', fd);
        this._service.update(fd).subscribe(
          (res: any) => {
            Swal.fire('Updated!', res.message);
            this._switch();
          },
          (httpErrorResponse: HttpErrorResponse) => {
            this._error_server(httpErrorResponse.error);
          }
        );;
      }
      this._submitted = false;
    } else {
      return (this._isFormValid = false);
    }
  }
```
#### Template Implementation of Image Upload
```html
<form [formGroup]="_form" (ngSubmit)="_onSubmit()" autocomplete="off">
  <div class="row card-body">
    <div class="col-md-4 p-0">
      <mat-form-field appearance="outline" class="col-md-12">
        <mat-label>Law Referene</mat-label>
        <input matInput type="text" formControlName="law">
        <mat-error>
          {{ _error('law')?.message }}
        </mat-error>
      </mat-form-field>
    </div>
    <div class="col-md-8 p-0">
      <mat-form-field appearance="outline" class="col-md-12">
        <mat-label>Address</mat-label>
        <input matInput type="text" formControlName="address">
        <mat-error> {{ _error('address')?.message }}</mat-error>
      </mat-form-field>
    </div>
    <div class="col-md-12 p-0">
      <mat-slide-toggle
      formControlName="is_deposit" class="col-md-12 pt-3">
      Required Bank Cash Deposit for DCO
    </mat-slide-toggle>
      <p class="pl-3 pt-2" style="font-size: 10px; color: #f44336;">
        {{ _error('is_deposit')?.message }}
      </p>
    </div>
    <div class="col-12 pb-3">
      <div class="row">
        <div class="col-md-3">
          <p>Logo</p>
          <img alt="logo" class="img-fluid" [src]="imgLogo.link ? imgLogo.link : imgPath">
          <input class="upload-large" type="file" (change)="readUrl($event, imgLogo)">
          <p style="font-size: 10px; color: #f44336;">
            {{ _error_image(imgLogo) }}
          </p>
        </div>
        <div class="col-md-3">
          <p>Top Image</p>
          <img alt="Top Image" class="img-fluid" [src]="imgTop.link ? imgTop.link : imgPath">
          <input class="upload-large" type="file" (change)="readUrl($event,imgTop)">
          <p style="font-size: 10px; color: #f44336;">
            {{ _error_image(imgTop) }}
          </p>
        </div>
        <!-- Warn Image and Footer are also same -->
      </div>
    </div>
  </div>
  <div class="card-body">
    <div class="action-form">
      <div class="form-group m-b-0 text-right">
        <button type="submit" class="btn btn-info waves-effect waves-light">Save</button>
        <button type="button" (click)="_switch()" class="btn btn-info waves-effect waves-light">Cancel</button>
      </div>
    </div>
  </div>
</form>
```
