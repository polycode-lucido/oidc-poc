import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.cookies.token) {
        const token = req.cookies.token;
        (req as Request & { authorization: any }).authorization =
          this.authService.getTokenFromSession(token);
        req.headers.authorization =
          'Bearer ' + this.authService.getEncodedTokenFromSession(token);
      }
      next();
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }
}
