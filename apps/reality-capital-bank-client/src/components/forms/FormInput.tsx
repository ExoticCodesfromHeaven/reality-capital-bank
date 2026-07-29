import { forwardRef } from "react";

import type { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;

  error?: string;
}

const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label>{label}</label>

        <input
          ref={ref}
          {...props}
          className={`w-full rounded-xl border px-4 py-3 ${
            error ? "border-red-500" : "border-slate-300"
          }`}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

export default FormInput;
