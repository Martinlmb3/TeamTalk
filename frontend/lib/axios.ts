import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies with requests
});

// Request interceptor to add access token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    // Get access token from localStorage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        const accessToken = parsed?.state?.accessToken;
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error('Failed to parse auth storage:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token - backend will use refresh token from HTTP-only cookie
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry the original request - new access token cookie is now set
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
