import apiClient from "../../common/helpers/axios.ts";
import type { ChangePasswordRequestDto } from "../types/changePasswordRequestDto.ts";

import type { ProfileResponseDto } from "../types/profileResponseDto";

const profileRoute = "/api/v1/profile";

export async function getProfileAsync(): Promise<ProfileResponseDto> {
  const response = await apiClient.get<ProfileResponseDto>(profileRoute);

  return response.data;
}

export async function changePasswordAsync(
  data: ChangePasswordRequestDto,
): Promise<void> {
  await apiClient.post(`${profileRoute}/change-password`, data);
}
