import { UserRole } from '../enums/user-role.enum';

export interface RegisterDto {
  email: string;
  role: UserRole;
}
