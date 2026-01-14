import { useQuery } from "@tanstack/react-query";
import { permissionService } from "../services/permissionService";

export const usePermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => permissionService.getAllAsync(),
  });
};

