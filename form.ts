import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { URLz } from 'src/app/model/base-classes/base.enum';
import { BaseFormDropDown } from 'src/app/model/base-classes/base.form.drop-down';
import { BaseService } from 'src/app/service/base.service';
import { environment } from 'src/environments/environment';
import { T } form 'interfaces'

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
  ngOnInit() {
    this._pathLocation = '/path/location';
    this.initForm();
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
      customization: this._fb.array([this.customization()]),
    });
  }
  patchData() {
    this._service.getByCode(this._activeId).subscribe((res: any) => {
      let data: OperatingUnit = res.data.row;
      this._form.patchValue({
        law: data?.law,
        address: data?.address,
        is_deposit: data?.is_deposit,
      });
      if(data.customization.length > 0)
        this.patchCustomization(data.customization);
    });
  }

  // 1 Customization (Initialization)
  customization(): FormGroup {
    return this._fb.group(
      {
        organisation_id: ['', this._validator('Organization', 0)],
        system_id: ['', this._validator('System', 0)],
        prefix: ['', this._validator('Prefix')],
      },
      {
        validators: this._groupValidator(
          'organisation_id',
          'system_id',
          'customization'
        ),
      }
    );
  }
  // 2 Customization (Template Iteration)
  get customizations() {
    return this._form?.get('customization') as FormArray;
  }
  // 3 Customization (Adding)
  addCustom() {
    let custom = <FormArray>this._form.get('customization');
    custom.push(this.customization());
  }
  // 4 Customization (Removing)
  rmvCustom(index: number) {
    let arrayz = <FormArray>this._form.get('customization');
    arrayz.removeAt(index);
  }
  // 5 Customization (Patching)
  patchCustom(
    customization: {
      organisation_id: string;
      system_id: string;
      prefix: string;
    }[]
  ) {
    let formArray = this._form.get('customization') as FormArray;
    if(customization.length > 0)
      formArray.clear();
    customization.forEach((custom) => {
      formArray.push(
        this._fb.group({
          organisation_id: custom.organisation_id,
          system_id: custom.system_id,
          prefix: custom.prefix,
        })
      );
    });
  }
}

