import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { useUser } from "../../../contexts/userContext";

import { loginAsync } from "../services/authService";
import type { LoginRequestDto } from "../types/loginRequestDto";
import { setAccessToken, setRefreshToken } from "../../common/helpers/cookie";

type UseLoginPostOptionsType = Omit<
  UseMutationOptions<void, Error, { params: LoginRequestDto }>,
  "mutationFn"
>;
export const useLogin = (options: UseLoginPostOptionsType = {}) => {
  const { refetchUser } = useUser();

  return useMutation<void, Error, { params: LoginRequestDto }>({
    mutationFn: async ({ params }: { params: LoginRequestDto }) => {
      const loginResponse = await loginAsync(params);

      setAccessToken(loginResponse.accessToken);
      setRefreshToken(loginResponse.refreshToken);

      await refetchUser();
    },
    ...options,
  });
};
