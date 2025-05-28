import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
// import { APIKeyGuard } from 'src/shared/guards/api-key.guard';
// import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import {
  AuthType,
  ConditionGuard,
  REQUEST_USER_KEY,
} from 'src/shared/constants/auth.constant';
import { Auth } from 'src/shared/decorators/auth.decorators';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { Request } from 'express';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { TokenPayload } from 'src/shared/type/jwt.type';
import { GetPostItemDTO } from './posts.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.And })
  @Get()
  getPosts(@ActiveUser('userId') userId: number) {
    return this.postsService
      .getPost(userId)
      .then((posts) => posts.map((post) => new GetPostItemDTO(post)));
  }
  @Post()
  @Auth([AuthType.Bearer])
  createPost(@Body() body: any, @ActiveUser('userId') userId: number) {
    return this.postsService.createPost(body, userId);
  }
}
