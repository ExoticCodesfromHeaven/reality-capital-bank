import { Bell } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8">
      <div>
        <h2 className="text-xl font-bold">Welcome back,</h2>

        <p className="text-slate-500">{user?.firstName}</p>
      </div>

      <div className="flex items-center gap-6">
        <Bell />

        <img
          src={user?.avatar || "/default-avatar.png"}
          className="h-10 w-10 rounded-full object-cover"
        />
      </div>
    </header>
  );
}
