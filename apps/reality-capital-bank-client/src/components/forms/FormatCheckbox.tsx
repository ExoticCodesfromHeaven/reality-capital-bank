interface Props {
  label: string;
}

export default function FormCheckbox({ label }: Props) {
  return (
    <label className="flex items-center gap-3">
      <input type="checkbox" className="h-4 w-4 rounded" />

      <span className="text-sm">{label}</span>
    </label>
  );
}
