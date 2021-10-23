## Base Form V-2
#### Imports
```typescript
import { HttpErrorResponse } from '@angular/common/http';
import { Injector } from '@angular/core';
import {
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { BaseService } from '../../service/base.service';
import { URLz } from './base.enum';
import { BaseFormValidator } from './base.form.validator';
```
#### Constructor & Inheritence
1. Base Form will Inherit From Base Form Validator
> * Properties Provided by Base Validator
> * *_form*
> * *_validator* for Reactive form Validator 
> * etc...
2. Base Form Properties
> * Created Properties and Methods here so we don't have to repeat in Form
> * *_activeId* -> To Store ID in Update Case
> * *_leaveFormActivated* -> For Router Guard
> * *_pathLocation* -> Path of List Component Stored here
2. Base Form Services
> * *_activeRoute*
> * *_router* 
> * *_service* -> Base Service Needs Modification
3. URLz Property will be Utilized by Template of Inherited Form
> * *URLz* = URLz
> * Because Enums can not be Utlized in Template
```javascript
// In Base Class append all the properties / methods with _ (underscore)
export abstract class BaseForm extends BaseFormValidator {
  public _activeId: string;
  public _leaveFormActivated = false;
  protected _pathLocation: string;
  protected _activeRoute: ActivatedRoute;
  protected _router: Router;
  public _service: BaseService<any> // Service Should be shifted Super Form
  public URLz = URLz
  constructor(protected injector: Injector){
    super(injector);
    // this._service.url = environment.API_URL;
    this._activeRoute = injector.get(ActivatedRoute);
    this._router = injector.get(Router);
  }
}
```
#### OnSubmit is being Utlized by Child Forms
> * This Method is only for Simple FormGroup
```javascript
_onSubmit(param = '', idz = 'id') {
    this._form.markAllAsTouched();
    this._submitted = true;
    this._leaveFormActivated = false;
    if (this._form.valid) {
      this._isFormValid = true;
      let modify: Observable<any>;
      if (this._activeId) {
        this._form.addControl(idz, new FormControl(this._activeId));
        modify = this._service.update(this._form.value, param);
      } else {
        modify = this._service.create(this._form.value, param);
      }
      modify.subscribe(
        (res: any) => {
          Swal.fire(this._activeId ? 'Updated!' : 'Created!', res.message)
        },
        (httpErrorResponse: HttpErrorResponse) => {
          this._error_server(httpErrorResponse.error);
        }
      );
      this._submitted = false;
    } else {
      return (this._isFormValid = false);
    }
  }
```
#### onSubmit Override
> * This onSubmit is for formData
> * For Overriding Files
```javascript
_onSubmit(id: string = 'id') {
    this._form.markAllAsTouched()
    this._submitted = true;
    let fd = new FormData();
    if((!this.imgFooter.link || !this.imgLogo.link
      || !this.imgTop.link || !this.imgWarn.link)){
        return this._isFormValid = false
    } else if (this.imgFooter.error || this.imgLogo.error ||
        this.imgTop.error || this.imgWarn.error){
          return this._isFormValid = false
    }
    if (this.imgLogo.file) fd.append('logo', this.imgLogo.file);
    if (this.imgTop.file) fd.append('top_image', this.imgTop.file);
    if (this.imgWarn.file) fd.append('warning_image', this.imgWarn.file);
    if (this.imgFooter.file) fd.append('footer_image', this.imgFooter.file);
    if (this._form.valid) {
      this._isFormValid = true;
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
#### Extra Methods
> * This Method Shouldn't be exsist
```javascript
  _switch(pathLocation = this._pathLocation) {
    this._router.navigate([pathLocation]);
  }
```