import { useMutation } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

import { toast } from "sonner";
import type { AxiosError } from "axios";

import { authApi } from "../api/auth.api";

function isAxiosError(
  error: unknown,
): error is AxiosError<{ message?: string }> {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as AxiosError).response !== "undefined"
  );
}

export function useVerifyEmail() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.verifyEmail,

    onSuccess() {
      toast.success("Email verified successfully.");

      navigate("/login");
    },

    onError(error: unknown) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Verification failed.");
      } else {
        toast.error("Verification failed.");
      }
    },
  });
}
