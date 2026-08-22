export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtResponse {
  token: string;
  id: number;
  username: string;
  role: string; // 'ROLE_ADMIN' | 'ROLE_CUSTOMER'
  tokenType: string;
}

export interface AuthState {
  token: string;
  username: string;
  role: string;
  id: number | null;
}