interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const colors = {
    ACTIVE: "bg-green-100 text-green-700",

    PENDING: "bg-yellow-100 text-yellow-700",

    FAILED: "bg-red-100 text-red-700",

    SUCCESS: "bg-green-100 text-green-700",

    FROZEN: "bg-red-100 text-red-700",

    CLOSED: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        colors[status as keyof typeof colors] ?? "bg-slate-100"
      }`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
