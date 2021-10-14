import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { LoaderEnabled } from 'src/app/layouts/loader/loader.service';
import { Custom } from 'src/app/model/base-classes/custom';
import { environment } from 'src/environments/environment';
import { URLz } from '../model/base-classes/base.enum';
import { SelectOption } from '../model/interface/select';

@Injectable({
  providedIn: 'root',
})
// Base Service Must be Generic
// Must have url
// Must Inject HttpClient
// Must has Methods getAll, getSingle, create, update, delete,
// Must has SelectOption individually Generic
export class BaseService<T> {
  public url: string;
  public http: HttpClient;
  constructor(injector: Injector) {
    this.http = injector.get(HttpClient);
  }
  @LoaderEnabled()
  getAll(param: string = ''): Observable<T> {
    param = param !== '' ? '?' + param: ''
      return this.http.get<T>(this.url + param);
  }
  @LoaderEnabled()
  getSingle(id: number, param: string = ''): Observable<T> {
    param = param !== '' ? '?' + param: ''
      return this.http.get<T>(this.url + '/' + id + param);
  }
  getByCode(id: string): Observable<T> {
    return this.http.get<T>(this.url + '/' + id);
  }
  @LoaderEnabled()
  create(data: T, param: string = '') {
    param = param !== '' ? '?' + param: ''
    return this.http.post(this.url + param, data)
      .pipe(catchError(Custom.handleError));
  }
  @LoaderEnabled()
  update(data: any, param: string = '') {
    return this.http.post(this.url + '?_method=PUT' + param, data)
    .pipe(catchError(Custom.handleError));
  }
  @LoaderEnabled()
  delete(id: number, param: string = '') {
    return this.http.post(this.url + '/' + id + '?_method=DELETE' + param, id);
  }
  @LoaderEnabled()
  getSpecific(): Observable<T> {
    return this.http.get<T>(this.url + '?fields=id,name&activate=1');
  }
  @LoaderEnabled()
  status(data:any, param: string = '') {
    return this.http.post(this.url + '?_method=PATCH' + param, data);
  }
  getexistingUser(url:any,param:any){
    return this.http.get<any>(url+'?username='+param);
  }
  @LoaderEnabled()
  selectOptionService(url: URLz, p_id: any = ''): Observable<any> {
    p_id = p_id != '' ? ('?parent_id='+ p_id) :  p_id
    return this.http.get<SelectOption[]>(
      environment.API_URL + url + p_id
    );
  }
  // Not in Used
  @LoaderEnabled()
  autoCompleteService(
    urlz: URLz,
    params: string = '',
    opts: SelectOption[] = []
  ): Observable<any> {
    let url = environment.API_URL + urlz;
    if (params === '') {
      return opts.length
        ? of(opts)
        : this.http
            .get<SelectOption[]>(url);
    } else {
      return opts.length
        ? of(opts)
        : this.http
            .get<SelectOption[]>(url + '?' + params);
    }
  }
}
