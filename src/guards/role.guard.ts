import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride('roles', [context.getHandler(), context.getClass()]);
    if(!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    const rolesFiltered = requiredRoles.filter(role => role == user.role);

    return rolesFiltered > 0;
  }
}