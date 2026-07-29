import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PageContainer({ children }: Props) {
  return <div className="mx-auto max-w-7xl space-y-8">{children}</div>;
}
