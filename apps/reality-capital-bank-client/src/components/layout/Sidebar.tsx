import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  ArrowRightLeft,
  PiggyBank,
  Wallet,
  LifeBuoy,
  Settings,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Transfers",
    icon: ArrowRightLeft,
    path: "/transfers",
  },
  {
    title: "Accounts",
    icon: Wallet,
    path: "/accounts",
  },
  {
    title: "Investments",
    icon: PiggyBank,
    path: "/investments",
  },
  {
    title: "Support",
    icon: LifeBuoy,
    path: "/support",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 border-r bg-white">
      <div className="border-b p-6">
        <img
          src={import.meta.env.VITE_CLOUDINARY_FULL_LOGO}
          className="h-12 w-auto"
        />
      </div>

      <nav className="space-y-2 p-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive ? "bg-blue-600 text-white" : "hover:bg-slate-100"
                }`
              }
            >
              <Icon size={20} />

              {item.title}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
