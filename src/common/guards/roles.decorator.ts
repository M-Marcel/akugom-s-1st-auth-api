import { SetMetadata } from '@nestjs/common';

/**
 * Decorator function that sets the metadata for the roles of a user.
 * @param {...string[]} roles - The roles that the user must have.
 * @returns None
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
