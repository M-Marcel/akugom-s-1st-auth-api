import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    example: 'Johndie@test.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({
    example: '12345678',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class UpdateAdminDto {
  @IsString()
  readonly firstName?: string;

  @IsString()
  readonly lastName?: string;

  @IsString()
  readonly email?: string;

  @IsString()
  readonly password?: string;

  @IsNotEmpty()
  readonly refreshToken?: string;
}

export class LoginAdminDto {
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly role: string;
}

export class LoginDto {
  @ApiProperty({
    example: '12345678',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly email: string;
}
