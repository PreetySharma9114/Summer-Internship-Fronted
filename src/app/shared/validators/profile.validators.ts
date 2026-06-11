import { Validators } from '@angular/forms';
import { VALIDATION } from '../../core/constants/validation.constants';

export const ProfileValidators = {
  brandName: [
    Validators.required,
    Validators.minLength(VALIDATION.NAME_MIN_LENGTH),
    Validators.maxLength(VALIDATION.NAME_MAX_LENGTH),
  ],

  website: [Validators.required, Validators.pattern(/^https?:\/\/.+/)],

  description: [
    Validators.required,
    Validators.minLength(VALIDATION.DESCRIPTION_MIN_LENGTH),
    Validators.maxLength(VALIDATION.DESCRIPTION_MAX_LENGTH),
  ],

  instagramUsername: [Validators.pattern(/^[a-zA-Z0-9._]+$/)],

  fullName: [
    Validators.required,
    Validators.minLength(VALIDATION.NAME_MIN_LENGTH),
    Validators.maxLength(VALIDATION.NAME_MAX_LENGTH),
  ],

  username: [Validators.required, Validators.pattern(/^[a-zA-Z0-9._]+$/)],
  bio: [
    Validators.required,
    Validators.minLength(VALIDATION.BIO_MIN_LENGTH),
    Validators.maxLength(VALIDATION.BIO_MAX_LENGTH),
  ],
  niches: [Validators.required],
  industry: [Validators.required],
  instagramFollowers: [Validators.required],
};
