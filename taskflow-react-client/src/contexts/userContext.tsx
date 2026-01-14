import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import { getProfileAsync } from "../features/profile/services/profileService";
import type { ProfileResponseDto } from "../features/profile/types/profileResponseDto";

import {
  clearSessionAndRedirect,
  getAccessToken,
  getUserProfile,
  isAuthenticated,
  setUserProfile,
} from "../features/common/helpers/cookie";

interface UserContextType {
  user: ProfileResponseDto | null;
  refetchUser: () => Promise<void>;
  isLoading: boolean;
  clearUser: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<ProfileResponseDto | null>(() => {
    const userCookie = getUserProfile();
    return userCookie ? JSON.parse(userCookie) : null;
  });

  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true);

    const userData = await getProfileAsync();
    setUserProfile(JSON.stringify(userData));
    setUser(userData);

    setIsLoading(false);
  }, []);

  const refetchUser = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  const hasRole = useCallback(
    (role: string): boolean => {
      return user?.roles?.includes(role) || false;
    },
    [user],
  );

  const hasAnyRole = useCallback(
    (roles: string[]): boolean => {
      if (!user?.roles) return false;
      return roles.some((role) => user.roles!.includes(role));
    },
    [user],
  );

  const hasAllRoles = useCallback(
    (roles: string[]): boolean => {
      if (!user?.roles) return false;
      return roles.every((role) => user.roles!.includes(role));
    },
    [user],
  );

  useEffect(() => {
    const token = getAccessToken();
    const cookieUser = getUserProfile();
    if (token && !cookieUser && !isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchUserProfile();
    }
  }, [isLoading, fetchUserProfile]);

  const isAuth = isAuthenticated();
  const value: UserContextType = {
    user,
    isLoading,
    refetchUser,
    clearUser: clearSessionAndRedirect,
    isAuthenticated: isAuth,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
