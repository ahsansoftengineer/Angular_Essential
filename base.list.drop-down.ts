import { Injectable, Injector } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { URLz } from './base.enum';
import { BaseForm } from './base.form';
import { BaseList } from './base.list';
import { Custom } from './custom';

@Injectable({
  providedIn: 'root',
})
export class BaseListDropDown extends BaseList  {
  constructor(public injector: Injector) {
    super(injector);
  }
  __ddl: any = {};
  __resetSubscription() {}
  _dropdown(url: URLz, code: string = '') {
    return Custom._dropdown(url, code, this._service)
  }
  _loadSubEntity(entity: URLz, code:any): any{
    Custom.loadSubEntity(entity, code, this.__ddl, this._service)
  }
}
