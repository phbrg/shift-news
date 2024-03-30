import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createPost(title: string, body: string, req: any) {
    return this.prisma.post.create({
      data: {
        title,
        body,
        userId: req.user.id
      }
    });
  }

  async getPosts(param: {type: string, data: string}) {
    let res = null;

    switch(param.type) {
      case 'id':
        if(!param.data) throw new BadRequestException('Invalid data.');
        res = await this.prisma.post.findUnique({
          where: { id: param.data }
        });
        break;
      case 'title':
        if(!param.data) throw new BadRequestException('Invalid data.');
        res = await this.prisma.post.findMany({
          where: { title: { contains: param.data } }
        });
        break;
      case 'body':
        if(!param.data) throw new BadRequestException('Invalid data.');
        res = await this.prisma.post.findMany({
          where: { body: { contains: param.data } }
        });
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
      case undefined: 
        res = this.prisma.post.findMany();
        break;
      default:
        throw new BadRequestException('Invalid search.');
    }

    if(!res || res.length == 0) {
      throw new NotFoundException('Post not found.');
    } else {
      return res;
    }
  }

  async editPost(id: string, body: {title: string, body: string}, req: any) {
    if(!id || !body || !body.title && !body.body) throw new BadRequestException('Invalid data.');

    const post = await this.prisma.post.findUnique({
      where: { id }
    }) || null;
    if(!post) throw new BadRequestException('Inavlid post.');
    if(post.userId && post.userId !== req.user.id && req.user.role !== 2 || !post.userId && req.user.role !== 2) throw new ForbiddenException('Invalid post.'); // is admin || owner

    const newPost = {
      updatedAt: new Date()
    };
    if(body.title) newPost['title'] = body.title;
    if(body.body) newPost['body'] = body.body;

    return this.prisma.post.update({
      data: newPost,
      where: { id }
    });
  }

  async deletePost(id: string, req: any) {
    const post = await this.prisma.post.findUnique({
      where: { id }
    }) || null;
    if(!post) throw new BadRequestException('Invalid Post.');
    if(post.userId && post.userId !== req.user.id && req.user.role == 2 || !post.userId && req.user.role !== 2) throw new ForbiddenException('You cant delete this post.'); // is admin || owner

    return this.prisma.post.delete({
      where:{ id }
    });
  }

  async upPost(id: string, req: any) {
    const post = await this.prisma.post.findUnique({
      where: { id }
    }) || null;
    if(!post) throw new NotFoundException('Post not found.');

    const upExist = await this.prisma.up.findFirst({
      where: {
        postId: id,
        userId: req.user.id,
      },
    }) || null;
    if(upExist) {
      await this.prisma.post.update({
        data: { totalUps: { decrement: 1 } },
        where: { id }
      });
      if(post.userId) {
        await this.prisma.user.update({
          data: { totalUps: { decrement: 1 } },
          where: { id: post.userId }
        });
      }

      return { 
      message: 'Up deleted.', 
      up: await this.prisma.up.delete({
        where: { id: upExist.id }
      }) 
    }
    } else {
      await this.prisma.post.update({
        data: { totalUps: { increment: 1 } },
        where: { id }
      });
      if(post.userId) {
        await this.prisma.user.update({
          data: { totalUps: { increment: 1 } },
          where: { id: post.userId }
        });
      }
  
      return { 
        message: 'Up created.', 
        up: await this.prisma.up.create({
          data: {
            postId: id,
            userId: req.user.id
          }
        }) 
      }
    }
  }
}