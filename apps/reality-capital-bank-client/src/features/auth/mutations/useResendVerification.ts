import { useMutation } from "@tanstack/react-query";

import { toast } from "sonner";

import { authApi } from "../api/auth.api";

import { AxiosError } from "axios";

export function useResendVerification() {
  return useMutation({
    mutationFn: authApi.resendVerification,

    onSuccess() {
      toast.success("Verification code sent.");
    },

    onError(error: AxiosError<{ message: string }>) {
      toast.error(error.response?.data?.message ?? "Unable to resend code.");
    },
  });
}
