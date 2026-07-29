import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import FormInput from "@/components/forms/FormInput";
import PasswordInput from "@/components/forms/PasswordInput";
import SubmitButton from "@/components/forms/SubmitButton";
import { useCountries } from "../../../hooks/useCountries";
import { useRegister } from "../mutations/useRegister";

import { registerSchema } from "../schema";

import type { RegisterSchema } from "../schema";

export default function RegisterForm() {
  const registerMutation = useRegister();

  const { data: countries, isLoading } = useCountries();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="w-full max-w-xl rounded-3xl bg-white p-10 shadow-xl">
      <h2 className="text-3xl font-bold">Create Account</h2>

      <p className="mt-2 text-slate-500">
        Open your Reality Capital Bank account
      </p>

      <form
        className="mt-8 space-y-8"
        onSubmit={handleSubmit((data) => registerMutation.mutate(data))}
      >
        {/* PERSONAL */}

        <div>
          <h3 className="mb-4 text-lg font-semibold">Personal Information</h3>

          <div className="grid gap-4 md:grid-cols-2">
            <FormInput
              label="First Name"
              {...register("firstName")}
              error={errors.firstName?.message}
            />

            <FormInput label="Middle Name" {...register("middleName")} />

            <FormInput
              label="Last Name"
              {...register("lastName")}
              error={errors.lastName?.message}
            />

            <FormInput
              label="Username"
              {...register("username")}
              error={errors.username?.message}
            />
          </div>
        </div>

        {/* ACCOUNT */}

        <div>
          <h3 className="mb-4 text-lg font-semibold">Account Details</h3>

          <div className="space-y-4">
            <FormInput
              label="Email"
              {...register("email")}
              error={errors.email?.message}
            />

            <div>
              <label className="mb-2 block">Country</label>

              <select
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                {...register("countryId")}
              >
                <option value="">Select Country</option>

                {!isLoading &&
                  countries?.map(
                    (country: {
                      id: string;
                      name: string;
                      flagEmoji: string;
                    }) => (
                      <option key={country.id} value={country.id}>
                        {country.flagEmoji} {country.name}
                      </option>
                    ),
                  )}
              </select>

              {errors.countryId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.countryId.message}
                </p>
              )}
            </div>

            <PasswordInput
              label="Password"
              {...register("password")}
              error={errors.password?.message}
            />

            <PasswordInput
              label="Confirm Password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>
        </div>

        <SubmitButton loading={registerMutation.isPending}>
          Create Account
        </SubmitButton>
      </form>

      <p className="mt-8 text-center text-sm">
        Already have an account?
        <Link to="/login" className="ml-2 font-semibold text-primary">
          Login
        </Link>
      </p>
    </div>
  );
}
