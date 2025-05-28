import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule], // <== This is key
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
