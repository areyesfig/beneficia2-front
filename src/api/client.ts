import axios from "axios";
import { API_URL } from "../config/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface AuthInterceptorsConfig {
  getAccessToken: () => string | null;
  refreshAndGetNewToken: () => Promise<string | null>;
}

let authConfig: AuthInterceptorsConfig | null = null;

export function setupAuthInterceptors(config: AuthInterceptorsConfig): void {
  authConfig = config;

  apiClient.interceptors.request.use((requestConfig) => {
    const token = authConfig?.getAccessToken() ?? null;
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._authRetry && authConfig) {
        originalRequest._authRetry = true;
        const newToken = await authConfig.refreshAndGetNewToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient.request(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );
}
