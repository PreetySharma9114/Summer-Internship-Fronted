import { User } from '../../../shared/interfaces/user.interface';
export interface Session {
  token: string;

  user: User;
}