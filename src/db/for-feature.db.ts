import { Admin, AdminSchema } from 'src/admin/entities/admin.entity';

/**
 * An array containing an object with the name and schema of the Admin model.
 * @type {Array<{ name: string, schema: any }>}
 */
export default [{ name: Admin.name, schema: AdminSchema }];
