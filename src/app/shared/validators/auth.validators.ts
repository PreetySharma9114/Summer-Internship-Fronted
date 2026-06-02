import { Validators } from '@angular/forms';
import { VALIDATION } from '../../core/constants/validation.constants';

export const AuthValidators = {
  email: [Validators.required, Validators.email],

  password: [Validators.required, Validators.minLength(VALIDATION.PASSWORD_MIN_LENGTH)],
  role: [Validators.required],
  otp: [
    Validators.required,
    Validators.minLength(VALIDATION.OTP_LENGTH),
    Validators.maxLength(VALIDATION.OTP_LENGTH),
  ],
  confirmPassword: [Validators.required, Validators.minLength(VALIDATION.PASSWORD_MIN_LENGTH)],
};
