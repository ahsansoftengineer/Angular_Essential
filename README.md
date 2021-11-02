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
```javascript
  myControlName = new FormControl('default value', this._vs._validator('Display Error Message'))
```
> * Template
```html
 <div class="col-lg-3 col-md-4 p-0 my-1">
    <mat-form-field appearance="outline" class="col-md-12" >
      <mat-label>Control Name</mat-label>
      <input matInput [formControl]="myControlName" type="text" required>
      <mat-error> {{ _vs._error_control(myControlName)?.message }}
      </mat-error>
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
### Headings
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```
#### Heading
> * Points
```javascript
```

