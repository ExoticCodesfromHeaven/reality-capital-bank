import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "@/components/forms/FormInput";
import SubmitButton from "@/components/forms/SubmitButton";

import { forgotPasswordSchema } from "../schema";

import type { ForgotPasswordSchema } from "../schema";

import { useForgotPassword } from "../mutations/useForgotPassword";

export default function ForgotPasswordForm() {
  const forgot = useForgotPassword();

  const {
    register,

    handleSubmit,

    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
      <h2 className="text-3xl font-bold">Forgot Password</h2>

      <p className="mt-2 text-slate-500">
        Enter your email and we'll send you a password reset code.
      </p>

      <form
        className="mt-8 space-y-5"
        onSubmit={handleSubmit((data) => forgot.mutate(data))}
      >
        <FormInput
          label="Email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <SubmitButton loading={forgot.isPending}>Send Reset Code</SubmitButton>
      </form>
    </div>
  );
}
