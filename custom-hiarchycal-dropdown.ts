import { Component, Injector, OnInit } from '@angular/core';
import { URLz } from 'src/app/model/base-classes/base.enum';
import { BaseFormDropDown } from 'src/app/model/base-classes/base.form.drop-down';
import { T } from 'src/app/model/form-model/interface';
import { BaseService } from 'src/app/service/base.service';
import { environment } from 'src/environments/environment';

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
    this.__totalDropdown = 2
    this.initForm();
    this.initDropDown();
    this._activeId = this._activeRoute.snapshot.paramMap.get('id');
    if (this._activeId) {
      this.patchData();
    }
  }
  initForm() {
    this._form = this._fb.group({
      bg: [{value: '', disabled: true},  this._validator('Business Group', 0)],
      le: [{value: '', disabled: true}, this._validator('Legal Entity', 0)],
      ou: [{value: '', disabled: true}, this._validator('Operating Unit', 0, 4, 100)],
    });
  }
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

  initDropDown() {
    this._dropdown(URLz.BG).subscribe(
      (res) => (this.__ddl.bg = res.data.records)
    );
  }
}

