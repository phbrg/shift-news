import { Module, forwardRef } from "@nestjs/common";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { PostModule } from "src/post/post.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    PrismaModule,
    PostModule,
    AuthModule,
  ],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService]
})
export class CommentModule {}