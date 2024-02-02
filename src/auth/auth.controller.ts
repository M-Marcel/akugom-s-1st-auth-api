import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/admin/dto/admin.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { RefreshTokenGuard } from 'src/common/guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Handles the login request and validates the user credentials.
   * @param {LoginDto} loginDto - The login data transfer object containing the user's email and password.
   * @returns A promise that resolves to the result of the user validation.
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    return await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
  }

  /**
   * Logout endpoint that logs out the user associated with the provided access token.
   * @param {Request} req - The request object containing the access token.
   * @returns None
   */
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub']);
  }

  /**
   * Endpoint for refreshing access and refresh tokens.
   * @param {Request} req - The request object.
   * @returns The result of refreshing the tokens.
   * @throws {UnauthorizedException} If the user is not authorized.
   */
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
