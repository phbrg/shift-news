import { Controller, Post } from "@nestjs/common";
import { Body } from "@nestjs/common/decorators/http/route-params.decorator";
import { CreateUserDTO } from "src/user/dto/create-user.dto";
import { UserService } from "src/user/user.service";
import { LoginDTO } from "./dto/login.dto";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Post('login')
  async login(@Body() body: LoginDTO) {
    //
  }

  @Post('register')
  async register(@Body() body: CreateUserDTO) {
    return this.userService.registerUser(body);
  }
}