import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

import { toggleIsActiveAsync } from "../services/userService";

type UseToggleIsActiveOptionsType = Omit<
  UseMutationOptions<void, Error, string>,
  "mutationFn"
>;

export const useToggleIsActive = (
  options: UseToggleIsActiveOptionsType = {},
) => {
  return useMutation<void, Error, string>({
    mutationFn: async (id: string) => {
      await toggleIsActiveAsync(id);
    },
    ...options,
  });
};

