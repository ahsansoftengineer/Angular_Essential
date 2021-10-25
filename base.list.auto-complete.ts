import { Injectable, Injector } from '@angular/core';
import { of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AutoComplete } from '../interface/auto-complete';
import { SelectOption } from '../interface/select';
import { BaseListDropDown } from './base.list.drop-down';

@Injectable({
  providedIn: 'root',
})
export class BaseListAutoComplete extends BaseListDropDown {
  constructor(public injector: Injector) {
    super(injector);
  }
  private __limit = 1000;
  _autoComplete(ac: AutoComplete) {
    ac.temp =  ac.control.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
      filter((val) => val?.length > 3),
      // Stop mean while new request arrives
      switchMap((val) => {
        if(ac.page === undefined)
          ac.page = 1;
        let filteredRecord: SelectOption[];
      // Here needs working for Special Character to use
        let str = val.replace(/[^A-Za-z0-9() ]/ig, " ")
        var regex = new RegExp(`/*${str}/*`, 'i');
        if (ac.list?.length > 1) {
          filteredRecord = ac.list.filter(
            (res) => res.title.search(regex) != -1
          );
        }
        if (filteredRecord?.length > 0) {
          return of(filteredRecord);
        } else {
          let urlz = environment.API_URL + ac.url;
          let param = `?title=${val}&limit=${this.__limit}&page=${ac.page}`;
          return this._service.http.get<any>(urlz + param).pipe(
            map((res) => {
              ac.rows = res.data.totalRecords;
              ac.list = res.data.records.filter(
                (res) => res.title.search(regex) != -1
              );
              // ac.button = ac.rows > ac.list?.length;
              return ac.list;
            })
          );
        }
      })
    );
  }
}
