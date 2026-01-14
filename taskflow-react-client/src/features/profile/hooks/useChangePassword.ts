import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { changePasswordAsync } from "../services/profileService";
import type { ChangePasswordRequestDto } from "../types/changePasswordRequestDto";

type UseChangePasswordOptionsType = Omit<
  UseMutationOptions<void, Error, ChangePasswordRequestDto>,
  "mutationFn"
>;

export const useChangePassword = (
  options: UseChangePasswordOptionsType = {},
) => {
  return useMutation<void, Error, ChangePasswordRequestDto>({
    mutationFn: async (data: ChangePasswordRequestDto) => {
      await changePasswordAsync(data);
    },
    ...options,
  });
};

