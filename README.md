## Validation Utilization
### FormGroup Simple Top Controls
> * Parameters
> 1. Control Name Provided in Reactive FormGroup
```javascript
  _error(name: string): ValidationErrors {
    let control = this._form?.controls[name]
    if (control?.touched && control.errors) {
      return control.errors['ERROR'];
    };
  }
```
```html
  <div class="col-lg-3 col-md-4 p-0 my-1">
    <mat-form-field appearance="outline" class="col-md-12" >
      <mat-label>Form Field</mat-label>
      <input matInput formControlName="field1" type="text" required>
      <mat-error> {{ _vs._error('field1')?.message }}
      </mat-error>
    </mat-form-field>
  </div>
```
### Control not of FormGroup
> * These type of are not the part of FormGroup
```javascript
  _error_control(control : FormControl){
    if(control.errors){
      return control?.errors['ERROR']
    } else return null
  }
```
> * Component
> 1. Init Form
```javascript
 initform() {
    //,
    this._vs._form = this._fb.group({
      title: ['',this._vs._validator('Title', 1, 3, 100)],
      myFormControlName:  this._fb.array([], this._vs._validator('myFormControlName', 0)),
    });
  }
```
> 2. Patch Data
```javascript
 patchData() {
    this._service.getSingle(+this._activeId).subscribe((res: any) => {
      let data  = res.data.row as ArrayType
      this._vs._form.patchValue({
        title: data.title,
      });
      data.myArray.forEach(item => {
        (<FormArray>this._vs._form.get('myFormControlName'))
        .push(new FormControl(item.id))
      })
      this.TemporaryArray = data.myFormControlName;
      this.mySeperateControlName.setValue(data.myFormControlName)
    });
  }
```
> 3. Declaring Seperate Control
```javascript
  // Multi Select
  mySeperateControlName = 
    new FormControl('', this._vs._validator('Control Name', 0))
  TemporaryArray: any;
  initDropDown() {
    this._dropdown(URLz.ARRAY).subscribe(res => {
      this.__ddl.myFormControlName = res.data.records
    })
  }
```
> 4. Multi Select Event
```javascript
  _multiSelect(event, arrayName: string) {
    let myArray = <FormArray>this._vs._form.get(arrayName);
    let source = event.source;
    if (event.isUserInput) {
      if (source.selected) {
        myArray.push(new FormControl(source.value));
      } else {
        myArray.removeAt(
          myArray.value.findIndex((Id) => Id === source.value)
        );
      }
    }
  }
```
> * Template
```html
    <div class="col-md-4 p-0">
      <mat-form-field appearance="outline" class="col-md-12">
        <mat-label>Multi Select Control</mat-label>
        <mat-select [formControl]="mySeperateControlName" 
        [(value)]="TemporaryArray" multiple>
          <mat-option *ngFor="let item of __ddl.myFormControlName " [value]="item.id"
            (onSelectionChange)="_multiSelect($event, 'myFormControlName')">
            {{item.title}}</mat-option>
        </mat-select>
        <mat-error> {{ _vs._error_control(mySeperateControlName)?.message }}</mat-error>
      </mat-form-field>
    </div>
```
### Custom Image Validation
> * Parameter
> 1. Image Type Interface
```javascript
  _error_image(img: ImgType) {
    if (img.error === true) {
      return 'Only jpeg | jpg | png allowed';
    } else if (!img.link && this._submitted) {
      return 'Please select ' + img.display;
    } else return '';
  }
```
> 2. Image Type Interface
```javascript
  export interface ImgType {
    link?: any;
    file?: File;
    name?: string;
    display?: string;
    size?: string;
    error?: boolean;
  }
```
> 3. Property and Method Envolved
```javascript
  imgLogo: ImgType  = {display: 'Logo Image'};
  readUrl(event: any, imgType: ImgType) {
    Custom.imageSelector(event, imgType)
  }
```
> 4. Init Form Doesn't has Image Property
> 5. Patching Exsisting Image from DB
```javascript
  patchData() {
    this._service.getByCode(this._activeId).subscribe((res: any) => {
      let data: OperatingUnit = res.data.row;
      this._vs._form.patchValue({
        address: data?.address,
      });
      this.imgLogo.link =  data.logo;
    });
  }
```
> 6. On Submit Method
```javascript
  _onSubmit(){
    if((!this.imgLogo.link || this.imgLogo.error)){
        return  false
      }
    if (this.imgLogo.file) fd.append('logo', this.imgLogo.file);
    if (this._vs._form.valid) {
      if (this._activeId) {
        Custom.jsontoFormData(this._vs._form.value, '', fd);
        this._service.update(fd).subscribe(
          (res: any) => {
            this._switch();
          },
          (httpErrorResponse: HttpErrorResponse) => {
            this._vs._error_server(httpErrorResponse.error);
          }
        );;
  }
```
> 7. Template
```html
<div class="col-md-3">
  <p>Logo</p>
  <div class="custom__img__div">
    <input class="upload-large" type="file" (change)="readUrl($event, imgLogo)">
    <img alt="logo" class="img-fluid custom__img" [src]="imgLogo.link ? imgLogo.link : imgPath">
  </div>
  <p style="font-size: 10px; color: #f44336;">
    {{ _vs._error_image(imgLogo) }}
  </p>
</div>
```
> 8. Custom Image Selector
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









