## Guard
> * Follow Three Steps
> 1. Build the Route Guard
> 2. Register the guard (module.module.ts)
> 3. Tie the Guard a route. (module-routing.module.ts)

```javascript
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Custom } from '../model/base-classes/custom';
@Injectable({
  providedIn: 'root',
})
export class FormGuard implements CanDeactivate<any> {
  canDeactivate(component: any): Promise<boolean> | boolean {
    if (component._form.dirty) {
      return Custom.FormLeave(
        'Are you sure',
        'The Changes will be disregard'
      ).then(x => x.isConfirmed);
    } else return true
  }
}
```
#### Swal Fire for Guard
```javascript
  public static async FormLeave(
    title: string,
    text: string
  ) {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      return result
    });
  }
```
#### Guard Utilization in Routing
```javascript
export const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: '',
        redirectTo: 'ou',
        pathMatch: 'full'
      },
      {
        path: "ou_add",
        component: OUAddComponent,
        canDeactivate: [FormGuard],
        data: {
          title: "Operating Unit",
          urls: [
            { title: "Operating Unit"},
            { title: "Add" },
          ]
        }
      },
      {
        path: "ou",
        component: OUListComponent,
        data: {
          title: "Operating Unit",
          urls: [
            { title: "Operating Unit" },
            { title: "List" },
          ],
        },
      },
    ]
  }
]
```