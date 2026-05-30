import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static passwordMatchValidator(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField)?.value;

      const confirmPassword = control.get(confirmPasswordField)?.value;

      if (password !== confirmPassword) {
        return {
          passwordMismatch: true,
        };
      }

      return null;
    };
  }

  static usernameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string;

      if (!value) {
        return null;
      }

      const usernameRegex = /^[a-zA-Z0-9._]+$/;

      const isValid = usernameRegex.test(value);

      return isValid
        ? null
        : {
            invalidUsername: true,
          };
    };
  }
}
