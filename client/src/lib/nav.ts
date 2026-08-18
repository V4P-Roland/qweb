import { LayoutDashboard, FolderKanban, Mic, ListChecks, FileBarChart, ShieldCheck } from "lucide-react";
import { ROLE_ACCESS, type Role } from "@/lib/roles";

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  visible: (role: Role) => boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    visible: (role) => ROLE_ACCESS[role].dashboard,
  },
  {
    key: "projects",
    label: "Projects & Sites",
    path: "/projects",
    icon: FolderKanban,
    visible: (role) => ROLE_ACCESS[role].projectsSites,
  },
  {
    key: "capture",
    label: "Capture",
    path: "/capture",
    icon: Mic,
    visible: (role) => ROLE_ACCESS[role].capture !== "hidden",
  },
  {
    key: "assessment",
    label: "Climate Risk Assessment",
    path: "/assessment",
    icon: ListChecks,
    visible: (role) => ROLE_ACCESS[role].assessment !== "hidden",
  },
  {
    key: "reports",
    label: "Reports & Dashboards",
    path: "/reports",
    icon: FileBarChart,
    visible: (role) => ROLE_ACCESS[role].reports !== "hidden",
  },
];

export const ADMIN_NAV: NavItem = {
  key: "admin",
  label: "Admin",
  path: "/admin",
  icon: ShieldCheck,
  visible: () => true, // always rendered, but locked unless role === "admin"
};
