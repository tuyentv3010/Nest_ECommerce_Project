import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
