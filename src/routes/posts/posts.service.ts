import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  getPost() {
    return this.prismaService.post.findMany();
  }
  createPost(body: any) {
    return body;
  }
}
