import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="animate-spin text-primary" size={36} />
    </div>
  );
}
