export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export type User = {
  id: number;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  full_name?: string | null;
};

export type TokenResponse = {
  access_token: string;
  token_type: "bearer";
  user: User;
};
