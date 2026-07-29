import { useLocation } from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "@/components/forms/FormInput";
import PasswordInput from "@/components/forms/PasswordInput";
import SubmitButton from "@/components/forms/SubmitButton";

import { resetPasswordSchema } from "../schema";

import type { ResetPasswordSchema } from "../schema";

import { useResetPassword } from "../mutations/useResetPassword";

export default function ResetPasswordForm() {
  const location = useLocation();

  const email = location.state?.email ?? "";

  const reset = useResetPassword();

  const {
    register,

    handleSubmit,

    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),

    defaultValues: {
      email,
    },
  });

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
      <h2 className="text-3xl font-bold">Reset Password</h2>

      <p className="mt-2 text-slate-500">
        Enter the verification code and choose a new password.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit((data) => reset.mutate(data))}
      >
        <input type="hidden" {...register("email")} />

        <FormInput
          label="Verification Code"
          placeholder="123456"
          error={errors.otp?.message}
          {...register("otp")}
        />

        <PasswordInput
          label="New Password"
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordInput
          label="Confirm Password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <SubmitButton loading={reset.isPending}>Reset Password</SubmitButton>
      </form>
    </div>
  );
}
