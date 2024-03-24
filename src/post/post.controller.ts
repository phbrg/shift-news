import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { AuthGuard } from "src/guards/auth.guard";
import { CreatePostDTO } from "./dto/create-post.dto";

@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService
  ) {}

  @Post()
  async createPost(@Body() body: CreatePostDTO, @Req() req: Request) {
    return this.postService.createPost(body, req);
  }

  @Get(':type?/:data?')
  async getPost(@Param() param: any) {
    return this.postService.getPosts(param);
  }

  @Put(':id')
  async editPost(@Param() param: any, @Body() body: any, @Req() req: Request) {
    return this.postService.editPost(param.id, body, req);
  }
}