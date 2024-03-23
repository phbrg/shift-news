import { Body, Controller, Get, Param, Paramtype, Post, UseGuards } from "@nestjs/common";
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
  async createPost(@Body() body: CreatePostDTO) {
    return this.postService.createPost(body);
  }

  @Get(':type?/:data?')
  async getPost(@Param() param: any) {
    return this.postService.getPosts(param);
  }
}