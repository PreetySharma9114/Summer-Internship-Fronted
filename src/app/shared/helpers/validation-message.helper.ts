import { AbstractControl } from '@angular/forms';

export function getValidationMessage(control: AbstractControl | null): string {
  if (!control || !control.errors || !control.touched) {
    return '';
  }

  if (control.errors['required']) {
    return 'This field is required';
  }

  if (control.errors['email']) {
    return 'Please enter a valid email address';
  }

  if (control.errors['minlength']) {
    return `Minimum length is ${control.errors['minlength'].requiredLength}`;
  }

  if (control.errors['maxlength']) {
    return `Maximum length is ${control.errors['maxlength'].requiredLength}`;
  }

  if (control.errors['pattern']) {
    return 'Invalid format';
  }

  if (control.errors['invalidUsername']) {
    return 'Only letters, numbers, dots and underscores allowed';
  }

  return 'Invalid value';
}
