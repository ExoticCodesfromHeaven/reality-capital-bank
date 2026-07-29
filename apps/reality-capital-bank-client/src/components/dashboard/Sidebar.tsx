import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  PiggyBank,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const items = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },

  {
    name: "Accounts",
    icon: Wallet,
    href: "/accounts",
  },

  {
    name: "Transfers",
    icon: ArrowLeftRight,
    href: "/transfers",
  },

  {
    name: "Investments",
    icon: PiggyBank,
    href: "/investments",
  },

  {
    name: "Notifications",
    icon: Bell,
    href: "/notifications",
  },

  {
    name: "Profile",
    icon: User,
    href: "/profile",
  },

  {
    name: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function Sidebar() {
  return (
    <div className="flex w-72 flex-col border-r bg-white">
      <div className="border-b p-8">
        <img src={import.meta.env.VITE_CLOUDINARY_FULL_LOGO} className="h-12" />
      </div>

      <nav className="flex-1 space-y-2 p-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-5 py-4 transition

${isActive ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"}

`
              }
            >
              <Icon size={20} />

              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t p-5">
        <button className="flex w-full items-center gap-4 rounded-xl px-5 py-4 text-red-500 hover:bg-red-50">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
