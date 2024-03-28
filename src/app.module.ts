import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    PostModule,
    CommentModule,
    // MailerModule.forRoot({ // not working | [Nest] 16380  - 27/03/2024, 17:02:57   ERROR [MailerService] Transporter is ready ?????????
    //   transport: {
    //     host: 'smtp.ethereal.email',
    //     port: 587,
    //     auth: {
    //         user: process.env.EMAIL,
    //         pass: process.env.PASSWORD
    //     }
    //   },
    //   defaults: {
    //     from: `"shift" <${process.env.PLAIN_EMAIL}>`,
    //   },
    //   template: {
    //     dir: __dirname + '/templates',
    //     adapter: new PugAdapter(),
    //     options: {
    //       strict: true,
    //     },
    //   },
    // })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
