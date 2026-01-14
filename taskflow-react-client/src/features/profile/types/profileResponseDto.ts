export interface ProfileResponseDto {
  id: string;
  email: string;
  phoneNumber?: string;
  emailConfirmed: boolean;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  passwordChangedTime?: string;
  roles?: string[];
  permissions?: string[];
}