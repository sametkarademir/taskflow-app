import Cookies from "js-cookie";

const COOKIE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_PROFILE: "user_profile",
} as const;

export const clearAuthSession = (): void => {
  Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN);
  Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN);
  Cookies.remove(COOKIE_KEYS.USER_PROFILE);
};

export const clearSessionAndRedirect = (): void => {
  clearAuthSession();

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

export const getUserProfile = (): string | undefined => {
  return Cookies.get(COOKIE_KEYS.USER_PROFILE);
};

export const getAccessToken = (): string | undefined => {
  return Cookies.get(COOKIE_KEYS.ACCESS_TOKEN);
};

export const getRefreshToken = (): string | undefined => {
  return Cookies.get(COOKIE_KEYS.REFRESH_TOKEN);
};

export const setUserProfile = (profile: string): void => {
  // Session cookie: no expires attribute (will be deleted when browser closes)
  Cookies.set(COOKIE_KEYS.USER_PROFILE, profile);
};

export const setAccessToken = (token: string): void => {
  // Session cookie: no expires attribute (will be deleted when browser closes)
  Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, token);
};

export const setRefreshToken = (token: string): void => {
  // Session cookie: no expires attribute (will be deleted when browser closes)
  Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, token);
};

export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
