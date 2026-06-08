import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const dateRangeValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;

  if (!startDate || !endDate) {
    return null;
  }

  return new Date(startDate) <= new Date(endDate)
    ? null
    : { invalidDateRange: true };
};