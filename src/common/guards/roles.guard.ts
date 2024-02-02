// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines whether the current user has the required roles to access a specific route.
   * @param {ExecutionContext} context - The execution context of the current request.
   * @returns {boolean} - True if the user has the required roles, false otherwise.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    // console.log('request', request.headers.authorization);

    // console.log(token);
    const user = request.user; // Ensure user is defined

    if (!user || !user.roles) {
      console.log('User or roles undefined');
      return false; // Deny access if user or roles are undefined
    }

    console.log('Required Roles:', requiredRoles);
    console.log('User Roles:', user.roles);

    const hasRequiredRoles = requiredRoles.some((role) =>
      user.roles.includes(role),
    );
    console.log('Has Required Roles:', hasRequiredRoles);

    return hasRequiredRoles;
  }
}
