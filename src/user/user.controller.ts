import { Body, Controller, Delete, Get, Param, Put, Req, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { EditUserDTO } from "./dto/edit-user.dto";
import { AuthGuard } from "src/guards/auth.guard";

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Put()
  async editUser(@Body() body: EditUserDTO, @Req() req: Request) {
    return this.userService.editUser(body, req);
  }

  @Delete()
  async deleteUser(@Req() req: Request) {
    return this.userService.deleteUser(req);
  }

  @Get(':type?/:data?')
  async getUser(@Param() param: any, @Req() req: Request) {
    return this.userService.getUser(param, req);
  }
}