## Base Form DropDown
> * Base Form Drop Down Class has responsibility to provide all the feature related to Select Option in Dropdown
> 1. Load DropDown (Select Option)
> 2. Load Sub Entity (Country, State, City)
> 3. Load MultiSelect Option Hobies (Football, Computer, Journey)

## Imports
```javascript
import { Injectable, Injector } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import { URLz } from './base.enum';
import { BaseForm } from './base.form';
import { Custom } from './custom';
```
## Constructor / Properties
> * Must hava these properties
> 1. _ddIncrement
> * * Counting Dropdown Loaded First
> 2. __totalDropdown 
> * * for Stoping Event Propagation after first Initialized
> 3. __ddl: any = {};
> * * Centrailized all Dropdown part of single property
> 4. _resetSubscription()
> * * For Unsubscribing 

```javascript
@Injectable({
  providedIn: 'root',
})
export class BaseFormDropDown extends BaseForm {
  constructor(protected injector: Injector) {
    super(injector);
  }
  // All DropDown List will be Part of this Property
  _ddIncrement: number = 0;
  __totalDropdown = 0;
  __ddl: any = {};
  _resetSubscription() {}
```
## Drop Down Loading
> 1. Independent Dropdowns Loading Data
```javascript
  _dropdown(url: URLz, code: string = '') {
    return Custom._dropdown(url, code, this._service);
  }
```
## MultiSelect
> 1. Mutliple Selection Dropdown
> 2. Would be modified in Next Phase
```javascript
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
```

## Dependendent Dropdown
> 1. Hiarchycal Dropdown Loading Based on Events of Parent Dropdown
> 2. Switch case is for Empty field if user change pagrent
> 3. Switch Case is not utilizing for other dropdowns
```javascript
_loadSubEntity(entity: URLz, code: string, event: MatOptionSelectionChange) {
    this.__loadingSubDropDown++;
    if (
      event?.isUserInput ||
      (this._activeId && this.__totalDropdown >= this.__loadingSubDropDown)
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
```


```javascript 

```