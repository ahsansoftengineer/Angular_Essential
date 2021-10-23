## Base Form Simple Example
1. Base Form Implementation in Component
#### Imports
```javascript
import { Component, Injector, OnInit } from '@angular/core';
import { URLz } from 'src/app/model/base-classes/base.enum';
import { BaseForm } from 'src/app/model/base-classes/base.form';
import { T } from 'src/app/model/form-model/interface';
import { BaseService } from 'src/app/service/base.service';
import { environment } from 'src/environments/environment';
```
#### Constructor & ngOnInit
> 1. Over riding Hiarchy 
> * **Base Form** *ext* **Base Form Validator**
> 2. Over riden Properties
> * * _service
> * * _service.url
> * * _pathLocation
> * * 
```javascript
@Component({
  selector: 'app-place-add',
  templateUrl: './place-add.component.html',
  styleUrls: ['./place-add.component.css']
})
export class ComponentName extends BaseForm implements OnInit {
  constructor(
    injector: Injector,
    ss: BaseService<T>
  ) {
    super(injector);
    ss.url = environment.API_URL + URLz.PLACE
    super._service = ss;
  }
  ngOnInit() {
    this.initForm();
    this._pathLocation = "/path/location";
    this._activeId = this._activeRoute.snapshot.paramMap.get("id");
    if (this._activeId != null && Number(this._activeId) > 0)
     this.patchData();
  }
```

#### Initializing Form
```javascript
  initForm() {
    this._form = this._fb.group({
        title: ['', this._validator('Place Title', 1, 4, 100,0,1)] // Unique
    });
  }
```
#### Patching Data to Form
> * Update Case
```javascript
  patchData(){
    this._service.getSingle(+this._activeId)
    .subscribe((res: any) => {
      data = res.data.row
      this._form.patchValue({
        title: data.title
      });
    });
  }
```
#### Template Implementation
```html
<form [formGroup]="_form" (ngSubmit)="_onSubmit()">
  <div class="row card-body">
    <div class="col-md-4 p-0">
      <mat-form-field appearance="outline" class="col-md-12">
        <mat-label>Place Title</mat-label>
        <input matInput required formControlName="title" type="text">
        <mat-error> {{ _error('title')?.message }}</mat-error>
      </mat-form-field>
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