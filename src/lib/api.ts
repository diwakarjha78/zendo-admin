import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Create Axios instance
const api = axios.create({
  baseURL: 'https://zondo.brancosoft.ae/api',
});

// Request interceptor - Attach access token to headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('zendo_at') || sessionStorage.getItem('zendo_at');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Failed request queue & flag for refresh process
interface FailedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let failedQueue: FailedRequest[] = [];
let isRefreshing = false;

// Process queue after token refresh
function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

// **Response Interceptor**
api.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data as { status_code?: number; message?: string; [key: string]: any };

    // Handle cases where response contains a 401 status in JSON
    if (data && data.status_code === 401) {
      console.warn('Token expired detected in response body:', data);

      const customError = new AxiosError(
        data.message || 'Token has expired.',
        'ERR_TOKEN_EXPIRED',
        response.config,
        response.request,
        response
      );

      return Promise.reject(customError);
    }

    return response;
  },
  // **Error Interceptor - Handles Token Expiry**
  async (error: AxiosError): Promise<AxiosResponse | never> => {
    console.error('Error Interceptor - Caught Error:', error.message);
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Ensure originalRequest exists
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Check for custom token expired error
    if (error.code === 'ERR_TOKEN_EXPIRED' && !originalRequest._retry) {
      console.log('Token expired error detected. Attempting token refresh...');
      originalRequest._retry = true;

      // If token refresh is in progress, queue request
      if (isRefreshing) {
        console.log('Token refresh in progress; queuing request.');
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // Otherwise, start token refresh
      isRefreshing = true;
      try {
        // Check which storage holds the refresh token based on "Remember Me"
        const refreshToken = localStorage.getItem('zendo_rt') || sessionStorage.getItem('zendo_rt');
        if (!refreshToken) {
          console.error('No refresh token available.');
          throw new Error('No refresh token available');
        }

        console.log('Attempting to refresh token...');
        const refreshResponse = await axios.post(
          'https://zondo.brancosoft.ae/api/refreshToken',
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

        console.log('Refresh Token API Response:', refreshResponse.data);

        // Ensure valid token response
        const refreshData = refreshResponse.data as { status_code: number; message: string; token?: string };
        if (refreshData.status_code === 200 && refreshData.token) {
          const newToken = refreshData.token;
          console.log('New Access Token:', newToken);

          // Save new token to the correct storage based on where the refresh token was found
          if (localStorage.getItem('zendo_rt')) {
            localStorage.setItem('zendo_at', newToken);
          } else {
            sessionStorage.setItem('zendo_at', newToken);
          }

          // Update original request header with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          // Process any queued requests with new token
          processQueue(null, newToken);

          // Retry the original request
          return axios(originalRequest);
        } else {
          console.error('Token refresh failed:', refreshData.message);
          throw new Error(refreshData.message || 'Token refresh failed');
        }
      } catch (refreshError) {
        console.error('Token Refresh Error:', refreshError);
        processQueue(refreshError, null);

        // Remove expired tokens from both storages and redirect to login
        localStorage.removeItem('zendo_at');
        localStorage.removeItem('zendo_rt');
        sessionStorage.removeItem('zendo_at');
        sessionStorage.removeItem('zendo_rt');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Reject any other errors
    return Promise.reject(error);
  }
);

export default api;
