## Base Service V-2
> 1. Service is Design to Full fill Maximum Needs
> 2. Service Must be Generics
  > *  Genernics Service Doesn't Instantiate again for andn for every Generic Type
> 3. All the Methods in Service Must have Extra Default Parameter
  > * param 
> 4. Must has SelectOption individually Generic
> 5. Must have url
> 6. Must Inject HttpClient
> 7. Must has Methods getAll, getSingle, create, update, delete,
#### Imports / Constructor
> * Imports
> * Constructor
```javascript
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
export class BaseService<T> {
  public url: string;
  public http: HttpClient;
  constructor(injector: Injector) {
    this.http = injector.get(HttpClient);
  }
```
#### GetAll / Gets
> * Name Could be getAll / gets 
```javascript
  @LoaderEnabled()
  gets(param: string = ''): Observable<T> {
    param = param !== '' ? '?' + param: ''
      return this.http.get<T>(this.url + param);
  }
```
#### GetSingle / Get
> * id is required parameter
```javascript
  @LoaderEnabled()
  get(id: number, param = ''): Observable<T> {
    param = param !== '' ? '?' + param: ''
      return this.http.get<T>(this.url + '/' + id + param);
  }
```
#### Create
> * Data could except formData / formGroup
```javascript
  @LoaderEnabled()
  create(data: T, param: string = '') {
    param = param !== '' ? '?' + param: ''
    return this.http.post(this.url + param, data)
      .pipe(catchError(Custom.handleError));
  }
```
#### Update
> * Data could except formData / formGroup
```javascript
  @LoaderEnabled()
  update(data: any, param: string = '') {
    return this.http.post(this.url + '?_method=PUT' + param, data)
    .pipe(catchError(Custom.handleError));
  }
```
#### Delete
> * Id must be required
```javascript
  @LoaderEnabled()
  delete(id: number, param: string = '') {
    return this.http.post(this.url + '/' + id + '?_method=DELETE' + param, id);
  }
```
#### Get Specific
> * Don't Know the Reason
```javascript
  @LoaderEnabled()
  getSpecific(): Observable<T> {
    return this.http.get<T>(this.url + '?fields=id,name&activate=1');
  }
```
#### Status
> * For Specific Reason
```javascript
  @LoaderEnabled()
  status(data:any, param: string = '') {
    return this.http.post(this.url + '?_method=PATCH' + param, data);
  }
```
#### Get Exsisting User
> * Could be Used by GetSingle
```javascript
  getExistingUser(url:any,param:any){
    return this.http.get<any>(url+'?username='+param);
  }
```
#### Select Options 
> * Url Enum is Required
> * p_id is Optional
> * URL Changes Frequently cannot set for Specific Components
```javascript
  @LoaderEnabled()
  selectOptionService(url: URLz, p_id: any = ''): Observable<any> {
    p_id = p_id != '' ? ('?parent_id='+ p_id) :  p_id
    return this.http.get<SelectOption[]>(
      environment.API_URL + url + p_id
    );
  }
```
#### AutoComplete
> * Here Three things Hapening
> * Scroll to Load more
> * Save the Data in Memory
> * If Search Exsist Fetch it Locally
> * If Search Doesn't Exsist Fetch it from API
> * Only This needs Modification so far
```javascript
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
        let str = val.replace(/[^A-Za-z0-9(),-_.,]/ig, " ")
        var regex = new RegExp(`/*${str}/*`, 'ig');
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
              return ac.list;
            })
          );
        }
      })
    );
  }
```