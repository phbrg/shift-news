import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { EditUserDTO } from "src/user/dto/edit-user.dto";
import * as bcrypt from "bcrypt";
import { UserService } from "src/user/user.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async editUser(id: string, body: EditUserDTO, picture?: any) {
    if(!id || !body) throw new BadRequestException('Invalid data.');

    const user = await this.prisma.user.findUnique({
      where: { id: id }
    }) || null;
    if(!user) throw new BadRequestException('Invalid user.');
    if(body.password && !body.confirmPassword || body.password && body.password !== body.confirmPassword) throw new BadRequestException('Invalid data.');

    let newUser = {
      updatedAt: new Date()
    }

    if(body.name) newUser['name'] = body.name;
    if(body.email) newUser['email'] = body.email;
    if(body.password) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(body.password, salt);
      newUser['password'] = hashedPassword;
    }
    if(picture) {
      const pictureBase64 = this.userService.uploadFile(picture, id);
      newUser['picture'] = pictureBase64;
    }

    return this.prisma.user.update({
      data: newUser,
      where: { id:id }
    });
  }
}