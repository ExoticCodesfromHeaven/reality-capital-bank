import {api} from "@/lib/axios";

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),

  me: () => api.get("/auth/me"),

  refresh: () => api.post("/auth/refresh"),

  logout: () => api.post("/auth/logout"),

  register: (data: any) => api.post("/auth/register", data),

  verifyEmail: (data: any) => api.post("/auth/verify-email", data),

  resendVerification: (data: { email: string }) =>
    api.post("/auth/resend-verification", data),

  forgotPassword: (data: { email: string }) =>
    api.post("/auth/forgot-password", data),

  resetPassword: (data: any) => api.post("/auth/reset-password", data),
};
