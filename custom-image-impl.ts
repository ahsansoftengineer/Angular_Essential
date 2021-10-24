import { Component, Injector, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { URLz } from 'src/app/model/base-classes/base.enum';
import { BaseFormDropDown } from 'src/app/model/base-classes/base.form.drop-down';
import { ImgType } from 'src/app/model/interface/img-type';
import { T } from 'src/app/model/form-model/interfaces';
import { BaseService } from 'src/app/service/base.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Custom } from './custom';

@Component({
  selector: 'app-ou-add',
  templateUrl: './ou-add.component.html',
  styleUrls: ['./ou-add.component.css'],
})
export class Component extends BaseFormDropDown implements OnInit {
  constructor(injector: Injector, private ss: BaseService<T>) {
    super(injector);
    ss.url = environment.API_URL + URLz.OU_CUSTOM;
    super._service = this.ss;
  }
  _totalSelected = 3
  ngOnInit() {
    this._pathLocation = '/operating_unit/ou';
    this.initForm();
    this.initDropDown();
    this._activeId = this._activeRoute.snapshot.paramMap.get('id');
    if (this._activeId) {
      this.patchData();
    }
  }
  initForm() {
    this._form = this._fb.group({
      law: ['', this._validator('Law', 1, 4, 100)],
      address: ['', this._validator('Address', 1, 4, 100)],
      is_deposit: ['1', this._validator('Deposit', 1, 4, 100)],
    });
  }
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

  // Images Access
  imgTop: ImgType = {display: 'Top Image'};
  imgLogo: ImgType  = {display: 'Logo Image'} ;
  imgWarn: ImgType = {display: 'Warning Image'} ;
  imgFooter: ImgType = {display: 'Footer Image'} ;
  imgPath: string = 'assets/images/select.png';
  // Here we are using Custom Image Selector
  readUrl(event: any, imgType: ImgType) {
   Custom.imageSelector(event, imgType)
  }
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
}

