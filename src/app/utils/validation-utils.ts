import {AbstractControl, ValidationErrors} from '@angular/forms';

export function notEmailValidator(control: AbstractControl): ValidationErrors | null {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailPattern.test(control.value)) {
    return {isEmail: true};
  }
  return null;
}
