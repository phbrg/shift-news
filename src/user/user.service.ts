import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { EditUserDTO } from "./dto/edit-user.dto";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AuthService)) private readonly authService
  ) {}

  async registerUser({ name, email, password, confirmPassword }: CreateUserDTO) {
    if(password !== confirmPassword) throw new BadRequestException('Password does not match.');

    const emailAlredyRegistered = this.prisma.user.findUnique({
      where: { email: email }
    });
    if(emailAlredyRegistered) throw new BadRequestException('Email alredy registered.');

    const salt = bcrypt.genSaltSync(10);
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

  async getUser(param: {type: string, data: string}, req?: any) {
    let res = null;
    let switcher: any;

    switch(param.type) {
      case 'id':
        if(!param.data) throw new BadRequestException('Invalid search.');

        switcher = await this.prisma.user.findUnique({
          where: { id: param.data }
        });

        if(switcher) {
          res = {
            id: switcher.id,
            name: switcher.name,
            email: switcher.email,
            role: switcher.role,
            totalPosts: switcher.totalPosts,
            totalUps: switcher.totalUps,
            totalComments: switcher.totalComments,
            picture: switcher.picture,
            createdAt: switcher.createdAt,
            updatedAt: switcher.updatedAt,
          }
        } else {
          throw new NotFoundException('User not found.');
        }
        break;
      case 'email':
        if(!param.data) throw new BadRequestException('Invalid search.');

        switcher = await this.prisma.user.findUnique({
          where: { email: param.data }
        });

        if(switcher) {
          res = {
            id: switcher.id,
            name: switcher.name,
            email: switcher.email,
            role: switcher.role,
            totalPosts: switcher.totalPosts,
            totalUps: switcher.totalUps,
            totalComments: switcher.totalComments,
            picture: switcher.picture,
            createdAt: switcher.createdAt,
            updatedAt: switcher.updatedAt,
          }
        } else {
          throw new NotFoundException('User not found.');
        }
        break;
      case 'name':
        if(!param.data) throw new BadRequestException('Invalid search.');
        
        switcher = await this.prisma.user.findMany({
          where: { name:{ contains: param.data } }
        });
        res = [];

        if(switcher) {
          for(let user of switcher) {
            res.push({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              totalPosts: user.totalPosts,
              totalUps: user.totalUps,
              totalComments: user.totalComments,
              picture: user.picture,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            })
          }
        } else {
          throw new NotFoundException('User not found.');
        }
        break;
      case undefined:
        if(req) {
          switcher = await this.prisma.user.findUnique({
            where: { id: req.user.id }
          });
          
          res = {
            id: switcher.id,
            name: switcher.name,
            email: switcher.email,
            role: switcher.role,
            totalPosts: switcher.totalPosts,
            totalUps: switcher.totalUps,
            totalComments: switcher.totalComments,
            picture: switcher.picture,
            createdAt: switcher.createdAt,
            updatedAt: switcher.updatedAt,
          }
        }
        break;
      default:
        throw new BadRequestException('Invalid search.');
    }

    if(!res || res.length == 0) {
      throw new NotFoundException('User not found.');
    } else {
      return res;
    }
  }

  async editUser({ name, email, password, confirmPassword }: EditUserDTO, req: any, picture?: any) {
    if(!name && !email && !password && !confirmPassword && !picture) throw new BadRequestException('Invalid data.');
    if(password && !confirmPassword || password && password !== confirmPassword) throw new BadRequestException('Invalid data.');

    let newUser = {
      updatedAt: new Date()
    };

    if(name) newUser['name'] = name; 
    if(email) newUser['email'] = email; 
    if(password) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      newUser['password'] = hashedPassword;
    }
    if(picture) {
      const pictureBase64 = this.uploadFile(picture, req.user.id);
      newUser['picture'] = pictureBase64;
    }

    return this.prisma.user.update({
      data: newUser,
      where: { id: req.user.id }
    });
  }

  async deleteUser(id: string, req: any) {
    const userExist = await this.prisma.user.findUnique({
      where: { id }
    }) || null;
    if(!userExist) throw new BadRequestException('Invalid user.');

    if(id && req.user.role == 2) {
      return this.prisma.user.delete({
        where: { id }
      });
    } else if(!id || id == req.user.id) {
      return this.prisma.user.delete({
        where: { id: req.user.id }
      });
    } else {
      throw new ForbiddenException('You cant delete this user.');
    }
  }

  uploadFile(file: any, userId: string) {
    const fileNameRegex = /^([a-zA-Z0-9_-]+)\.([a-zA-Z0-9]{1,5})$/
    if(!fileNameRegex.test(file.originalname)) throw new BadRequestException('Invalid file');

    const allowedFileTypes = ['png', 'jpg', 'jpeg'];
    if(!allowedFileTypes.includes(file.originalname.split('.')[1])) {
      throw new BadRequestException('Invalid file.');
    }

    file.originalname = `${(file.originalname.split('.')[0]) + '-' + (userId)}.${file.originalname.split('.')[1]}`
    return file.buffer.toString('base64');
  }
}