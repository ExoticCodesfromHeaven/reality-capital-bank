import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AxiosError } from "axios";

import { authApi } from "../api/auth.api";

export function useForgotPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.forgotPassword,

    onSuccess(_, variables) {
      toast.success("Password reset code sent.");

      navigate("/reset-password", {
        state: {
          email: variables.email,
        },
      });
    },

    onError(error: AxiosError<{ message: string }>) {
      toast.error(
        error.response?.data?.message ?? "Unable to send reset code.",
      );
    },
  });
}
