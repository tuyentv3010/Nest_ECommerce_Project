import { Global, Module } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { HashingService } from './services/hashing.service';
import { TokenService } from './services/token.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AccessTokenGuard } from './guards/access-token.guard';
import { APIKeyGuard } from './guards/api-key.guard';
import { APP_GUARD } from '@nestjs/core';

const sharedService = [
  PrismaService,
  HashingService,
  TokenService,
  AuthenticationGuard,
];
@Global()
@Module({
  imports: [JwtModule],

  providers: [
    ...sharedService,
    AccessTokenGuard,
    APIKeyGuard,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
  exports: [...sharedService, AccessTokenGuard, APIKeyGuard],
})
export class SharedModule {}
