import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Admin, AdminDocument } from 'src/admin/entities/admin.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { JwtPayload } from './auth.interfaces';
// import { LoginAdminDto } from 'src/admin/dto/admin.dto';

@Injectable()
export class AuthService {
  /**
   * Constructs a new instance of the class.
   * @param {AdminService} adminService - The AdminService instance.
   * @param {JwtService} jwtService - The JwtService instance.
   * @param {ConfigService} configService - The ConfigService instance.
   * @param {Model<AdminDocument>} adminModel - The AdminModel instance.
   * @returns None
   */
  constructor(
    @Inject(forwardRef(() => AdminService))
    private readonly adminService: AdminService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {}

  /**
   * Encrypts a password using bcrypt hashing algorithm.
   * @param {string} password - The password to be encrypted.
   * @returns {Promise<string>} - A promise that resolves to the hashed password.
   * @throws {Error} - If an error occurs during the encryption process.
   */
  async encryptPassword(password: string): Promise<string> {
    try {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltOrRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  /**
   * Validates a user's email and password.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<any>} - A promise that resolves to an object containing the user's information and access token.
   * @throws {BadRequestException} - If the admin does not exist or the credentials are incorrect.
   */
  async validateUser(email: string, password: string): Promise<any> {
    try {
      const admin = await this.adminService.findOne(email);
      const passwordValid = await bcrypt.compare(password, admin.password);

      if (!admin) {
        throw new BadRequestException('Admin does not exist');
      }

      if (!passwordValid) {
        throw new BadRequestException('Wrong credentials');
      }

      return {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        access_token: await this.getTokens(admin._id, admin.role),
      };
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  /**
   * Generates access and refresh tokens for the given user ID and role.
   * @param {string} id - The user ID.
   * @param {string} role - The user role.
   * @returns An object containing the access and refresh tokens.
   */
  async getTokens(id: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: id,
          role,
        },
        {
          secret: this.configService.get<string>('SECRET'),
          expiresIn: '30m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: id,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Updates the refresh token for a user with the specified ID.
   * @param {string} id - The ID of the user.
   * @param {string} refreshToken - The new refresh token to be stored.
   * @returns None
   * @throws {Error} If there is an error updating the refresh token.
   */
  async updateRefreshToken(id: string, refreshToken: string) {
    try {
      const saltOrRounds = 10;
      const hashedRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
      await this.adminModel.findByIdAndUpdate({
        _id: id,
        refreshToken: hashedRefreshToken,
      });
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  /**
   * Logs out the user by updating the refresh token to null.
   * @param {string} userId - The ID of the user to log out.
   * @returns A promise that resolves when the refresh token is updated.
   */
  async logout(userId: string) {
    return this.adminService.updateRefreshToken(userId, { refreshToken: null });
  }

  /**
   * Refreshes the access and refresh tokens for a user.
   * @param {string} userId - The ID of the user.
   * @param {string} refreshToken - The refresh token of the user.
   * @returns {Promise<Object>} - An object containing the new access and refresh tokens.
   * @throws {BadRequestException} - If the user is not found or does not have a refresh token.
   * @throws {ForbiddenException} - If the provided refresh token does not match the stored refresh token.
   */
  async refreshTokens(userId: string, refreshToken: string) {
    const admin = await this.adminModel.findById(userId);
    if (!admin || !admin.refreshToken) {
      throw new BadRequestException('Access Denied');
    }
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      admin.refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(admin._id, admin.role);
    await this.updateRefreshToken(admin._id, tokens.refreshToken);
    return tokens;
  }
  // async signIn(loginAdminDto: LoginAdminDto) {
  //   // const admin = await this.adminService.findOne(email);
  //   const payload = { id: loginAdminDto.adminId, email: loginAdminDto.email };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }

  // async signUp(username, pass) {
  //   const admin = await this.adminService.findOne(id);
  //   const user = await this.usersService.findOne(username);
  //   if (user?.password !== pass) {
  //     throw new UnauthorizedException();
  //   }
  //   const payload = { sub: user.userId, username: user.username };
  //   return {
  //     access_token: await this.jwtService.signAsync(payload),
  //   };
  // }
}
