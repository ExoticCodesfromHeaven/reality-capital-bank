import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string;
}

export default function MetricCard({
  title,
  value,
  icon,
  change,
}: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-border bg-white p-6 shadow-card"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{title}</p>

          <h2 className="mt-2 text-3xl font-bold">{value}</h2>

          {change && <p className="mt-2 text-sm text-green-600">{change}</p>}
        </div>

        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
