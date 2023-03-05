import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { UserRole } from '../../../domain/auth/role.enum';
import { User } from '../../../domain/auth/user';

export type ReqWithUser = {
  user: User;
};
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const { user }: ReqWithUser = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
