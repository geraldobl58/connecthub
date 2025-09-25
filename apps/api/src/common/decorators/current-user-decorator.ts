import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../interfaces/request.interface';

export interface CurrentUser {
  userId: string;
  email: string;
  name: string;
  role: Role;
}

export const GetCurrentUser = createParamDecorator(
  (data: keyof CurrentUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    if (data) {
      return user?.[data];
    }
    return user;
  },
);
