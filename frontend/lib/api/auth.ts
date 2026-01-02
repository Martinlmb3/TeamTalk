import axiosInstance from "@/lib/axios";
import type { LoginFormData, SignupFormData } from "@/schemas/auth.schema";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  firstName: string;
  role: number;
  profilePicture?: string;
  requiresRole?: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: number;
  profilePicture?: string;
  createdAt: string;
}

export const authApi = {
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/api/auth/login", data);
    return response.data;
  },

  register: async (data: SignupFormData): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>("/api/auth/register", {
      ...data,
      role: null, // Role will be selected later
    });
    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await axiosInstance.get<UserProfile>("/api/auth/profile");
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post("/api/auth/logout");
  },
};
