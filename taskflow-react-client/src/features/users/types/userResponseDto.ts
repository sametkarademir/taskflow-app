import type { RoleResponseDto } from "../../roles/types/roleResponseDto";

export interface UserResponseDto {
  id: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd?: string;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  firstName?: string;
  lastName?: string;
  passwordChangedTime?: string;
  isActive: boolean;
  roles: RoleResponseDto[];
  creationTime: string;
  lastModificationTime?: string;
}

