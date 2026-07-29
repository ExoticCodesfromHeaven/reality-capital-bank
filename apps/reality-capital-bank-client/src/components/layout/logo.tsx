// src/components/layout/Logo.tsx

import logo from "@/assets/images/logo.png";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <img src={logo} alt="Reality Capital Bank" className="h-10 w-auto" />
    </div>
  );
}
