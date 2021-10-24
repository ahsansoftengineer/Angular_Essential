## Custom Version 2
> * This File is still in process
> * May be in future that file will be split and Utilized as Service
#### Converting Form Group Object to Form Data
* This Method is Returning Form Data you have the flexibility whether to pass form data as reference type / take return value
> * This method could also be use to add a Form Data Property to a Json Object where you can use the parent key property
> * This method is very flexible
> * May could be replace with Node packages in future
##### 1. Checking Type Object
```javascript
  private static isObject(val) {
    return !this.isArray(val) && typeof val === 'object' && !!val;
  }

```
##### 2. Checking Array Type
```javascript
  // 2. B
  private static isArray(val) {
    const toString = {}.toString;
    return toString.call(val) === '[object Array]';
  }

```
##### 3. Conversion Method
> Parameters
> 1. Json Object
> 2. Parent Key (Optional)
> 3. Carry Form Data
```javascript
  public static jsontoFormData(
    jo: Object, // Json Object
    pk = '', // Parent Key
    carryFormData: FormData
  ): FormData {
    const formData = carryFormData || new FormData();
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
            formData.append(propName, jo[key]);
          } else if (jo[key] instanceof FileList) {
            for (var j = 0; j < jo[key].length; j++) {
              formData.append(propName + '[' + j + ']', jo[key].item(j));
            }
          } else if (this.isArray(jo[key]) || this.isObject(jo[key])) {
            this.jsontoFormData(jo[key], propName, formData);
          } else if (typeof jo[key] === 'boolean') {
            formData.append(propName, +jo[key] ? '1' : '0');
          } else {
            formData.append(propName, jo[key]);
          }
        }
      }
      index++;
    }
    return formData;
  }
```
##### Utilization
1. Initializing Form
```javascript
  initForm() {
    this._form = this._fb.group({
      law: ['', this._validator('Law', 1, 4, 100)],
      address: ['', this._validator('Address', 1, 4, 100)],
      is_deposit: ['1', this._validator('Deposit', 1, 4, 100)],
    });
  }
```
2. Declaring Properties
```javascript
 // Images Access
  imgTop: ImgType = {display: 'Top Image'};
  imgLogo: ImgType  = {display: 'Logo Image'} ;
  imgWarn: ImgType = {display: 'Warning Image'} ;
  imgFooter: ImgType = {display: 'Footer Image'} ;
  imgPath: string = 'assets/images/select.png';
```
3. Patching Images if exsist in Database
```javascript
  patchData() {
    this._service.getByCode(this._activeId).subscribe((res: any) => {
      let data: T = res.data.row;
      this._form.patchValue({
        is_deposit: data?.is_deposit,
        address: data?.address,
        law: data?.law,
      });
      this.imgLogo.link =  data.logo;
      this.imgTop.link = data.top_image ;
      this.imgWarn.link = data.warning_image;
      this.imgFooter.link = data.footer_image;
    });
  }
```
4. Event Handling to Upload Images
```javascript
  // Here we are using Custom Image Selector
  readUrl(event: any, imgType: ImgType) {
   Custom.imageSelector(event, imgType)
  }
```
5. Sumitting Form Data to Server
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
1. Initializing Form
```javascript
```


#### Object to URL Query Conversion
> Simple Object to URL Query Converter
```javascript
  public static objToURLQuery(searchObject: any) {
    let result = '';
    for (var key of Object.keys(searchObject)) {
      result += '&' + key + '=' + searchObject[key];
    }
    return result;
  }
```
##### Utilization
1. Declaring Properties
```javascript
  _search: any = {};
```
2. Resetting Property (For Table Purpose)
```javascript
   _reset() {
    this._search = {};
  }
```
3. Base Form List (For Table Purpose)
```javascript
 // Search Functionality
  _refresh(params: string = '') {
    // Utilization ****
    params += Custom.objToURLQuery(this._search);
    params += `&limit=${this._tbl.size}&page=${this._tbl.index + 1}`;
    if (this._tbl.orderBy != '' && this._tbl.orderType != '') {
      params +=
      `&order_by=${this._tbl.orderBy}&order_type=${this._tbl.orderType}`;
    }
    this._service.getAll(params).subscribe((res: any) => {
      this._dataSource.data = res.data.records;
      this._tbl.length = res.data.totalRecords;
    });
  }
```
4. Template Utilization
> * This is how we declare and Utilized Properties
```html
<ng-container matColumnDef="title">
  <th mat-header-cell *matHeaderCellDef mat-sort-header arrowPosition='before'>
    <!-- *** _search.title *** -->
    <input [(ngModel)]='_search.title' placeholder="Title" class="search" (keydown)="_stop($event)"
      (click)="_stop($event)">
  </th>
  <td mat-cell *matCellDef="let item"> {{item.title}} </td>
</ng-container>
```

#### Image Selector Customized Method
> * This image Selector has following feature
> * Image Type (jpg, jpge & png)
> * Image Size ( Needs to be implement)
> * Already Image Selected (Update Case)
> * Displaying Image in Template
```javascript
  public static imageSelector(event: any, imgType: ImgType) {
    if (event.target.files.length === 0) {
      imgType.link = ''
      imgType.display
      return
    };
    var mimeType = event.target.files[0].type;
    const file: File = event.target.files[0];
    const name = file.name
    const ext = name.substring(name.lastIndexOf('.') + 1, file.name.length)
    if (mimeType.match(/image\/*/) == null &&
    'jpeg jpg png'.indexOf(ext) == -1 ) {
      imgType.error = true;
      imgType.link = ''
      return;
    } else {
      imgType.error = false
    }
    // Image upload
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
        imgType.link = _event.target.result;
        imgType.file = event.srcElement.files[0];
        imgType.name = event.srcElement.files[0].name;
    }
  }
```
##### Utilization
1. Propeties
```javascript
  imgTop: ImgType = {display: 'Top Image'};
  imgLogo: ImgType  = {display: 'Logo Image'} ;
  imgWarn: ImgType = {display: 'Warning Image'} ;
  imgFooter: ImgType = {display: 'Footer Image'} ;
  imgPath: string = 'assets/images/select.png';
```
2. Patch Data
```javascript
patchData() {
    this._service.getByCode(this._activeId).subscribe((res: any) => {
      let data: T = res.data.row;
      this._form.patchValue({
        is_deposit: data?.is_deposit,
        address: data?.address,
        law: data?.law,
      });
      this.imgLogo.link =  data.logo;
      this.imgTop.link = data.top_image ;
      this.imgWarn.link = data.warning_image;
      this.imgFooter.link = data.footer_image;
    });
  }
```
3. Image Selector Event Handling
```javascript
  readUrl(event: any, imgType: ImgType) {
   Custom.imageSelector(event, imgType)
  }
```
4. Submit Event
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
5. Validation
> * Exsist in Base Form Validation
```javascript
  _error_image(img: ImgType){
    if(img.error === true){
      return 'Only jpeg | jpg | png allowed'
    } else  if(!img.link && this._submitted){
      return 'Please select ' + img.display
    }
    else return ''
  }
```
6. Template
```html
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
  </div>
</div>
```


#### Hiarchecal Dropdowns
##### Loading Parent Dropdown
```javascript
  _dropdown(url: URLz, code: string = '') {
    return Custom._dropdown(url, code, this._service);
  }
```
##### Base Load Sub Entity Method
> * Base Class Calls the Custom Load_Sub_Entity Method because same stratgy is being used inside Table Component
> * Switch case is to Setting Form Values to Null when User Selection Changes (May be optional) / not required
```javascript
  _ddIncrement = 0;
  _totalDropdown = 0;
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
              this.__ddl.le = [];
          case URLz.OU || URLz.LE:
            if (this._form.contains('ou'))
              this._form.get('ou').setValue('');
              this.__ddl.ou = [];
          case URLz.OU || URLz.SU || URLz.LE:
            if (this._form.contains('su'))
              this._form.get('su').setValue('');
              this.__ddl.su = [];
            break;
      }
      }
      Custom.loadSubEntity(entity, code, this.__ddl, this._service);
    }
  }
```
##### Custom Load Sub Entity
> * In case the Parent Changes the Selection then set the empty array to child dropdowns
> * If Switch doesn't work here then use IF ELSE
```javascript
  public static _dropdown(url: URLz, code, service) {
    return service.selectOptionService(url, code);
  }
  public static loadSubEntity(entity: URLz, code, __ddl, service) {
    if (code?.target?.value) {
      code = code.target.value;
    }
    switch (entity) {
      case URLz.LE:
        this._dropdown(entity, code, service).subscribe(
          (res) => __ddl.le = res.data.records); break;
      case URLz.OU:
        this._dropdown(entity, code, service).subscribe(
          (res) => __ddl.ou = res.data.records); break;
      case URLz.SU:
      this._dropdown(entity, code, service).subscribe(
        (res) => __ddl.su = res.data.records ); break;
      case URLz.STATE:
        this._dropdown(entity, code, service).subscribe(
          (res) => __ddl.state_id = res.data.records);
      case URLz.CITY:
        this._dropdown(entity, code, service).subscribe(
          (res) => __ddl.city_id = res.data.records
        );
    }
  }
```
##### Component ngOnInit
> * initializing the _totalDropdown so when the form patch the values nothing stop it after that we can work on Only if the User Changes the Dropdowns
```javascript
ngOnInit() {
    this._pathLocation = '/operating_unit/ou';
    this._totalDropdown = 2
    this.initForm();
    this.initDropDown();
    this._activeId = this._activeRoute.snapshot.paramMap.get('id');
    if (this._activeId) {
      this.patchData();
    }
  }
```
##### Initializing Form
> * Setting Disable property at the time of form initialization could also be set at Template by using disabled directive either is best
```javascript
  initForm() {
    this._form = this._fb.group({
      bg: [{value: '', disabled: true},  this._validator('Business Group', 0)],
      le: [{value: '', disabled: true}, this._validator('Legal Entity', 0)],
      ou: [{value: '', disabled: true}, this._validator('Operating Unit', 0, 4, 100)],
    });
  }
```
##### Patch Data
```javascript
  patchData() {
    this._service.getByCode(this._activeId).subscribe((res: any) => {
      let data: T = res.data.row;
      this._form.patchValue({
        bg: data?.bg,
        le: data?.le,
        ou: data?.ou,
      });
    });
  }
```
##### Initialing the Parent Dropdown
> * Child Dropdown will be handle by Templete on Selection Change Event
```javascript
  initDropDown() {
    this._dropdown(URLz.BG).subscribe(
      (res) => (this.__ddl.bg = res.data.records)
    );
  }
```
#### Template
> * (onSelectionChange)="_loadSubEntity(URLz.LE, item.id, $event)" This method is responsible the handle the request.
```html
<div class="col-md-4 p-0">
  <mat-form-field appearance="outline" class="col-md-12">
    <mat-label>BG</mat-label>
    <mat-select formControlName="bg" required>
      <mat-option (onSelectionChange)="_loadSubEntity(URLz.LE, item.id, $event)"
        *ngFor="let item of __ddl?.bg" [value]="item.id">
        {{item.title}}
      </mat-option>
    </mat-select>
    <mat-error>{{_error('bg')?.message}}</mat-error>
  </mat-form-field>
</div>
<div class="col-md-4 p-0">
  <mat-form-field appearance="outline" class="col-md-12">
    <mat-label>LE</mat-label>
    <mat-select formControlName="le" required>
      <mat-option (onSelectionChange)="_loadSubEntity(URLz.OU, item.id, $event)"
        *ngFor="let item of __ddl?.le" [value]="item.id">
        {{item.title}}
      </mat-option>
    </mat-select>
    <mat-error>{{_error('le')?.message}}</mat-error>
  </mat-form-field>
</div>
<div class="col-md-4 p-0">
  <mat-form-field appearance="outline" class="col-md-12">
    <mat-label>OU</mat-label>
    <mat-select formControlName="ou" required>
      <mat-option *ngFor="let item of __ddl?.ou" [value]="item.id">
        {{item.title}}
      </mat-option>
    </mat-select>
    <mat-error>{{_error('ou')?.message}}</mat-error>
  </mat-form-field>
</div>
```
#### Swal Fire
> * Custom Swal Fire
> 1. Status Changed
> 2. Delete
```javascript
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
          Custom.statusEmmit.emit('done');
          Swal.fire(
            'Deleted!',
            class_name + ' deleted successfully',
            'success'
          );
        });
      } else {
        Custom.statusEmmit.emit('not deleted');
      }
    });
  }
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
##### Base Class
> * There is no role for Child Class TS File
> * Template is Directly Invoking these Methods
```javascript
  _statusChange(value: boolean, id: number) {
    this._status.activate = +value;
    this._status.id = id;
    Custom.SwalFireStatusChange(
      this._service, this._status, this._component
    );
  }
  _delete(id: number) {
    Custom.SwalFireDelete(this._service, this._component, id);
  }
```
##### Component Templete Implementations
> * Status Change
> * Delete
```html
  <!-- Status Changed -->
  <td mat-cell *matCellDef="let item">
    <ui-switch color="green" size="small" [(ngModel)]="item.activate"
      (change)="_statusChange($event, item.id)">
    </ui-switch>
  </td>
  <!-- Delete -->
  <td class="pl-3" mat-cell *matCellDef="let item">
  <i class="ti-trash text-danger px-2 pointer" (click)="_delete(item.id)"></i>
</td>
```
##### Note
> * Custom Class will be convert into service later on