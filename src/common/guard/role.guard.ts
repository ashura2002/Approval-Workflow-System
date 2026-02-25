import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE_KEY } from '../decorators/role.decorator';
import { JwtResponseType } from '../types/IJwtResponse.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // for for public routes
    if (!requiredRoles || requiredRoles.length === 0) return true;

    const loginUser: JwtResponseType = context.switchToHttp().getRequest().user;
    if (!loginUser || !loginUser.role) return false;

    return requiredRoles.includes(loginUser.role);
  }
}
