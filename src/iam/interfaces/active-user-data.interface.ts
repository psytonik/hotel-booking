import { Role } from '../../users/enums/roles.enum';

export interface ActiveUserDataInterface {
  sub: string;
  email: string;
  role: Role;
}
