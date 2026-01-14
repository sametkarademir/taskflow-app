import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getAllUsersAsync } from "../services/userService";
import type { UserResponseDto } from "../types/userResponseDto";

type UseGetAllUsersOptionsType = Omit<
  UseQueryOptions<UserResponseDto[], Error>,
  "queryKey" | "queryFn"
>;

export const useGetAllUsers = (
  options: UseGetAllUsersOptionsType = {},
) => {
  return useQuery<UserResponseDto[], Error>({
    queryKey: ["users"],
    queryFn: async () => {
      return await getAllUsersAsync();
    },
    ...options,
  });
};

