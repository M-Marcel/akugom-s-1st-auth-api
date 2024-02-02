/**
 * Represents the payload of a JSON Web Token (JWT).
 * @property {string} id - The ID of the user associated with the JWT.
 * @property {string} email - The email address of the user associated with the JWT.
 * @property {string} role - The role of the user associated with the JWT.
 */
export type JwtPayload = {
  id: string;
  email: string;
  role: string;
};
