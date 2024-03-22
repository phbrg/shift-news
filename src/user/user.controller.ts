import { Body, Controller, Put, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { EditUserDTO } from "./dto/edit-user.dto";
import { AuthGuard } from "src/guards/auth.guard";

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @UseGuards(AuthGuard)
  @Put()
  async editUser(@Body() body: EditUserDTO, @Req() req: Request) {
    return this.userService.editUser(body, req);
  }
}