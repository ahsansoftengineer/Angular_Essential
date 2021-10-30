## Custom Version 2
> * DETAILED VERSION IS CUSTOM IMPLEMENTATION
> * This File is still in process
> * May be in future that file will be split and Utilized as Service
### Converting Form Group Object to Form Data
> * This Method is Returning Form Data you have the flexibility whether to pass form data as reference type / take return value
> * This method could also be use to add a Form Data Property to a Json Object where you can use the parent key property
> * This method is very flexible
> * May could be replace with Node packages in future
#### 1. Conversion Method FormGroup to FormData
> * Parameters
> 1. Json Object
> 2. Parent Key (Optional)
> 3. Carry Form Data
```javascript
  private static isObject(val) {
    return !this.isArray(val) && typeof val === 'object' && !!val;
  }
  private static isArray(val) {
    const toString = {}.toString;
    return toString.call(val) === '[object Array]';
  }
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
### Object to URL Query Conversion
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
### Image Selector Customized Method
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
### Hiarchecal Dropdowns
#### 1. Loading Parent Dropdown From Base Class
```javascript
  _dropdown(url: URLz, code: string = '') {
    return Custom._dropdown(url, code, this._service);
  }
```
#### 3. Custom Load Sub Entity
> * _dropdown of Custom Class and loadSubEntity for BaseForm and BaseList Class Utilization
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
### Swal Fire
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