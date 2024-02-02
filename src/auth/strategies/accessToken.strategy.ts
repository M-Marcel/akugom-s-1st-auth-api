// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../auth.interfaces';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy) {
  /**
   * Constructs a new instance of the class.
   * @param {ConfigService} configService - The configuration service used to retrieve the secret key.
   * @returns None
   */
  constructor(
    // private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('SECRET'),
    });
  }

  /**
   * Validates a JWT payload.
   * @param {JwtPayload} payload - The JWT payload to validate.
   * @returns {Promise<any>} - A promise that resolves to the validated payload.
   */
  async validate(payload: JwtPayload): Promise<any> {
    return payload;
  }
}
