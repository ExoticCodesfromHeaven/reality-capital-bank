import { useMutation } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { authApi } from "../api/auth.api";

import { AxiosError } from "axios";

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,

    onSuccess: (_, variables) => {
      toast.success("Account created successfully.");

      navigate("/verify-email", {
        state: {
          email: variables.email,
        },
      });
    },

    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message ?? "Registration failed.");
    },
  });
}
