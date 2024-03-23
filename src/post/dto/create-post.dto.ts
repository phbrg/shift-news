import { IsString } from "class-validator";

export class CreatePostDTO {
  @IsString()
  title: string;

  @IsString()
  body: string;
}