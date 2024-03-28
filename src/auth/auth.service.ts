import { BadRequestException, Inject, Injectable, UnauthorizedException, forwardRef } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { LoginDTO } from "./dto/login.dto";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
// import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
    // private readonly mailer: MailerService
  ) {}

  createToken(id: string, email: string, role: number) {
    return {
      token: this.jwt.sign(
        {
          id: id,
          email: email,
          role: role,
        },
        {
          expiresIn: '7d',
          subject: id,
        },
      ),
      user: {
        id: id,
        email: email,
        role: role,
      },
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwt.verify(token, {
        secret: process.env.JWT_KEY,
      });
      return data;
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }

  isTokenValid(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (err) {
      return false;
    }
  }

  async login({email, password}: LoginDTO) {
    const user = await this.prisma.user.findUnique({
      where: { email: email }
    }) || null;
    if(!user) {
      throw new BadRequestException('Invalid email or/and password.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
      throw new BadRequestException('Invalid email or/and password.');
    }

    return this.createToken(user.id, email, user.role);
  }
  
  // not working | [Nest] 16380  - 27/03/2024, 17:02:57   ERROR [MailerService] Transporter is ready ?????????
  // async forgetPassword(email: string) {
  //   if(!email) throw new BadRequestException('Invalid data.');

  //   const user = await this.prisma.user.findUnique({ 
  //     where: { email: email }
  //   }) || null;

  //   if(user) {
  //     const token = this.jwt.sign(
  //       {
  //         id: user.id,
  //       },
  //       {
  //         expiresIn: '1h',
  //         subject: user.id,
  //       },
  //     )
        
  //     await this.mailer.sendMail({
  //       subject: 'Reset password - Shift News',
  //       to: email,
  //       template: 'reset',
  //       context: {
  //         name: user.name,
  //         link: `/reset/${token}`
  //       }
  //     });
  //   }

  //   return `A password reset email has been sent to ${email}`;
  // }
}