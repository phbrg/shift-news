import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { AuthGuard } from "src/guards/auth.guard";
import { CreatePostDTO } from "./dto/create-post.dto";

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService
  ) {}
  
  @UseGuards(AuthGuard)
  @Post()
  async createPost(@Body() body: CreatePostDTO, @Req() req: Request) {
    return this.postService.createPost(body, req);
  }

  @Get(':type?/:data?')
  async getPost(@Param() param: { type: string, data: string }) {
    return this.postService.getPosts(param);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async editPost(@Param() param: { id: string }, @Body() body: any, @Req() req: Request) {
    return this.postService.editPost(param.id, body, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePost(@Param() param: { id: string }, @Req() req: Request) {
    return this.postService.deletePost(param.id, req);
  }

  @UseGuards(AuthGuard)
  @Post('up/:id')
  async upPost(@Param() param: { id: string }, @Req() req: Request) {
    return this.postService.upPost(param.id, req);
  }
}