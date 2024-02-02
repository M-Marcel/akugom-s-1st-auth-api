import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  /**
   * Constructs a new instance of the class.
   * @param {Reflector} reflector - The reflector object used for reflection.
   * @param {ConfigService} configService - The configuration service object.
   * @returns None
   */
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Checks if the user is authorized to access the requested resource.
   * @param {ExecutionContext} context - The execution context of the request.
   * @returns {boolean} - Returns true if the user is authorized, false otherwise.
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];

    try {
      console.log('Received Token:', token);

      const decoded = jwt.verify(token, 'your-secret-key');
      console.log('Decoded Token Payload:', decoded);

      request.user = decoded;
      console.log('Request User:', request.user);

      return true;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }
}
