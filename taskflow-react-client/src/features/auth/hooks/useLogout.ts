import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../../contexts/userContext";
import { logoutAsync } from "../../auth/services/authService";
import { clearAuthSession } from "../../common/helpers/cookie";

type UseLoginPostOptionsType = Omit<
  UseMutationOptions<void, Error>,
  "mutationFn"
>;

export const useLogout = (options: UseLoginPostOptionsType = {}) => {
  const { clearUser } = useUser();
  const navigate = useNavigate();

  return useMutation<void, Error>({
    mutationFn: async () => {
      await logoutAsync();
      clearAuthSession();
      clearUser();
      navigate("/login", { replace: true });
    },
    ...options,
  });
};
