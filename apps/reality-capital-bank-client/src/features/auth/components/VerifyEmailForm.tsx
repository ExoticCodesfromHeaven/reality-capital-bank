import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "@/components/forms/FormInput";
import SubmitButton from "@/components/forms/SubmitButton";

import { verifyEmailSchema } from "../schema";
import type { VerifyEmailSchema } from "../schema";

import { useVerifyEmail } from "../mutations/useVerifyEmail";
import { useResendVerification } from "../mutations/useResendVerification";

export default function VerifyEmailForm() {
  const location = useLocation();

  const email = location.state?.email ?? "";

  const verify = useVerifyEmail();
  const resend = useResendVerification();

  const RESEND_COOLDOWN = 60;

  const STORAGE_KEY = `verify-email-resend-${email}`;

  const getInitialTimeLeft = () => {
    if (!email) return 0;

    const expiresAt = localStorage.getItem(STORAGE_KEY);

    if (!expiresAt) return 0;

    const remaining = Math.ceil((Number(expiresAt) - Date.now()) / 1000);

    if (remaining <= 0) {
      localStorage.removeItem(STORAGE_KEY);
      return 0;
    }

    return remaining;
  };

  const [timeLeft, setTimeLeft] = useState(getInitialTimeLeft);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailSchema>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email,
    },
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem(STORAGE_KEY);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, STORAGE_KEY]);

  const handleResend = () => {
    resend.mutate(
      { email },
      {
        onSuccess: () => {
          const expiresAt = Date.now() + RESEND_COOLDOWN * 1000;

          localStorage.setItem(STORAGE_KEY, expiresAt.toString());

          setTimeLeft(RESEND_COOLDOWN);
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
      <h2 className="text-3xl font-bold">Verify Email</h2>

      <p className="mt-2 text-slate-500">
        We've sent a verification code to
        <br />
        <strong>{email}</strong>
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit((data) => verify.mutate(data))}
      >
        <input type="hidden" {...register("email")} />

        <FormInput
          label="Verification Code"
          placeholder="123456"
          error={errors.otp?.message}
          {...register("otp")}
        />

        <SubmitButton loading={verify.isPending}>Verify Email</SubmitButton>
      </form>

      <button
        type="button"
        onClick={handleResend}
        disabled={timeLeft > 0 || resend.isPending}
        className="mt-6 w-full text-primary transition disabled:cursor-not-allowed disabled:text-slate-400"
      >
        {resend.isPending
          ? "Sending..."
          : timeLeft > 0
            ? `Resend Code (${timeLeft}s)`
            : "Resend Code"}
      </button>
    </div>
  );
}
