import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService
  ) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    
    try {
      const userToken = this.authService.checkToken((req.headers.authorization ?? '').split(' ')[1]);
      req['user'] = userToken;
    } catch(err) {
      return false;
    }
      
    return true;
  }
}