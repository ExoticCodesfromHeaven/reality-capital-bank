import { Loader2 } from "lucide-react";

interface Props {
  loading?: boolean;
  children: React.ReactNode;
}

export default function SubmitButton({ loading, children }: Props) {
  return (
    <button
      disabled={loading}
      className="
        w-full
        rounded-xl
        bg-primary
        py-3
        font-semibold
        text-white

        shadow-lg

        hover:scale-[1.02]

        active:scale-[.98]

        transition-all

        disabled:opacity-60
        "
    >
      {loading && <Loader2 className="mr-2 animate-spin" size={18} />}

      {children}
    </button>
  );
}
