interface Props {
  title: string;
  subtitle?: string;
}

export default function PageTitle({ title, subtitle }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary">{title}</h1>

      {subtitle && <p className="mt-2 text-muted">{subtitle}</p>}
    </div>
  );
}
