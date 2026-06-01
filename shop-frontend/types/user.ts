export interface User {
  id: number;
  username: string;
  email: string;
  role: "customer" | "admin";
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  country: string;
  created_at: string;
  last_login: string | null;
}

export interface UserInList {
  id: number;
  username: string;
  email: string;
  role: "admin" | "customer";
  full_name: string;
  phone: string;
  country: string;
  last_login: string | null;
  total: number;
}

export interface UserFieldErrors {
  username: string;
  email: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface LoginResponse {
  success: boolean;
  data: User;
  token: string;
  info: string;
}

export interface GetUsersResponse {
  success: boolean;
  data: UserInList | UserInList[];
  info: string;
}

export interface GetUserResponse {
  success: boolean;
  data: User;
  info: string;
}