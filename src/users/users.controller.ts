import { Controller, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth } from '../iam/authentication/decorator/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  @Auth(AuthType.Bearer)
  @ApiBearerAuth()
  async updateMany() {
    return this.usersService.updateRoles();
  }
}
