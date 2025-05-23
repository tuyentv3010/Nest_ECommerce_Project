import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Prisma } from 'generated/prisma';
import { HashingService } from 'src/shared/services/hashing.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { LoginBodyDTO, RefreshTokenBodyDTO } from './auth.dto';
import { error } from 'console';
import { TokenService } from 'src/shared/services/token.service';
import {
  isNotFoundPrismaError,
  isUniqueConstraintPrismaError,
} from 'src/shared/helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}
  async register(body: any) {
    try {
      const hashPassword = await this.hashingService.hash(body.password);
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          password: hashPassword,
          name: body.name,
        },
      });
      return user;
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }
  async login(body: LoginBodyDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Account is not exist');
    }
    const isPasswordMath = await this.hashingService.compare(
      body.password,
      user.password,
    );
    if (!isPasswordMath) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'password is incorrect',
        },
      ]);
    }
    const tokens = await this.generateTokens({ userId: user.id });
    return tokens;
  }
  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signAccessToken(payload),
    ]);
    const decodedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    });
    return { accessToken, refreshToken };
  }
  async refreshToken(refreshToken: string) {
    try {
      // 1 Kiem tra refreshToken co hop le khong
      const { userId } =
        await this.tokenService.verifyAccessToken(refreshToken);
      //2 Kiem tra refresh token co ton tai trong database?
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      });
      // 3 . Xoa refresh Token
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });
      // 4. Tao moi access token vs refresh token
      return await this.generateTokens({ userId });
    } catch (error) {
      // Truong hop da refresh token roi , hay thong bao cho user biet refresh token da bi danh cap
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('refresh token has been revoked');
      }
      throw new UnauthorizedException();
    }
  }
}
