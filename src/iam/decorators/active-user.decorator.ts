import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../iam.constants';
import { ActiveUserDataInterface } from '../interfaces/active-user-data.interface';

export const ActiveUser = createParamDecorator(
  (
    field: keyof ActiveUserDataInterface | undefined,
    ctx: ExecutionContext,
  ): string | ActiveUserDataInterface => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserDataInterface | undefined = request[REQUEST_USER_KEY];
    return field ? user?.[field] : user;
  },
);
