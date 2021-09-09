# Base List Version 0.0.1
## Imports
```typescript
import { Component, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  template: "",
})
```
## Properties for Paging, Sorting, Display ModelView
```typescript
// In Base Class append all the properties / methods with _ (underscore)
export abstract class BaseList {
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  list = [];
  viewList = [];
  activate: boolean = true;
  search: any = {};
  _globalOrderBy = "";
  _globalOrderType = "";
  _router: Router;
  modalService: NgbModal;
  show: Array<any> = [];
  _service: any;
  protected _pathLocation: string;

  protected constructor(injector: Injector) {
    this._router = injector.get(Router);
    this.modalService = injector.get(NgbModal);
  }
  _switch(id: any = null) {
    this._router.navigate([this._pathLocation, { id: id }]);
  }
```
## Reseting All properties to Default
```typescript
  _reset_parent() {
    this.page = 1;
    this.pageSize = 10;
    this.collectionSize = 0;
    this.activate = true;
    this.search = {};
    this._globalOrderBy = "";
    this._globalOrderType = "";
    this.show = [];
  }
```
## Sorting
```typescript
  _asc_desc(el) {
    this._globalOrderType = el.getAttribute("data-order");
    this._globalOrderBy = el.getAttribute("data-name");
    if (this._globalOrderType == "desc") {
      el.setAttribute("data-order", "asc");
    } else {
      el.setAttribute("data-order", "desc");
    }
    this.refresh();
  }
```
## Display Data as per current State of Properties
```typescript
  refresh(params: string = "") {
    params += `&limit=${this.pageSize}&page=${this.page}`;
    params += this._searchfunction(this.search);
    if (this._globalOrderBy != "" && this._globalOrderType != "") {
      params += `&order_by=${this._globalOrderBy}&order_type=${this._globalOrderType}`;
    }
    this._service.getAll(params).subscribe((res: any) => {
      this.list = res.data.records;
      this.collectionSize = res.data.totalRecords;
    });
  }
```
## Generating Query Param as per Json Search Object
```typescript
  private _searchfunction(searchObject: any) {
    let result = "";
    for (var key of Object.keys(searchObject)) {
      if (searchObject[key].length > 0)
        result += "&" + key + "=" + searchObject[key];
    }
    return result;
  }
```
## Displaying Model for Selected Item
```typescript
  _openViewModal(targetModal: NgbModal, id: number) {
    this.viewList = [];
    this.modalService.open(targetModal, {
      centered: true,
      backdrop: "static",
      size: "lg",
    });
    if (id != null) {
      this._service.getSingle(id).subscribe((res: any) => {
        this.viewList.push(res.data.row);
      });
    }
  }
```
## Closing Model
```typescript
  _modelDismiss() {
    this.modalService.dismissAll();
  }
}

```