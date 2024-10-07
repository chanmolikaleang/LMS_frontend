import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

type User = {
  sub: string;
  email: string;
  permissions: string[];
  role: string;
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      'permissions',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user as User;

    if (!user) {
      throw new UnauthorizedException(
        'Authentication is required to access this resource',
      );
    }

    if (!user.role || !user.permissions) {
      const message = !user.role
        ? 'You do not have role assigned'
        : 'You do not have any permissions assigned';
      throw new ForbiddenException(message);
    }

    const userPermissions = await this.getUserPermissions(user);

    if (!this.hasRequiredPermissions(userPermissions, requiredPermissions)) {
      throw new ForbiddenException(
        'You do not have the required permissions to access this resource',
      );
    }

    return true;
  }

  private async getUserPermissions(user: User): Promise<string[]> {
    return user.permissions;
  }

  private hasRequiredPermissions(
    userPermissions: string[],
    requiredPermissions: string[],
  ): boolean {
    return requiredPermissions.some((permission) =>
      this.hasPermission(userPermissions, permission),
    );
  }

  private hasPermission(
    userPermissions: string[],
    permission: string,
  ): boolean {
    if (userPermissions.includes('*:*')) return true;

    const [, resource] = permission.split(':');
    const resourceWildcard = `*:${resource}`;
    const generalWildcard = '*:*';

    return userPermissions.some((userPermission) =>
      [permission, resourceWildcard, generalWildcard].includes(userPermission),
    );
  }
}
