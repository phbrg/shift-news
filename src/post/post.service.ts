import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePostDTO } from "./dto/create-post.dto";
@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createPost({ title, body }: CreatePostDTO) {
    return this.prisma.post.create({
      data: {
        title,
        body,
        updatedAt: new Date()
      }, 
      select: {
        id: true,
        title: true,
        body: true
      }
    });
  }

  async getPosts(param: {type: string, data: string}) {
    let res = null;

    switch(param.type) {
      case 'id':
        if(!param.data) {
          throw new BadRequestException('Invalid data.');
        } else {
          res = await this.prisma.post.findUnique({
            where: { id: param.data }
          });
        }
        break;
      case 'title':
        if(!param.data) {
          throw new BadRequestException('Invalid data.');
        } else {
          res = await this.prisma.post.findMany({
            where: { title: { contains: param.data } }
          });
        }
        break;
      case 'body':
        if(!param.data) {
          throw new BadRequestException('Invalid data.');
        } else {
          res = await this.prisma.post.findMany({
            where: { body: { contains: param.data } }
          });
        }
        break;
      case 'up':
        if(!param.data) {
          res = await this.prisma.post.findMany({
            orderBy: { totalUps: 'desc' }
          });
        } else if(param.data == 'asc') {
          res = await this.prisma.post.findMany({
            orderBy: { totalUps: 'asc' }
          });
        }
        break;
      case 'comment':
        if(!param.data) {
          res = await this.prisma.post.findMany({
            orderBy: { totalComments: 'desc' }
          });
        } else if(param.data == 'asc') {
          res = await this.prisma.post.findMany({
            orderBy: { totalComments: 'asc' }
          });
        }
        break;
      case 'date':
        // TODO
        res = this.prisma.post.findMany();
        break;
      default:
        res = this.prisma.post.findMany();
    }

    if(!res || res.length == 0) {
      throw new NotFoundException('Post not found.');
    } else {
      return res;
    }
  }
}