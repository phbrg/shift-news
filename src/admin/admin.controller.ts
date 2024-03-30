import { Body, Controller, Delete, FileTypeValidator, MaxFileSizeValidator, Param, ParseFilePipe, Put, UploadedFile, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "src/guards/auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { Roles } from "src/decorators/role.decorator";
import { Role } from "src/enums/role.enum";

@UseGuards(AuthGuard, RoleGuard)
@Roles(Role.Admin)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService
  ) {}

  @Put(':type/:id')
  async adminEdit(@Param() param: { type: string, id: string }, @Body() body: any, @UploadedFile(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/*' }),
        new MaxFileSizeValidator({ maxSize: 1024 * 300 }) // 300 KB
      ],
      fileIsRequired: false
    })
  ) picture?: Express.Multer.File) {
    return this.adminService.adminEdit(param.type, param.id, body, picture);
  }

  @Delete(':type/:id')
  async adminDelete(@Param() param: { type: string, id: string }) {
    return this.adminService.adminDelete(param.type, param.id);
  }
}