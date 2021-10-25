import { HttpErrorResponse } from '@angular/common/http';
import { ViewCompileResult } from '@angular/compiler/src/view_compiler/view_compiler';
import { EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { throwError, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ImgType } from '../interface/img-type';
import { URLz } from './base.enum';

// Custom Class Should be abstract and has all Static Methods
export abstract class Custom {
  public static handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(error);
  }
  public static statusEmmit: EventEmitter<any> = new EventEmitter();
  public static async FormLeave(
    title: string,
    text: string
  ) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      return result
    });
  }
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
  public static objToURLQuery(searchObject: any) {
    // For Simple Object Only
    let result = '';
    for (var key of Object.keys(searchObject)) {
      // if (searchObject[key].length > 0)
      //   result += '&' + key + '=' + searchObject[key];
      result += '&' + key + '=' + searchObject[key];
    }
    return result;
  }
  private static isArray(val) {
    const toString = {}.toString;
    return toString.call(val) === '[object Array]';
  }
  private static isObject(val) {
    return !this.isArray(val) && typeof val === 'object' && !!val;
  }
  public static loadSubEntity(entity: URLz, code, __ddl, service) {
    if (code?.target?.value) {
      code = code?.target?.value;
    }
    if (entity == URLz.LE) {
      this._dropdown(entity, code, service).subscribe(
        (res) => (__ddl.le = res.data.records)
      );
      __ddl.ou = [];
      __ddl.su = [];
    } else if (entity == URLz.OU) {
      this._dropdown(entity, code, service).subscribe(
        (res) => (__ddl.ou = res.data.records)
      );
      __ddl.su = [];
    } else if (entity == URLz.SU) {
      this._dropdown(entity, code, service).subscribe(
        (res) => {
          __ddl.su = res.data.records
        }
      );
    } else if (entity == URLz.STATE) {
      this._dropdown(entity, code, service).subscribe(
        (res) => (__ddl.state_id = res.data.records)
      );
      __ddl.city_id = [];
    } else if (entity == URLz.CITY) {
      this._dropdown(entity, code, service).subscribe(
        (res) => (__ddl.city_id = res.data.records)
      );
    }else if (entity == URLz.BASTA_SUB_CAT) {
      this._dropdown(entity, code,service).subscribe(
        (res) => {
         __ddl.basta_subcategory_id = res.data.records;
        }
      );
    } else if (entity == URLz.SYSTEM) {
      this._dropdown(entity, code, service).subscribe((res) => {
        __ddl.system_id = res.data.records;
      });
    }
  }
  public static _dropdown(url: URLz, code, service) {
    return service.selectOptionService(url, code);
  }
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
}
