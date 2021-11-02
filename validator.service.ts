import { Injectable, Injector } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegExps } from '../model/regex';
import { Server_Response } from '../model/interface/errors';
import { ImgType } from '../model/interface/img-type';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  _fb: FormBuilder;
  _form: FormGroup;
  _submitted = false;
  _toastr: ToastrService;
  constructor(injector: Injector) {
    this._toastr = injector.get(ToastrService);
    this._fb = injector.get(FormBuilder);
    this._form = this._fb.group({});
  }
  // Below Method is to Display Error Messages
  _error(name: string): ValidationErrors {
    let control = this._form?.controls[name];
    if (control?.touched && control.errors) {
      return control.errors['ERROR'];
    }
  }
  _error_control(control: FormControl) {
    if (control.errors) {
      return control?.errors['ERROR'];
    } else return null;
  }
  _error_image(img: ImgType) {
    if (img.error === true) {
      return 'Only jpeg | jpg | png allowed';
    } else if (!img.link && this._submitted) {
      return 'Please select ' + img.display;
    } else return '';
  }
  _error_server(server_response: Server_Response) {
    server_response.errors.forEach((error) => {
      this._toastr.error(
        error.detail[0].message,
        this.toTitleCase(error.field_name)
      );
    });
  }
  private toTitleCase(str) {
    if (str) {
      let field = str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      return field.replace('_', ' ').replace('id', '');
    } else return 'No Property Provided';
  }
  _error_FormArray(internalGroup: FormGroup, control: string) {
    let controlz = internalGroup?.get(control);
    if (controlz?.touched && controlz?.errors) {
      return controlz.errors['ERROR'];
    } else return null;
  }
  _error_FormGroupName(group: string, control: string) {
    let fg = this._form?.get(group) as FormGroup;
    let controlz = fg?.get(control);
    if (controlz?.touched && controlz?.errors) {
      return fg.get(control)?.errors['ERROR'];
    }
    return null;
  }
  // Below Methods is to Add Validation to Control
  /**
    Global Validator
    1. Required Name Display
    2. Is Filed / Select Option
    3. Minimum
    4. Maximum
    6. Only Numeric
    7. Only Alphabets
    8. Alphabets and Numeric
    9. No Special Character except - [space] .
    10. Email abc@domain.xyz
    11. Password Special Character, Numeric, Small / Capital Alphabets
    12. Minimum Value Numeric
    13. Maximum Value Numeric
  */
  _validator(
    field_name: string = '',
    isField: number = 1,
    min: number = 0,
    max: number = 0,
    num: number = 0,
    alpha: number = 0,
    alphaNum: number = 0,
    specialChar: number = 0,
    email: number = 0,
    password: number = 0,
    minVal: number = 0,
    maxVal: number = 0
  ) {
    return (
      control: AbstractControl
    ): {
      [key: string]: { key: string; message: string };
    } | null => {
      let a: string = control.value;
      if (field_name != '' && a === '') {
        if (isField == 1)
          return {
            ERROR: { key: 'required', message: 'Please enter ' + field_name },
          };
        else
          return {
            ERROR: { key: 'required', message: 'Please select ' + field_name },
          };
      } else if (a !== '') {
        if (min != 0 && a?.length < min)
          return {
            ERROR: {
              key: 'MIN',
              message: 'Minimum ' + min + ' characters allowed',
            },
          };
        else if (max != 0 && a?.length > max)
          return {
            ERROR: {
              key: 'MAX',
              message: 'Maximum ' + max + ' characters allowed',
            },
          };
        else if (minVal != 0 && Number(a) < minVal)
          return {
            ERROR: {
              key: 'MIN',
              message: 'Minimum value ' + minVal + ' allowed',
            },
          };
        else if (maxVal != 0 && Number(a) > maxVal)
          return {
            ERROR: {
              key: 'MAX',
              message: 'Maximum value ' + maxVal + ' allowed',
            },
          };
        else if (num != 0 && !RegExps.NUM.test(a))
          return {
            ERROR: {
              key: 'NUM',
              message: 'Only numbers allowed',
            },
          };
        else if (num != 0 && !RegExps.POSITIVENUM.test(a))
          return {
            ERROR: {
              key: 'NUM',
              message: 'Only positive numbers allowed',
            },
          };
        else if (alpha != 0 && !RegExps.ALPHA.test(a))
          return {
            ERROR: {
              key: 'ALPHA',
              message: 'Only alphabets allowed',
            },
          };
        else if (alphaNum != 0 && !RegExps.ALPHANUM.test(a))
          return {
            ERROR: {
              key: 'ALPHANUM',
              message: 'Only alphabets and numbers allowed',
            },
          };
        else if (specialChar != 0 && RegExps.SPECIALCHARS.test(a))
          return {
            ERROR: {
              key: 'PATTERN',
              message: 'Special character not allowed',
            },
          };
        else if (email != 0 && !RegExps.EMAIL.test(a))
          return {
            ERROR: {
              key: 'EMAIL',
              message: 'Invalid email containing “@, .com”',
            },
          };
        else if (password != 0 && !RegExps.PASSWORD.test(a))
          return {
            ERROR: {
              key: 'PASSWORD',
              message:
                'Invalid password Must contains Upper Case, Lower Case, Number and Special Character.',
            },
          };
        else return null;
      }
    };
  }
  // Stop Duplication of FormGroup in FormArray
  _groupValidator(field1: string, field2: string, arrayName: string) {
    return (
      group: FormGroup
    ): {
      [key: string]: { key: string; message: string };
    } | null => {
      let msgDuplicate = {
        ERROR: {
          key: 'Duplicate',
          message: 'Duplicate Selection Not Allowed',
        },
      };
      let fieldA = group?.get(field1);
      let fieldB = group?.get(field2);

      let result = this._form?.get(arrayName)?.value;
      let repeat = 0;
      result?.forEach((item) => {
        if (item[field1] == fieldA.value && item[field2] == fieldB.value)
          repeat++;
      });
      if (repeat > 1) {
        fieldA.setErrors(msgDuplicate);
        fieldB.setErrors(msgDuplicate);
        return msgDuplicate;
      } else if (fieldA.value !== '') {
        fieldA.setErrors(null);
      } else if (fieldB.value !== '') {
        fieldB.setErrors(null);
        return null;
      }
    };
  }
  _passwordMatchValidator(field1: string, field2: string) {
    return (
      group: FormGroup
    ): {
      [key: string]: { key: string; message: string };
    } | null => {
      let fieldA = group?.get(field1);
      let fieldB = group?.get(field2);

      if (fieldA !== null && fieldB !== null) {
        if (fieldB.value == '') {
          let message = {
            ERROR: {
              key: 'required',
              message: 'Please Select Confirm Password',
            },
          };
          // fieldA.setErrors(message);
          fieldB.setErrors(message);
          return message;
        } else if (fieldA.value != fieldB.value) {
          let message = {
            ERROR: {
              key: 'MATCH',
              message: 'your passwords are not match',
            },
          };
          // fieldA.setErrors(message);
          fieldB.setErrors(message);
          return message;
        } else {
          // fieldA.setErrors(null);
          fieldB.setErrors(null);
          return null;
        }
      }
    };
  }
}
