import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { LoaderEnabled } from 'src/app/layouts/loader/loader.service';
import { Custom } from 'src/app/model/base-classes/custom';
import { environment } from 'src/environments/environment';
import { URLz } from '../model/base-classes/base.enum';
import { AnalysisFlat } from '../model/class/DynamicFlatNode';
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
  get(id: number, param = ''): Observable<T> {
    param = param !== '' ? '?' + param: ''
      return this.http.get<T>(this.url + '/' + id + param);
  }
  @LoaderEnabled()
  gets(param = ''): Observable<T> {
    param = param !== '' ? '?' + param: ''
      return this.http.get<T>(this.url + param);
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
  dropDown(url: URLz, p_id: any = ''): Observable<any> {
    p_id = p_id != '' ? ('?parent_id='+ p_id) :  p_id
    return this.http.get<SelectOption[]>(
      environment.API_URL + url + p_id
    );
  }
  // Tree View 
  // Auto Complete
  // Service required here
}
