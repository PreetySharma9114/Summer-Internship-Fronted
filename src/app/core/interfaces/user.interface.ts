import { UserRole }
from '../enums/user-role.enum';

import { ProfileStatus }
from '../enums/profile-status.enum';

export interface User {

  id: string;

  email: string;

  role: UserRole;

  profileStatus: ProfileStatus;
}