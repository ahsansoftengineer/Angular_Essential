import { Component, Injector, OnInit } from '@angular/core';
import { URLz } from 'src/app/model/base-classes/base.enum';
import { BaseForm } from 'src/app/model/base-classes/base.form';
import { T } from 'src/app/model/form-model/interface';
import { BaseService } from 'src/app/service/base.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-place-add',
  templateUrl: './place-add.component.html',
  styleUrls: ['./place-add.component.css']
})
export class ComponentName extends BaseForm implements OnInit {
  constructor(
    injector: Injector,
    ss: BaseService<T>
  ) {
    super(injector);
    ss.url = environment.API_URL + URLz.PLACE
    super._service = ss;
  }
  ngOnInit() {
    this.initForm();
    this._pathLocation = "/path/location";
    this._activeId = this._activeRoute.snapshot.paramMap.get("id");
    if (this._activeId != "null" && Number(this._activeId) > 0)
     this.patchData();
  }
  initForm() {
    this._form = this._fb.group({
        title: ['', this._validator('Place Title', 1, 4, 100,0,1)] // Unique
    });
  }
  patchData(){
    this._service.getSingle(+this._activeId)
    .subscribe((res: any) => {
      this._form.patchValue({
        title: res.data.row.title
      });
    });
  }
}
