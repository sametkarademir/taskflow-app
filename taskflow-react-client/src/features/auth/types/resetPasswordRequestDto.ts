export interface ResetPasswordRequestDto {
  code: string;
  email: string;
  newPassword: string;
  confirmNewPassword: string;
}
