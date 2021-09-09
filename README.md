# Base Form
## Imports

```typescript
import { Injector } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from "rxjs/operators";
import Swal from "sweetalert2";
import { Alert } from "../interface/alert";
import { SelectOption } from "../interface/select";
import { BaseService } from "../service/base.service";
import { FakeService } from "../service/fake.service";
import { Custom } from "./custom";
```
## Declaring and Initializing Properties of Base Form
```typescript

// In Base Class append all the properties / methods with _ (underscore)
export abstract class BaseForm {
  public _activeId: string = "";
  public _form: FormGroup = Object.create(null);
  public _service: BaseService<any> | FakeService<any>; // Remove the Fake Service over deployment
  protected _submitted: boolean = false;
  protected _isFormValid: boolean = false;
  protected _alerts: Alert[] = [];
  protected _activeRoute: ActivatedRoute;
  protected _router: Router;
  protected _fb: FormBuilder;
  protected _pathLocation: string;
```
## Injecting General Services 
```typescript
  constructor(injector: Injector) {
    this._activeRoute = injector.get(ActivatedRoute);
    this._router = injector.get(Router);
    this._fb = injector.get(FormBuilder);
  }
```
## Insert / Update Methods  
```typescript
  _onSubmit() {
    this._submitted = true;
    if (this._form.valid) {
      this._isFormValid = true;
      let modify: Observable<Object>;
      if (this._form.value.id) {
        modify = this._service.update(this._form.value);
      } else {
        modify = this._service.create(this._form.value);
      }
      modify.subscribe(
        (res: any) => {
          Swal.fire(this._form.value.id ? "Updated!" : "Created!", res.message);
          this._switch();
        },
        (error) => {
          Custom.error_modify(error, this._alerts, this._isFormValid);
        }
      );
      this._submitted = false;
    } else {
      return (this._isFormValid = false);
    }
  }
  _switch() {
    this._router.navigate([this._pathLocation]);
  }
  _error(name: string): ValidationErrors {
    if (this._form?.controls[name]?.errors) {
      return this._form.controls[name].errors["ERROR"];
    } else return null;
  }
```
## Global Validator 
```typescript
  _validator(
    field_name: string = "",
    isField: number = 1,
    min: number = 0,
    max: number = 0,
    num: number = 0,
    alpha: number = 0,
    alphaNum: number = 0,
    specialChar: number = 0,
    email: number = 0,
    password: number = 0
  ) {
    return (
      control: AbstractControl
    ): {
      [key: string]: { key: string; message: string };
    } | null => {
      let a: string = control.value;
      const specialChars: RegExp = /[!~`@#$%^&*()+\=\[\]{};':"\\|,<>\/?]/;
      const Alpha: RegExp = /([a-zA-Z _-]+)$/;
      const AlphaNum: RegExp = /([a-zA-Z0-9 _-]+)$/;
      const Num: RegExp = /([0-9]+)$/;
      const Email: RegExp =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const Password: RegExp =
        /^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/;
      if (field_name != "" && a === "") {
        if (isField == 1)
          return {
            ERROR: { key: "required", message: "Please enter " + field_name },
          };
        else
          return {
            ERROR: { key: "required", message: "Please select " + field_name },
          };
      } else {
        if (min > 0 && a.length < min)
          return {
            ERROR: {
              key: "MIN",
              message: "Minimum " + min + " characters allowed",
            },
          };
        else if (max > 0 && a.length > max)
          return {
            ERROR: {
              key: "MAX",
              message: "Maximum " + max + " characters allowed",
            },
          };
        else if (num != 0 && !Num.test(a))
          return {
            ERROR: {
              key: "NUM",
              message: "Only numbers allowed",
            },
          };
        else if (alpha != 0 && !Alpha.test(a))
          return {
            ERROR: {
              key: "ALPHA",
              message: "Only alphabets allowed",
            },
          };
        else if (alphaNum != 0 && !AlphaNum.test(a))
          return {
            ERROR: {
              key: "ALPHANUM",
              message: "Only alphabets and numbers allowed",
            },
          };
        else if (specialChar != 0 && specialChars.test(a))
          return {
            ERROR: {
              key: "PATTERN",
              message: "Special character not allowed",
            },
          };
        else if (email != 0 && !Email.test(a))
          return {
            ERROR: {
              key: "EMAIL",
              message: "Invalid email aaaa@bbb.ccc",
            },
          };
        else if (password != 0 && !Password.test(a))
          return {
            ERROR: {
              key: "PASSWORD",
              message: "Invalid password aaaa@bbb.ccc",
            },
          };
        else return null;
      }
    };
  }
```
## Angular Material AutoComplete Search Subscription
```typescript
  _subscribeAutoComplete(url: string, formControlName: string, localList: SelectOption[]):
  Observable<SelectOption[]>{
    return this._form.get(formControlName).valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
            return this._filterz(url, val || '', localList)
       })
    )
  }
```
## Angular Material AutoComplete Filteration
```typescript
  private _filterz(url: string, val: string, localList: SelectOption[]): Observable<SelectOption[]> {
      return this._service.autoCompleteService(url, val, localList,)
      .pipe(
        map(response => response.filter(option => {
          return option.title.toLowerCase().indexOf(val.toLowerCase()) === 0
        }))
      )
  }
}

```