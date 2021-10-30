## Base Service Implementation
### GET
> * This doesn't have to be generic type because its not in use
> * Instead use another way round for its Generics Functionality
```javascript
  @LoaderEnabled()
  get(id: number, param: string = ''): Observable<T> {
    param = param !== '' ? '?' + param: ''
      return this.http.get<T>(this.url + '/' + id + param);
  }
```
> * Component Implementation
> * I think some of the task needs to be shifted in Base Service Class
```javascript
  // This Code Should be shifted in Base Class ngOnInit
  this._activeId = this._activeRoute.snapshot.paramMap.get("id");
  // Component ngOnInit
    this.patchData();
```
#### 1. Without Optional Parameters
```javascript
  patchData(){
    if (this._activeId != null && Number(this._activeId) > 0)
      this._service.get(+this._activeId)
      .subscribe((res: any) => {
          let data = res.data.row;
        this._form.patchValue({
          title: data.title,
        });
      });
  }
```
#### 2. With Optional Parameters
```javascript
  patchData(){
    this._service
      .getSingle(+this._activeId, 'is_advance=1')
      .subscribe((res: any) => {
        // This is why I am saying there is no need for Generic Service
        let data: DataTypeInterface = res.data.row;
        console.log(data);
        this._form.patchValue({
          name: data.name,
          gender: data.gender,
          email: data.email,
        })
      }
    }
```
### GETS
> * No need Generics Type
```javascript
  @LoaderEnabled()
  gets(param: string = ''): Observable<T> {
    param = param !== '' ? '?' + param: ''
      return this.http.get<T>(this.url + param);
  }
```
> * Called in Component ngOnInit
```javascript
    this._refresh('is_advance=1');
```
> * With and Without optional parameters
```javascript
  // Search Functionality
  _refresh(params: string = '') {
    params += Custom.objToURLQuery(this._search);
    params += `&limit=${this._tbl.size}&page=${this._tbl.index + 1}`;
    if (this._tbl.orderBy != '' && this._tbl.orderType != '') {
      params +=
      `&order_by=${this._tbl.orderBy}&order_type=${this._tbl.orderType}`;
    }
    this._service.gets(params).subscribe((res: any) => {
      this._dataSource.data = res.data.records;
      this._tbl.length = res.data.totalRecords;
    });
  }
```
### CREATE / UPDATE
> * with & without parameters
```javascript
  @LoaderEnabled()
  create(data: T, param: string = '') {
    param = param !== '' ? '?' + param: ''
    return this.http.post(this.url + param, data)
      .pipe(catchError(Custom.handleError));
  }
  @LoaderEnabled()
  update(data: any, param: string = '') {
    return this.http.post(this.url + '?_method=PUT' + param, data)
    .pipe(catchError(Custom.handleError));
  }
```
> * With / Without parameters
> * Calling from Template 
```html
  <form [formGroup]="_form" (ngSubmit)="_onSubmit()">
  <form [formGroup]="_form" (ngSubmit)="_onSubmit('&is_advance=1')">
```
```javascript
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
> * Form Data Implementaion for create / update service


```javascript
  _onSubmit(id: string = 'id') {
    this._form.markAllAsTouched()
    this._submitted = true;
    let fd = new FormData();
    if((!this.imgFooter.link || !this.imgLogo.link
      || !this.imgTop.link || !this.imgWarn.link)){
        return this._isFormValid = false
      }
      else if(this.imgFooter.error || this.imgLogo.error ||
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
### DELETE
> * Here we are not using official delete method of Http Client
```javascript
  @LoaderEnabled()
  delete(id: number, param: string = '') {
    return this.http.post(this.url + '/' + id + '?_method=DELETE' + param, id);
  }
```
#### 1. Calling Delete Method from Template
```html
<i class="ti-trash text-danger pointer" (click)="_delete(item.id)"></i>
```
#### 2. Calling Delete Method from Base Class
```javascript
  _delete(id: number) {
    Custom.SwalFireDelete(this._service, this._component, id);
  }
```
#### 3. Custom Swal Fire Delete Implementation
```javascript
  public static statusEmmit: EventEmitter<any> = new EventEmitter();
  public static async SwalFireDelete(
    service: any,
    class_name: string,
    id: number
  ) {
    return Swal.fire({
      title: 'Are you sure?',
      text: class_name + ' will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        service.delete(id).subscribe((response: any) => {
          // Swal.fire('Deleted!', response.message, 'success');
          Custom.statusEmmit.emit('done');
          Swal.fire(
            'Deleted!',
            class_name + ' deleted successfully',
            'success'
          );
          // this.ngOnInit();
        });
      } else {
        Custom.statusEmmit.emit('not deleted');
      }
    });
  }
```
#### 4. Subscribing the Status Change Event Emmitter 
> * Here we are subscribing the status changed so we could refresh when the Service Complete Execution 
> * This is happening in Base List Class
```javascript
  ngOnInit(){
    Custom.statusEmmit.subscribe(status => {
      this._refresh();
    })
    this._reset();
    this._refresh();
  }
```
### STATUS
> * Status Changed is pretty much same as delete 
```javascript
  @LoaderEnabled()
  status(data:any, param: string = '') {
    return this.http.post(this.url + '?_method=PATCH' + param, data);
  }
```
#### 1. Component Template
```html
<td class="pl-3" mat-cell *matCellDef="let item">
  <ui-switch 
    color="green" 
    size="small" 
    [(ngModel)]="item.activate" 
    (change)="_statusChange($event, item.id)">
  </ui-switch>
</td>
```
#### 2. Base List Class
```javascript
  _statusChange(value: boolean, id: number) {
    this._status.activate = +value;
    this._status.id = id;
    Custom.SwalFireStatusChange(
      this._service, this._status, this._component
    );
  }
```
#### 3. Custom Class
```javascript
  public static statusEmmit: EventEmitter<any> = new EventEmitter();
 public static async SwalFireStatusChange(
    service: any,
    status: any,
    class_name: string = 'Class'
  ) {
    let statuss = status.activate == 0 ? false : true;
    Swal.fire({
      title: 'Are you sure?',
      text: class_name + ' will be ' + (statuss ? 'Activated' : 'Deactivated'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        service.status(status).subscribe((res: any) => {
          Swal.fire(
            status.activate ? 'Activated!' : 'Deactivated!',
            res.message
          );
          Custom.statusEmmit.emit('done');
        });
      } else {
        Custom.statusEmmit.emit(status);
      }
    });
  }
```
#### 4. Base List Class Subscription
```javascript
  ngOnInit(){
    Custom.statusEmmit.subscribe(status => {
      this._refresh();
    })
    this._reset();
    this._refresh();
  }
```
### DROPDOWN
> * This is Used in Several Ways
```javascript
  @LoaderEnabled()
  dropDown(url: URLz, p_id: any = ''): Observable<any> {
    p_id = p_id != '' ? ('?parent_id='+ p_id) :  p_id
    return this.http.get<SelectOption[]>(
      environment.API_URL + url + p_id
    );
  }
```
#### Simple Dropdowns
```javascript
  initDropDown(){
    this._dropdown(URLz.BG).subscribe(res =>
      this.__ddl.bg = res.data.records
    );
  }
```
#### Hiarchycal Dropdown (Template)
```html
  <div class="col-md-4 p-0">
  <mat-form-field appearance="outline" class="col-md-12">
    <mat-label>A</mat-label>
    <mat-select formControlName="a" required>
      <mat-option
      (onSelectionChange)="_loadSubEntity(URLz.B, item.id, $event, 4)"
      *ngFor="let item of __ddl?.a" [value]="item.id">
        {{item.title}}
      </mat-option>
    </mat-select>
    <mat-error>{{_error('a')?.message}}</mat-error>
  </mat-form-field>
</div>
<div class="col-md-4 p-0">
  <mat-form-field appearance="outline" class="col-md-12">
    <mat-label>B</mat-label>
    <mat-select formControlName="b" required>
      <mat-option
      (onSelectionChange)="_loadSubEntity(URLz.C, item.id, $event, 4)"
      *ngFor="let item of __ddl?.b" [value]="item.id">
        {{item.title}}
      </mat-option>
    </mat-select>
    <mat-error>{{_error('b')?.message}}</mat-error>
  </mat-form-field>
</div>
<div class="col-md-4 p-0">
  <mat-form-field appearance="outline" class="col-md-12">
    <mat-label>C</mat-label>
    <mat-select formControlName="c" required>
      <mat-option
      (onSelectionChange)="_loadSubEntity(URLz.D, item.id, $event, 4)"
      *ngFor="let item of __ddl?.c" [value]="item.id">
        {{item.title}}
      </mat-option>
    </mat-select>
    <mat-error>{{_error('c')?.message}}</mat-error>
  </mat-form-field>
</div>
```
#### Hiarchycal Dropdowns (TS)
```javascript
  _ddIncrement = 0;
  _totalDropdown = 0;
  __ddl: any = {};
  _resetSubscription() {}
  _dropdown(url: URLz, code: string = '') {
    return Custom._dropdown(url, code, this._service);
  }
  _loadSubEntity(entity: URLz, code: string, event: MatOptionSelectionChange) {
    this._ddIncrement++;
    if (
      event?.isUserInput ||
      (this._activeId && this._totalDropdown >= this._ddIncrement)
    ) {
      if(event?.isUserInput){
        switch (entity) {
          case URLz.LE:
            if (this._form.contains('b'))
              this._form.get('b').setValue('');
          case URLz.OU || URLz.LE:
            if (this._form.contains('c'))
              this._form.get('c').setValue('');
          case URLz.OU || URLz.SU || URLz.LE:
            if (this._form.contains('d'))
              this._form.get('d').setValue('');
            break;
      }
      }
      Custom.loadSubEntity(entity, code, this.__ddl, this._service);
    }
  }
```
#### Hiarchycal Dropdown (Custom File)
1. why we are passing service as a argument when ever we could have Service Inject Directly Here
2. Also Set the Form Value Empty Here
```javascript
 public static loadSubEntity(entity: URLz, code, __ddl, service) {
    if (code?.target?.value) {
      code = code?.target?.value;
    }
    if (entity == URLz.B) {
      this._dropdown(entity, code, service).subscribe(
        (res) => (__ddl.b = res.data.records)
      );
      __ddl.c = [];
      __ddl.d = [];
    } else if (entity == URLz.C) {
      this._dropdown(entity, code, service).subscribe(
        (res) => (__ddl.c = res.data.records)
      );
      __ddl.d = [];
    } else if (entity == URLz.D) {
      this._dropdown(entity, code, service).subscribe(
        (res) => {
          __ddl.d = res.data.records
        }
      );
    }
  }
  public static _dropdown(url: URLz, code, service) {
    return service.selectOptionService(url, code);
  }
```








