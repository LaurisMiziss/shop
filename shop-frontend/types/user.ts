export interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2: string;
    city: string;
    postal_code: string;
    country: string;
    created_at: string;
    last_login: string;
}

export interface LoginResponse {
  success: boolean;
  data: User;
  token: string;
  info: string;
}