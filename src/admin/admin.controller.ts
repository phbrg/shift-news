import { Body, Controller, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Put, UploadedFile, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { Roles } from "src/decorators/role.decorator";
import { Role } from "src/enums/role.enum";
import { EditUserDTO } from "src/user/dto/edit-user.dto";

@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.Admin)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService
  ) {}

  @Put('user/:id')
  async editUser(@Param() param: { id: string }, @Body() body: EditUserDTO, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/*' }),
        new MaxFileSizeValidator({ maxSize: 1024 * 300 }) // 300 KB
      ],
      fileIsRequired: false
    })
  ) picture?: Express.Multer.File) {
    return this.adminService.editUser(param.id, body, picture);
  }
}