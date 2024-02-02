import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  /**
   * Constructs a new instance of the class.
   * @param {ConfigService} configService - The configuration service used to retrieve the JWT refresh secret.
   * @returns None
   */
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  /**
   * Validates the request and payload by extracting the refresh token from the request header
   * and adding it to the payload object.
   * @param {Request} req - The request object.
   * @param {any} payload - The payload object to be validated.
   * @returns The payload object with the refresh token added.
   */
  validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
