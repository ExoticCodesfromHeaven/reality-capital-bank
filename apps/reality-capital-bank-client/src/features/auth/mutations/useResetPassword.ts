import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { authApi } from "../api/auth.api";

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.resetPassword,

    onSuccess() {
      toast.success("Password reset successfully.");

      navigate("/login");
    },

    onError(error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as Record<string, unknown>).response === "object"
          ? ((error as { response?: { data?: { message?: string } } }).response
              ?.data?.message ?? "Unable to reset password.")
          : typeof error === "string"
            ? error
            : "Unable to reset password.";

      toast.error(message);
    },
  });
}
