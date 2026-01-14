import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import { getProfileAsync } from "../services/profileService";
import type { ProfileResponseDto } from "../types/profileResponseDto";

type UseGetProfileOptionsType = Omit<
  UseQueryOptions<ProfileResponseDto, Error>,
  "queryKey" | "queryFn"
>;

export const useGetProfile = (options: UseGetProfileOptionsType = {}) => {
  return useQuery<ProfileResponseDto, Error>({
    queryKey: ["profile"],
    queryFn: () => getProfileAsync(),
    ...options,
  });
};

