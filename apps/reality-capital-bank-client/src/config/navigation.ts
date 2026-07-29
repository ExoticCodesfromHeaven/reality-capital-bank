import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  PiggyBank,
  Landmark,
  Bell,
  LifeBuoy,
  Settings,
  Users,
  Shield,
  FileCheck,
  BarChart3,
  Globe,
} from "lucide-react";

import { ROLES } from "@/lib/constants";

export const navigation = {
  [ROLES.CUSTOMER]: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Accounts",
      icon: Wallet,
      href: "/accounts",
    },
    {
      title: "Transfers",
      icon: ArrowRightLeft,
      href: "/transfers",
    },
    {
      title: "Investments",
      icon: PiggyBank,
      href: "/investments",
    },
    {
      title: "Fixed Deposits",
      icon: Landmark,
      href: "/fixed-deposits",
    },
    {
      title: "Notifications",
      icon: Bell,
      href: "/notifications",
    },
    {
      title: "Support",
      icon: LifeBuoy,
      href: "/support",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ],

  [ROLES.ADMIN]: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      title: "Customers",
      icon: Users,
      href: "/admin/customers",
    },
    {
      title: "Transfers",
      icon: ArrowRightLeft,
      href: "/admin/transfers",
    },
    {
      title: "KYC",
      icon: FileCheck,
      href: "/admin/kyc",
    },
    {
      title: "Support",
      icon: LifeBuoy,
      href: "/admin/support",
    },
  ],

  [ROLES.SUPER_ADMIN]: [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/super-admin",
    },
    {
      title: "Admins",
      icon: Shield,
      href: "/super-admin/admins",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      href: "/super-admin/analytics",
    },
    {
      title: "Countries",
      icon: Globe,
      href: "/super-admin/countries",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/super-admin/settings",
    },
  ],
};
