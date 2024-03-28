import { Body, Controller, Delete, FileTypeValidator, Get, MaxFileSizeValidator, Param, ParseFilePipe, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { EditUserDTO } from "./dto/edit-user.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}
  
  @UseInterceptors(FileInterceptor('picture'))
  @Put()
  async editUser(@Body() body: EditUserDTO, @Req() req: Request, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/*' }),
        new MaxFileSizeValidator({ maxSize: 1024 * 300 }) // 300 KB
      ],
      fileIsRequired: false
    })
  ) picture?: Express.Multer.File) {
    return this.userService.editUser(body, req, picture);
  }

  @Delete(':id?')
  async deleteUser(@Param() param: { id: string }, @Req() req: Request) {
    return this.userService.deleteUser(param.id, req);
  }

  @Get(':type?/:data?')
  async getUser(@Param() param: { type: string, data: string }, @Req() req: any) {
    return this.userService.getUser(param, req);
  }
}