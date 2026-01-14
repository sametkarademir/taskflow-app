export interface CreateUserRequestDto {
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  password: string;
  confirmPassword: string;
}

