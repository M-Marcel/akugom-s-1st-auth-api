import {
  Injectable,
  Inject,
  forwardRef,
  BadRequestException,
} from '@nestjs/common';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';
import { Admin, AdminDocument } from './entities/admin.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AdminService {
  /**
   * Constructs a new instance of the class.
   * @param {AuthService} authService - The AuthService instance to be injected.
   * @param {Model<AdminDocument>} adminModel - The Admin model instance to be injected.
   * @returns None
   */
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {}

  /**
   * Registers a new admin user with the provided admin data.
   * @param {CreateAdminDto} createAdminDto - The data for creating a new admin user.
   * @returns {Promise<AuthTokens>} - The authentication tokens for the newly registered admin user.
   * @throws {BadRequestException} - If an admin user with the same email already exists.
   * @throws {Error} - If there is an error during the registration process.
   */
  async register(createAdminDto: CreateAdminDto) {
    try {
      const userExists = await this.findOne(createAdminDto.email);
      if (userExists) {
        throw new BadRequestException('Admin already exists');
      }
      const hashedPassword = await this.authService.encryptPassword(
        createAdminDto.password,
      );
      const admin = await this.adminModel.create({
        firstName: createAdminDto.firstName,
        lastName: createAdminDto.lastName,
        email: createAdminDto.email,
        password: hashedPassword,
        role: 'admin',
      });
      const tokens = await this.authService.getTokens(admin._id, admin.role);
      await this.authService.updateRefreshToken(admin._id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  /**
   * Creates a new admin user with the provided data.
   * @param {CreateAdminDto} createAdminDto - The data for creating the admin user.
   * @returns {Promise<any>} - A promise that resolves to the created admin user.
   * @throws {Error} - If there is an error creating the admin user.
   */
  async createAdmin(createAdminDto: CreateAdminDto): Promise<any> {
    try {
      const hashedPassword = await this.authService.encryptPassword(
        createAdminDto.password,
      );
      const admin = await this.adminModel.create({
        firstName: createAdminDto.firstName,
        lastName: createAdminDto.lastName,
        email: createAdminDto.email,
        password: hashedPassword,
        role: 'admin',
      });
      await admin.save();
      return admin;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  /**
   * Retrieves all admin records from the database.
   * @returns {Promise<Array<Admin>>} - A promise that resolves to an array of admin records.
   * @throws {Error} - If there is an error retrieving the admin records.
   */
  async findAll() {
    try {
      const allAdmin = await this.adminModel.find();
      return allAdmin;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  /**
   * Find and return an admin document from the database based on the provided email.
   * @param {string} email - The email of the admin to search for.
   * @returns {Promise<AdminDocument | null>} - A promise that resolves to the found admin document, or null if not found.
   * @throws {Error} - If there is an error while executing the database query.
   */
  findOne(email: string) {
    try {
      return this.adminModel.findOne({ email: email }).exec();
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  /**
   * Find an admin document by its ID.
   * @param {string} id - The ID of the admin document to find.
   * @returns {Promise<AdminDocument>} A promise that resolves to the found admin document, or rejects with an error.
   * @throws {Error} If an error occurs while finding the admin document.
   */
  findById(id: string) {
    try {
      return this.adminModel.findById(id);
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  /**
   * Updates an admin user with the given ID using the provided data.
   * @param {string} id - The ID of the admin user to update.
   * @param {UpdateAdminDto} updateAdminDto - The data to update the admin user with.
   * @returns {Promise<any>} A promise that resolves to the updated admin user.
   */
  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const hashedPassword = await this.authService.encryptPassword(
      updateAdminDto.password,
    );
    const updateAmin = await this.adminModel.create({
      firstName: updateAdminDto.firstName,
      lastName: updateAdminDto.lastName,
      email: updateAdminDto.email,
      password: hashedPassword,
    });
    return this.adminModel.findByIdAndUpdate({
      _id: id,
      update: updateAmin,
    });
  }

  /**
   * Updates the refresh token for a user with the specified ID.
   * @param {string} id - The ID of the user to update.
   * @param {any} refreshToken - The new refresh token to assign to the user.
   * @returns {Promise<any>} - A promise that resolves to the updated refresh token.
   * @throws {Error} - If an error occurs during the update process.
   */
  async updateRefreshToken(id: string, refreshToken: any) {
    try {
      const updateRefreshToken = await this.adminModel.findByIdAndUpdate({
        _id: id,
        refreshToken: refreshToken,
      });
      return updateRefreshToken;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  /**
   * Removes an admin document from the database based on the provided ID.
   * @param {string} id - The ID of the admin document to remove.
   * @returns {Promise<AdminDocument>} - A promise that resolves to the removed admin document.
   * @throws {Error} - If an error occurs during the removal process.
   */
  async remove(id: string): Promise<AdminDocument> {
    try {
      return await this.adminModel.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }
}
