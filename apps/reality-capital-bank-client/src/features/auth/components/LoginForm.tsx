import { Link } from "react-router-dom";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../schema";
import type { LoginSchema } from "../schema";

import FormInput from "@/components/forms/FormInput";
import PasswordInput from "@/components/forms/PasswordInput";
import SubmitButton from "@/components/forms/SubmitButton";

import { useLogin } from "../mutations/useLogin";

export default function LoginForm() {
  const login = useLogin();

  const {
    register,

    handleSubmit,

    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl">
      <h2 className="text-3xl font-bold">Welcome Back</h2>

      <p className="mt-2 text-slate-500">Sign in to continue</p>

      <form
        onSubmit={handleSubmit((data) => login.mutate(data))}
        className="mt-8 space-y-5"
      >
        <FormInput
          label="Email"
          placeholder="john@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordInput
          label="Password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary">
            Forgot Password?
          </Link>
        </div>

        <SubmitButton loading={login.isPending}>Login</SubmitButton>
      </form>

      <p className="mt-8 text-center text-sm">
        Don't have an account?
        <Link to="/register" className="ml-2 font-semibold text-primary">
          Register
        </Link>
      </p>
    </div>
  );
}
