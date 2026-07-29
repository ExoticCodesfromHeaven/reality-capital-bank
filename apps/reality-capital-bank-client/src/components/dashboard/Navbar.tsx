import { Bell } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="flex h-24 items-center justify-between border-b bg-white px-8">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.firstName}
          👋
        </h1>

        <p className="text-slate-500">Manage your finances securely.</p>
      </div>

      <div className="flex items-center gap-6">
        <button className="rounded-full bg-slate-100 p-3">
          <Bell size={20} />
        </button>

        <img
          src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0B1F3A&color=fff`}
          className="h-12 w-12 rounded-full"
        />
      </div>
    </header>
  );
}
