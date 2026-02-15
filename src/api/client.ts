import axios from "axios";
import { API_URL } from "../config/api";

// DEBUG: Log de configuración
console.log('🔧 API Client Config:', {
  baseURL: API_URL,
  timeout: 15_000,
});

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// DEBUG: Interceptor para logging de requests
apiClient.interceptors.request.use(
  (config) => {
    console.log('📤 Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullUrl: `${config.baseURL}${config.url}`,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// DEBUG: Interceptor para logging de responses
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', {
      status: response.status,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });
    return Promise.reject(error);
  }
);

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
