import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async registerUser({ name, email, password, confirmPassword }: CreateUserDTO) {
    if(password !== confirmPassword) {
      throw new BadRequestException('Password does not match.');
    }

    const emailAlredyRegistered = await this.getUser('email', email);
    if(emailAlredyRegistered) {
      throw new BadRequestException('Email alredy registered.');
    }

    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt);

    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
  }

  async getUser(query: string, data: string) {
    let user = null;

    switch(query) {
      case 'id':
        user = this.prisma.user.findUnique({
          where: { id: data }
        })
        break;
      case 'email':
        user = this.prisma.user.findUnique({
          where: { email: data }
        })
        break;
      default: 
        user = null;
    }

    return user;
  }
}