import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function PasswordInput({ label, error, ...props }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className={`w-full rounded-xl border px-4 py-3 pr-12
          ${
            error ? "border-red-500" : "border-slate-300 focus:border-primary"
          }`}
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-3"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
