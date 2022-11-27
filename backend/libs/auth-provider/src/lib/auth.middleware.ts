import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        (req as Request & { authorization: any }).authorization =
          this.jwtService.verify(token);
      }
      next();
    } catch (e) {
      Logger.error(e);
      res.status(401).send(e.message);
    }
  }
}
