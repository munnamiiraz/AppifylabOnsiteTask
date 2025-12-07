export const Role = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  USER: "USER",
  GUIDE: "GUIDE",
} as const;

export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}

export const IsActive = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED"
} as const;

export interface IUser {
  id?: string;
  _id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  image?: string | null;
  address?: string;
  isDeleted?: string;
  isActive?: typeof IsActive[keyof typeof IsActive];
  isVerified?: boolean;
  role: typeof Role[keyof typeof Role];
  auths?: IAuthProvider[];
  bookings?: string[];
  guides?: string[];
  createdAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: typeof Role[keyof typeof Role];
}

export interface AuthResponse {
  user: IUser;
  token: string;
}

export interface ApiAuthResponse {
  statusCode: number;
  message: string;
  success: boolean;
  data: {
    token: string;
    user: IUser;
  };
}