import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from "src/prisma/prisma.service";
import { LoginDTO } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly Jwt: JwtService,
  ) {}

  createToken(user: { email: string; role: number; id: string }) {
    return {
      token: this.Jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        {
          expiresIn: '7d',
          subject: user.id,
        },
      ),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  checkToken(token: string) {
    try {
      const data = this.Jwt.verify(token, {
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
    //
  }
}