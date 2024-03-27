import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PostService } from "src/post/post.service";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postService: PostService
  ) {}

  async createComment(body: string, req: any, postId: string) {
    const postExist = await this.postService.getPosts({ type: 'id', data: postId }) || null;
    if(!postExist) throw new BadRequestException('Invalid post.');

    if(!body) throw new BadRequestException('Invalid data.');

    if(postExist.userId) {
      await this.prisma.user.update({
        data: { totalComments: { increment: 1 } },
        where: { id: postExist.userId }
      });
    }

    await this.prisma.post.update({
      data: { totalComments: { increment: 1 } },
      where: { id: postId }
    });

    return this.prisma.comment.create({
      data: {
        body: body,
        postId,
        userId: req.user.id
      }
    })
  }

  async getComment(param: { type: string, data: string }) {
    let res = null;

    switch(param.type) {
      case 'id':
        if(!param.data) throw new BadRequestException('Invalid data.');
        res = await this.prisma.comment.findUnique({
          where: { id: param.data }
        })
        break;
      case 'user':
        if(!param.data) throw new BadRequestException('Invalid data.');
        res = await this.prisma.comment.findMany({
          where: { userId: param.data }
        })
        break; 
      case 'post':
        if(!param.data) throw new BadRequestException('Invalid data.');
        res = await this.prisma.comment.findMany({
          where: { postId: param.data }
        })
        break; 
      case 'body':
        if(!param.data) throw new BadRequestException('Invalid data.');
        res = await this.prisma.comment.findMany({
          where: { body: { contains: param.data } }
        })
        break; 
      case undefined:
        res = await this.prisma.comment.findMany();
        break;
      default:
        throw new BadRequestException('Invalid search.');
    }

    if(!res || res.length == 0) {
      throw new NotFoundException('Comment not found.');
    } else {
      return res;
    }
  }

  async editComment(id: string, body: string, req: any) {
    if(!body) throw new BadRequestException('Invalid data.');

    const commentExist = await this.prisma.comment.findUnique({
      where: { id: id }
    }) || null;
    if(!commentExist) throw new BadRequestException('Invalid comment.');
    if(commentExist.userId && commentExist.userId !== req.user.id && req.user.role !== 2 || !commentExist.userId && req.user.role !== 2) throw new ForbiddenException('Invalid comment.'); // is admin || owner

    const newComment = {
      body,
      updatedAt: new Date()
    }

    return this.prisma.comment.update({
      data: newComment,
      where: { id: id }
    });
  }

  async deleteComment(id: string, req: any) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: id }
    }) || null;
    if(!comment) throw new BadRequestException('Invalid comment.');
    if(comment.userId && comment.userId !== req.user.id && req.user.role !== 2 || !comment.userId && req.user.role !== 2) throw new BadRequestException('Invalid comment.'); // is admin || owner

    return this.prisma.comment.delete({
      where: { id: id }
    });
  }
}