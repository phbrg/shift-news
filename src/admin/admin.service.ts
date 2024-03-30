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

  async adminEdit(type: string, id: string, body: any, picture?: any) { // not the best practice but the best usage
    if(!type || !id || !body) throw new BadRequestException('Invalid data.');
    type = type.toLowerCase();
    if(type !== 'user' && type !== 'post' && type !== 'comment') throw new BadRequestException('Invalid request.');

    switch(type) {
      case 'user':
        const user = await this.prisma.user.findUnique({
          where: { id }
        }) || null;

        if(!user) throw new BadRequestException('Invalid user.');
        if(!body.name && !body.email && !body.password && !picture) throw new BadRequestException('Invalid data.');
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
      case 'post':
        const post = await this.prisma.post.findUnique({
          where: { id }
        }) || null;

        if(!post) throw new BadRequestException('Invalid post.');
        if(!body.title && !body.body) throw new BadRequestException('Invalid data.');
    
        let newPost = {
          updatedAt: new Date()
        }
    
        if(body.title) newPost['title'] = body.title;
        if(body.body) newPost['body'] = body.body;
    
        return this.prisma.post.update({
          data: newPost,
          where: { id:id }
        });
      case 'comment':
        const comment = await this.prisma.comment.findUnique({
          where: { id }
        }) || null;

        if(!comment) throw new BadRequestException('Invalid comment.');
        if(!body.body) throw new BadRequestException('Invalid data.');
    
        let newComment = {
          updatedAt: new Date()
        }
    
        if(body.body) newComment['body'] = body.body;
    
        return this.prisma.comment.update({
          data: newComment,
          where: { id:id }
        });
    }
  }

  async adminDelete(type: string, id: string) { // not the best practice but the best usage
    if(!type || !id) throw new BadRequestException('Invalid data.');
    type = type.toLowerCase();
    if(type !== 'user' && type !== 'post' && type !== 'comment') throw new BadRequestException('Invalid request.');

    switch(type) {
      case 'user':
        const user = await this.prisma.user.findUnique({
          where: { id }
        }) || null;
        if(!user) throw new BadRequestException('Invalid user.');

        return this.prisma.user.delete({
          where: { id }
        });
      case 'post':
        const post = await this.prisma.post.findUnique({
          where: { id }
        }) || null;
        if(!post) throw new BadRequestException('Invalid post.');

        if(post.userId) {
          await this.prisma.user.update({
            data: { totalPosts: { decrement: 1 } },
            where: { id: post.userId }
          })
        }

        return this.prisma.post.delete({
          where: { id }
        });
      case 'comment':
        const comment = await this.prisma.comment.findUnique({
          where: { id }
        }) || null;
        if(!comment) throw new BadRequestException('Invalid comment.');

        if(comment.postId) {
          const commentOwner = await this.prisma.post.findUnique({
            where: { id: comment.postId }
          });
          
          await this.prisma.user.update({
            data: { totalComments: { decrement: 1 } },
            where: { id: commentOwner.userId }
          })
        }

        return this.prisma.comment.delete({
          where: { id }
        });
    }
  }
}