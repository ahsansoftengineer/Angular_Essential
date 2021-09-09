# Base Service Version 0.0.1

```typescript
import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { LoaderEnabled } from "src/app/layouts/loader/loader.service";
import { Custom } from "src/app/model/class/custom";
import { environment } from "src/environments/environment";
import { SelectOption } from "../interface/select";

@Injectable({
  providedIn: "root",
})
// Base Service Must be Generic
// Must have url
// Must Inject HttpClient
// Must has Methods getAll, getSingle, create, update, delete,
// Must has SelectOption individually Generic
export class BaseService<T> {

  public url = environment.API_URL;
  protected http: HttpClient
  constructor(injector : Injector) {
    this.http = injector.get(HttpClient)
  }
  @LoaderEnabled()
  getAll(params: string = ""): Observable<T> {
    if (params) {
      return this.http.get<T>(this.url + "?" + params);
    } else {
      return this.http.get<T>(this.url);
    }
  }
  @LoaderEnabled()
  getSingle(id: number): Observable<T> {
    return this.http.get<T>(this.url + "/" + id);
  }
  @LoaderEnabled()
  create(data: T) {
    return this.http.post(this.url, data).pipe(catchError(Custom.handleError));
  }
  @LoaderEnabled()
  update(data: T) {
    return this.http.post(this.url + "?_method=PUT", data);
  }
  @LoaderEnabled()
  delete(id: number) {
    return this.http.post(this.url + "/" + id + "?_method=DELETE", id);
  }
  @LoaderEnabled()
  getSpecific(): Observable<T> {
    return this.http.get<T>(
      this.url + "?fields=id,name&activate=1"
    );
  }
  @LoaderEnabled()
  status(data) {
    return this.http.post(this.url + "?_method=PATCH", data);
  }
```
## Angular Material Auto Complete
```typescript
  @LoaderEnabled()
  autoCompleteService(url: string, params: string = "", opts: SelectOption[] = []):
   Observable<SelectOption[]> {
    // Set Here URL as per your Resource
    url = 'https://retoolapi.dev/Y17vhE/' + url
    if (params === "") {
      return opts.length ?
      of(opts) :
      this.http.get<SelectOption[]>(url)
      .pipe(tap(
        data => opts = data
      ))
    } else {
      return opts.length ?
      of(opts) :
      this.http.get<SelectOption[]>(url + "?" + params).pipe(
        tap(
          data => opts = data
        ))
    }
  }
```
## Angular Material Select Option
```typescript
  @LoaderEnabled()
  selectOptionService(url: string):
   Observable<SelectOption[]> {
    // Set Here URL as per your Resource
    url = 'https://retoolapi.dev/Y17vhE/' + url
      return this.http.get<SelectOption[]>(url)
  }
}

```