# First Commit

## Work on Utilizations

#### Converting Form Group Object to Form Array
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


#### Object to URL Query Conversion
1. Simple Object to URL Query Converter
```javascript
  public static objToURLQuery(searchObject: any) {
    let result = '';
    for (var key of Object.keys(searchObject)) {
      result += '&' + key + '=' + searchObject[key];
    }
    return result;
  }
```
2. Declaring Properties 
```javascript
  _search: any = {};
```
3. Resetting Property (For Table Purpose)
```javascript
   _reset() {
    this._search = {};
  }
```
4. Base Form List (For Table Purpose)
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
5. Template Utilization
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
##### Utilizing Image Selector in TSC
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
4.  Submit Event
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
5. Template
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


#### Utilizing Image Selector in TSC
> * Patch Data
```javascript
```
##### Utilizing Image Selector in TSC
> * Patch Data
```javascript
```
##### Utilizing Image Selector in TSC
> * Patch Data
```javascript
```