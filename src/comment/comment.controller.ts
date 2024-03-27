import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { CommentService } from "./comment.service";

@UseGuards(AuthGuard)
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService
  ) {}

  @Post(':postId')
  async createComment(@Body() body: { body: string }, @Req() req: Request, @Param() param: { postId: string }) {
    return this.commentService.createComment(body.body, req, param.postId);
  }

  @Get(':type?/:data?')
  async getComment(@Param() param: { type: string, data: string }) {
    return this.commentService.getComment(param);
  }

  @Put(':id')
  async editComment(@Param() param: { id: string }, @Body() body: { body: string }, @Req() req: Request) {
    return this.commentService.editComment(param.id, body.body, req);
  }

  @Delete(':id')
  async deleteComment(@Param() param: { id: string }, @Req() req: Request) {
    return this.commentService.deleteComment(param.id, req);
  }
}