# Custom Methods Version 0.0.1
## Imports
```typescript
import { HttpErrorResponse } from '@angular/common/http';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { throwError } from 'rxjs';
import { IProductCategory } from '../interfaces/product-category.interface';
export class CustomMethods {
```
## Time Computetation
```typescript
  public static computeDuration(
    oldDate: string | Date = new Date('February 26, 2021 11:21:00')
  ): string {
    const cd: Date = new Date(); // Current Date
    let date = new Date(oldDate); // Essential Code
    // Today
    if (date.toDateString() === cd.toDateString()) {
      if (cd.getHours() === date.getHours()) {
        if (cd.getMinutes() === date.getMinutes()) {
          return cd.getSeconds() - date.getSeconds() + ' Seconds ago';
        } else {
          return cd.getMinutes() - date.getMinutes() + ' Minutes ago';
        }
      } else {
        return cd.getHours() - date.getHours() + ' Hours ago';
      }
    }
    // Yesterday & Before Yesterday
    else if (
      date.getFullYear() === cd.getFullYear() &&
      date.getMonth() === cd.getMonth()
    ) {
      if (cd.getDate() - 1 === date.getDate()) {
        return ' Yesterday ' + date.toTimeString().slice(0, 9);
      } else {
        return (
          new Date(date).toDateString() +
          ' ' +
          new Date(date).toTimeString().slice(0, 9)
        );
      }
    } else {
      return (
        new Date(date).toDateString() +
        ' ' +
        new Date(date).toTimeString().slice(0, 9)
      );
    }
  }
```
## Email Domain Validation
```typescript
  // Validator Closure anonymous Function inside another Function
  public static emailDomain(domainName: string = 'pragimtech.com') {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email: string = control.value;
      const domain: string = email.substring(email.lastIndexOf('@') + 1);
      // Here we are checking two things
      // 1. email is blank means Validation Pass (No need to display message)
      // 2. domain match means Validation Pass (No need to display message)
      // Indicating No Error (Validation Pass)
      if (email === '' || domain.toLowerCase() === domainName.toLowerCase()) {
        return null;
      }
      // Indicating (Validation Fails) (Display the Message)
      else {
        return { emailDomain: true };
      }
    };
  }
```
## Validation Default Value
```typescript
  // Validating Select Option
  public static selectValidator(defaultValue: string = '0') {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedValue: string = control.value;
      if (selectedValue === '0') {
        return { emailDomain: true };
      } else {
        return null;
      }
    };
  }
```
## Email Match
```typescript
  public static matchEmail(
    groupControl: AbstractControl
  ): { [key: string]: any } | null {
    const emailControl = groupControl.get('email');
    const confirmEmailControl = groupControl.get('confirmEmail');
    if (
      emailControl.value === confirmEmailControl.value ||
      confirmEmailControl.pristine
    ) {
      return null;
    } else {
      return { emailMisMatch: true };
    }
  }

```
## Http Error Handler
```typescript
  public static handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      // console.error('Client Side Error :', errorResponse.error.message);
    } else {
      // console.error('Server Side Error :', errorResponse);
    }
    return throwError(
      'There is a problem with the service. We are notified & working on it. Please try again later.'
    );
  }
```
## Setting Controls FormArray and FormGroup Blanck
```typescript
  public static setAllControlBlank(group: FormGroup | FormArray): FormGroup {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.controls[key];

      if (
        abstractControl instanceof FormGroup ||
        abstractControl instanceof FormArray
      ) {
        this.setAllControlBlank(abstractControl);
      } else {
        abstractControl.markAsDirty();
      }
    });
    return <FormGroup>group;
  }
```
## Recursive Function
```typescript
  // Hiearchy Structure of Product Category & Product Category Node
  public static startRecursiveFunction(
    productCategoriesFlat: IProductCategory[]
  ): IProductCategory[] {
    const productCategoryNode: IProductCategory[] = [];
    productCategoriesFlat
      .filter((x) => x.pId === null || x.pId === 0)
      .forEach((parentCategory) => {
        const parentTreeView: IProductCategory = {
          id: parentCategory.id,
          category: parentCategory.category,
          description: parentCategory.description,
        };
        const childs = productCategoriesFlat.filter(
          (x) => x.pId === parentCategory.id
        );
        if (childs || childs.length > 0) {
          this.repeatRecursiveFunction(
            childs,
            parentTreeView,
            productCategoriesFlat
          );
        }
        productCategoryNode.push(parentTreeView);
      });
    return productCategoryNode;
  }
```
## Recursive Function 2
```typescript
  private static repeatRecursiveFunction(
    childCategories: IProductCategory[],
    parentTree: IProductCategory,
    productCategories: IProductCategory[]
  ) {
    childCategories.forEach((cc) => {
      const childTreeView: IProductCategory = {
        id: cc.id,
        category: cc.category,
        description: cc.description,
      };
      const childs = productCategories.filter((x) => x.pId === cc.id);
      if (childs) {
        this.repeatRecursiveFunction(childs, childTreeView, productCategories);
      }
      if (parentTree.subCategory == null) {
        parentTree.subCategory = [childTreeView];
      } else {
        parentTree.subCategory.push(childTreeView);
      }
    });
  }
```
## Recursive Function 3
```typescript
  private static result: string = '';
  public static startProductCategory(
    categorys: IProductCategory[]
  ): IProductCategory[] {
    let cates: IProductCategory[] = categorys.copyWithin(-1,0)
    categorys.forEach((cate, i) => {
      this.result = cate.category;
      if (cate.pId) {
        let cate2 = categorys.find((x) => x.id === cate.pId);
        if (cate2) {
          this.result = cate2.category + ' > ' + this.result;
        }
      }
      cates[i].category = this.result;
  });
    return cates;
  }
}




























```