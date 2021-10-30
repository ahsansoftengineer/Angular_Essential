import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BaseService } from '../../service/base.service';
import { URLz } from './base.enum';
import { Custom } from './custom';

@Component({
  template: '',
})
// In Base Class append all the properties / methods with _ (underscore)
export abstract class BaseList implements OnInit {
  ngOnInit(){
    Custom.statusEmmit.subscribe(status => {
      this._refresh();
    })
    this._reset();
    this._refresh();
  }
  // This Properties Must Override
  public URLz = URLz
  _component: string = 'Override _component property in in Your ngOnInit';
  _service: BaseService<any>;
  _columns: string[] = [];
  _pathLocation: string;

  // Other Properties
  _dataSource = new MatTableDataSource([]);
  _tbl: any = {};
  _search: any = {};
  // activate: boolean = true;
  _router: Router;
  _status: any = {
    id: '',
    activate: '',
  };
  // Model Properties
  show: Array<any> = [];
  modalService: NgbModal;
  viewList:any = []
  protected constructor(injector: Injector) {
    this._router = injector.get(Router);
    this.modalService = injector.get(NgbModal);
  }
  _switch(id = undefined) {
    if (id) this._router.navigate(
      [this._pathLocation, { id }]
    );
    else this._router.navigate([this._pathLocation]);
  }
  _delete(id: number) {
    Custom.SwalFireDelete(this._service, this._component, id);
  }
  _statusChange(value: boolean, id: number) {
    this._status.activate = +value;
    this._status.id = id;
    Custom.SwalFireStatusChange(
      this._service, this._status, this._component
    );
  }
  _reset() {
    this._tbl =
    {
      length: 0,
      index: 0,
      prevIndex: 0,
      size: 10,
      sizes: [5, 10, 20],
      orderBy: '',
      orderType: ''
    }
    this._search = {};
    this.show = [];
  }
  _stop(event){
    event.stopPropagation()
  }
  _sort(sort: Sort) {
    this._tbl.orderBy = sort.active
    this._tbl.orderType = sort.direction
    this._refresh();
  }
  _paginate(event?:PageEvent): PageEvent{
    this._tbl.index = event.pageIndex;
    this._tbl.length = event.length;
    this._tbl.size = event.pageSize;
    this._tbl.prevIndex = event.previousPageIndex;
    this._refresh();
    return event;
  }
  // Search Functionality
  _refresh(params: string = '') {
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
  // Model will before Removed
  _openViewModal(targetModal: NgbModal, id: number) {
    this.viewList = [];
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    if (id != null) {
      this._service.getSingle(id).subscribe((res: any) => {
        this.viewList.push(res.data.row);
      });
    }
  }
  _modelDismiss() {
    this.modalService.dismissAll();
  }
}
