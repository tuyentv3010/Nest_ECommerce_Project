import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/routes/auth/auth.service';
import { TokenService } from '../services/token.service';
import { REQUEST_USER_KEY } from '../constants/auth.constant';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers.authorization?.split(' ')[1];
    console.log(request);
    console.log('accessToken', accessToken);
    if (!accessToken) {
      return false;
    }
    try {
      const decodedAccessToken =
        await this.tokenService.verifyAccessToken(accessToken);
      request[REQUEST_USER_KEY] = decodedAccessToken;
      console.log(decodedAccessToken);
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
