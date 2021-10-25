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

// In Base Class append all the properties / methods with _ (underscore)
export abstract class BaseForm<T> extends BaseFormValidator {
  public _activeId: string;
  public _leaveFormActivated = false;
  protected _pathLocation: string;
  protected _activeRoute: ActivatedRoute;
  protected _router: Router;
  public _service: BaseService<T>;
  public URLz = URLz
  constructor(public injector: Injector){
    super(injector);
    this._service =  injector.get(BaseService);
    this._service.url = environment.API_URL;
    this._activeRoute = injector.get(ActivatedRoute);
    this._router = injector.get(Router);
  }
  _onSubmit(param = '', idz = 'id') {
    this._form.markAllAsTouched();
    this._submitted = true;
    this._leaveFormActivated = false;
    if (this._form.valid) {
      this._isFormValid = true;
      // Object.keys(this._form.value).forEach((key) => (this._form.value[key] == '') && delete this._form.value[key]);
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
          // .then((res) => {
          //   console.log(res);

          //   this._leaveFormActivated = true;
          //   this._switch();
          // });
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
  _switch() {
    // this._form.reset();
    this._router.navigate([this._pathLocation]);
  }
}
