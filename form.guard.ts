import { Injectable } from '@angular/core';
import {
  CanDeactivate,
} from '@angular/router';
import { Custom } from '../model/base-classes/custom';

// How to Create a Guard?
// Follow Three Steps
// 1. Build the Route Guard
// 2. Register the guard (portal.module.ts)
// 3. Tie the Guard a route. (portal-routing.module.ts)
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
