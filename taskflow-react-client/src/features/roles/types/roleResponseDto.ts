import type { PermissionResponseDto } from "../../permissions/types/permissionResponseDto";

export interface RoleResponseDto {
  id: string;
  name: string;
  description?: string;
  permissions: PermissionResponseDto[];
}
