import { UserRole } from '../../features/auth/enums/user-role.enum';

import { ProfileStatus } from '../../features/profile/enums/profile-status.enum';
export interface User {
  id: string;

  email: string;

  role: UserRole;

  profileStatus: ProfileStatus;
}
