import axios, {
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { showToast } from "./toaster";
import { refreshTokenAsync } from "../../auth/services/authService";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearSessionAndRedirect,
} from "./cookie.ts";

// API Client Configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Token refresh state management
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

// Process queued requests after token refresh
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Display error toast notifications
const showErrorToast = (status: number, message?: string) => {
  const errorMessages: Record<number, string> = {
    400: "Bad Request",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
  };

  const errorMessage = message || errorMessages[status] || "An error occurred";

  showToast(errorMessage, "error", 5000, "top-right");
};

async function prepareHeadersAsync(
  existingHeaders?: AxiosHeaders,
): Promise<AxiosHeaders> {
  const headers = existingHeaders || AxiosHeaders.from({});

  if (!headers.get("Accept-Language")) {
    headers.set("Accept-Language", localStorage.getItem("i18nextLng") || "en");
  }

  if (!headers.get("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const accessToken = getAccessToken();
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  return headers;
}

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    config.headers = await prepareHeadersAsync(config.headers);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;
    const data = error.response?.data;

    const isLoginRequest = originalRequest.url?.includes("api/v1/auth");
    // Handle 401 Unauthorized with token refresh
    if (status === 401 && !isLoginRequest && !originalRequest._retry) {
      const refreshToken = getRefreshToken();

      // No refresh token available
      if (!refreshToken) {
        clearSessionAndRedirect();
        return Promise.reject(error);
      }

      // Handle concurrent requests during token refresh
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Start token refresh process
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const loginResponse = await refreshTokenAsync({
          refreshToken: refreshToken,
        });

        // Update tokens with new ones
        setAccessToken(loginResponse.accessToken);
        if (loginResponse.refreshToken) {
          setRefreshToken(loginResponse.refreshToken);
        }

        // Update default headers
        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${loginResponse.accessToken}`;

        // Process queued requests with new token
        processQueue(null, loginResponse.accessToken);

        // Retry original request with new token
        originalRequest.headers["Authorization"] =
          `Bearer ${loginResponse.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token refresh failed
        processQueue(refreshError);
        clearSessionAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status && [400, 403, 404, 500].includes(status) && !isLoginRequest) {
      showErrorToast(status, data?.Message);
    } else if (data?.Message && !isLoginRequest) {
      showErrorToast(status || 0, data.Message);
    }
    else {
      showErrorToast(400, data.Message);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
