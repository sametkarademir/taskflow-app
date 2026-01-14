import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getUserByIdAsync } from "../services/userService";
import type { UserResponseDto } from "../types/userResponseDto";

type UseGetUserByIdOptionsType = Omit<
  UseQueryOptions<UserResponseDto, Error>,
  "queryKey" | "queryFn"
>;

export const useGetUserById = (
  id: string,
  options: UseGetUserByIdOptionsType = {},
) => {
  return useQuery<UserResponseDto, Error>({
    queryKey: ["user", id],
    queryFn: async () => {
      return await getUserByIdAsync(id);
    },
    enabled: !!id,
    ...options,
  });
};

