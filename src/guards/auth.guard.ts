import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CognitoService } from './../providers/cognito.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private cognitoService: CognitoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // get request context
    const request = context.switchToHttp().getRequest();
    // get authorization from headers
    const { authorization } = request.headers;

    // throw Unuathorized error if no authorization header found
    if (!authorization) {
      this.logger.log('Invalid authorization header');
      throw new UnauthorizedException('Authorizaion header is required');
    }

    // get access token from authorization header
    const token = authorization.replace('Bearer ', '');

    // throw Unauthorized error if no token found
    if (!token) {
      this.logger.log('Invalid token from authorization header');
      throw new UnauthorizedException('Invalid Authorization');
    }

    try {
      // validate token
      request.userData = await this.cognitoService.validateToken(token);

      // return true of token is valid
      return true;
    } catch (err) {
      throw err;
    }
  }
}
