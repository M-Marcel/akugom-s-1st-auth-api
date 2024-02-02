import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';
import { Roles } from 'src/common/guards/roles.decorator';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@ApiTags('Cloudpad Admin')
@Controller('admin')
export class AdminController {
  /**
   * Constructs a new instance of the class.
   * @param {AdminService} adminService - The admin service to be used by the class.
   */
  constructor(private readonly adminService: AdminService) {}

  /**
   * Registers a new admin by creating an admin object based on the provided CreateAdminDto.
   * @param {CreateAdminDto} createAdminDto - The JSON structure for the admin creation object.
   * @returns {Promise<any>} - A promise that resolves to the created admin object.
   */
  @Post('register')
  @ApiResponse({
    status: 200,
    description: 'Admin has been created successful.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: CreateAdminDto,
    description: 'Json structure for Admin creation object',
  })
  async register(@Body() createAdminDto: CreateAdminDto): Promise<any> {
    return this.adminService.register(createAdminDto);
  }

  /**
   * Retrieves all admins from the database.
   * @route GET /all-admins
   * @guards JwtAuthGuard, RolesGuard
   * @roles super-admin
   * @param {Request} req - The request object.
   * @returns {Promise<Admin[]>} - A promise that resolves to an array of admin objects.
   */
  // @UseGuards(AccessTokenGuard)
  @Get('all-admins')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super-admin')
  async findAll(@Request() req) {
    console.log(req.user);
    return this.adminService.findAll();
  }

  /**
   * Creates a new admin user.
   * @param {Request} req - The request object.
   * @param {CreateAdminDto} createAdminDto - The data for creating the admin user.
   * @returns {Promise<any>} - A promise that resolves to the created admin user.
   * @throws {ForbiddenException} - If the user does not have the necessary permissions.
   */
  @UseGuards(AccessTokenGuard)
  // @Roles('super-admin')
  @Post('create-admin')
  @ApiResponse({
    status: 200,
    description: 'Admin has been created successful.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: CreateAdminDto,
    description: 'Json structure for Admin creation object',
  })
  async createAdmin(
    @Request() req,
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<any> {
    return this.adminService.createAdmin(createAdminDto);
  }

  /**
   * Retrieves a specific admin by their ID.
   * @param {string} id - The ID of the admin to retrieve.
   * @returns The admin object with the specified ID.
   */
  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findById(id);
  }

  /**
   * Updates an admin record with the specified ID.
   * @param {string} id - The ID of the admin record to update.
   * @param {UpdateAdminDto} updateAdminDto - The DTO containing the updated admin data.
   * @returns The updated admin record.
   * @throws {UnauthorizedException} If the access token is invalid or missing.
   */
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  /**
   * Removes an item with the specified ID.
   * @param {string} id - The ID of the item to be removed.
   * @returns The result of the removal operation.
   */
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
