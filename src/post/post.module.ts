import { Module, forwardRef } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}