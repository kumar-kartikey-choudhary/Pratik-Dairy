/**
 * Mirrors backend UserDto (pratik-dairy-user). `id` is a String UUID
 * (BaseDto.id) on the backend, not a number.
 */
export interface UserDto {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  username: string;
  email: string;
  role: string; // 'ROLE_ADMIN' | 'ROLE_CUSTOMER'
  createdAt?: string;
}

/** Payload for POST /users/register. */
export interface SignUp {
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}