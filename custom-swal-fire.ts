import { Component, Injector, OnInit } from '@angular/core';
import { BaseListDropDown } from 'src/app/model/base-classes/base.list.drop-down';
import { URLz } from 'src/app/model/base-classes/base.enum';
import { BaseService } from 'src/app/service/base.service';
import { Organaization } from 'src/app/model/form-model/org';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-org-list',
  templateUrl: './org-list.component.html',
  styleUrls: ['./org-list.component.css']
})
export class OrgListComponent extends BaseListDropDown implements OnInit {
  constructor(
    public injector: Injector,
    protected orgService: BaseService<Organaization>
  ) {
    super(injector);
    orgService.url = environment.API_URL + URLz.ORG
    super._service = orgService;
  }
  ngOnInit() {
    this._pathLocation = "/organaization/org_add";
    this._component = "Donation Organization"
    this._columns = ['id', 'title', 'system', 'activate', 'actions'];
    super.ngOnInit();
    this.initDropDown();
  }
  initDropDown(){
    this._dropdown(URLz.SYSTEM).subscribe(res =>
      this.__ddl.system_id = res.data.records
    );
  }
}
