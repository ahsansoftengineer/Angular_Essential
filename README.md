## BaseInterfaces
> 1. Base / Global Interface is to Handle Global Types
> 2. DropDown
> 3. AutoComplete
> 4. Server Error Response
> 5. Alerts
> 6. etc...
#### Server Errors
```javascript
// 1. httpErrorResponse.errors
export interface Server_Response {
  errors?: Server_Errors[];
  code?: string;
  message?: string;
  component: string; // for frontend
  component_message: string; // for frontend
}
// 2. Secondary Server Error
export interface Server_Errors {
  type?: string;
  field_name?: string;
  detail?: Error_Detail_Server[];
}
// 3. Tritory Server Side Error
export interface Error_Detail_Server {
  code?: string;
  message?: string;
}
```
#### Validator Error Type
```javascript
// 4. Custom Validator Error Type
export interface Error_Internal {
  ERROR?: {
    key?: string;
    message?: string;
  };
}
```
#### Image Select
```javascript
export interface ImgType {
  link?: any;
  file?: File;
  name?: string;
  display?: string;
  error?: boolean;
}
```
#### DropDown / AutoComplete etc..
```javascript
export interface SelectOption{
  id: string;
  title:string;
  code?:string;
  parent_id?:string;
}
```
#### AutoComplete
> * AutoComplete is Also Depons on SelectOption
> * I think this should be of type class
```javascript
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { URLz } from "../base-classes/base.enum";
import { SelectOption } from "./select";

export interface AutoComplete{
  url: URLz
  control: FormControl;
  list?: SelectOption[];
  temp?: Observable<SelectOption[]>;
  page?: number;
  rows?: number;
}
```
#### Alert
```javascript
export interface Alert{
  code: string;
  title: string;
  message: string;
}
```
#### Heading
```javascript

```