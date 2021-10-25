import { Injectable, Injector } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { URLz } from './base.enum';
import { BaseForm } from './base.form';
import { Custom } from './custom';

@Injectable({
  providedIn: 'root',
})
export class BaseFormDropDown<T> extends BaseForm<T> {
  constructor(public injector: Injector) {
    super(injector);
  }
  // All DropDown List will be Part of this Property
  _ddIncrement = 0;
  __totalDropdown = 0;
  __ddl: any = {};
  _resetSubscription() {}
  _multiSelect(event, arrayName: string) {
    let org_system = <FormArray>this._form.get(arrayName);
    let source = event.source;
    if (event.isUserInput) {
      if (source.selected) {
        org_system.push(new FormControl(source.value));
      } else {
        org_system.removeAt(
          org_system.value.findIndex((Id) => Id === source.value)
        );
      }
    }
  }
  _dropdown(url: URLz, code: string = '') {
    return Custom._dropdown(url, code, this._service);
  }
  _loadSubEntity(entity: URLz, code: string, event: MatOptionSelectionChange) {
    this._ddIncrement++;
    if (
      event?.isUserInput ||
      (this._activeId && this.__totalDropdown >= this._ddIncrement)
    ) {
      if(event?.isUserInput){
        switch (entity) {
          case URLz.LE:
            if (this._form.contains('le'))
              this._form.get('le').setValue('');
          case URLz.OU || URLz.LE:
            if (this._form.contains('ou'))
              this._form.get('ou').setValue('');
          case URLz.OU || URLz.SU || URLz.LE:
            if (this._form.contains('su'))
              this._form.get('su').setValue('');
            break;
      }
      }
      Custom.loadSubEntity(entity, code, this.__ddl, this._service);
    }
  }
}
