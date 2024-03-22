import { Controller, Post } from "@nestjs/common";
import { Body } from "@nestjs/common/decorators/http/route-params.decorator";
import { CreateUserDTO } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";
import { LoginDTO } from "./dto/login.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Post('login')
  async login(@Body() body: LoginDTO) {
    return this.authService.login(body);
  }

  @Post('register')
  async register(@Body() body: CreateUserDTO) {
    return this.userService.registerUser(body);
  }
}