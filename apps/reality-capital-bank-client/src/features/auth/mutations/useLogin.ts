import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { authApi } from "../api/auth.api";
import { useAuthStore } from "@/store/auth.store";

import { AxiosError } from "axios";

export function useLogin() {
  const navigate = useNavigate();

  const { setAccessToken, setUser } = useAuthStore();

  return useMutation({
    mutationFn: authApi.login,

    onSuccess: ({ data }) => {
      // Save token
      setAccessToken(data.accessToken);

      // Save user
      setUser(data.user);

      toast.success("Welcome back!");

      switch (data.user.role) {
        case "CUSTOMER":
          navigate("/dashboard");
          break;

        case "ADMIN":
          navigate("/admin");
          break;

        case "SUPER_ADMIN":
          navigate("/super-admin");
          break;

        default:
          navigate("/");
      }
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message ?? "Login failed");
    },
  });
}
