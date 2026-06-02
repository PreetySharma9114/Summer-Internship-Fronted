import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class CustomValidators {
  static passwordMatchValidator(
    passwordField: string,
    confirmPasswordField: string,
  ): ValidatorFn {
    return (
      control: AbstractControl,
    ): ValidationErrors | null => {
      const password =
        control.get(passwordField)?.value;

      const confirmPassword =
        control.get(confirmPasswordField)?.value;

      return password !== confirmPassword
        ? { passwordMismatch: true }
        : null;
    };
  }
}
