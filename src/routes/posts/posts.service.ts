import { Injectable } from '@nestjs/common';
import envConfig from 'src/shared/config';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  getPost() {
    console.log(envConfig.DATABASE_URL);
    console.log(envConfig.ACCESS_TOKEN_SECRET);
    return this.prismaService.post.findMany();
  }
  createPost(body: any) {
    const userId = 1;
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });
  }
}
