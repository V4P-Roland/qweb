import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAppState } from "@/context/app-state";
import { PRIMARY_NAV, ADMIN_NAV } from "@/lib/nav";
import { ROLES, roleLabel } from "@/lib/roles";
import { Bell, ChevronDown, Lock, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function AppShell({ children }: { children: ReactNode }) {
  const { role, setRole, sites, activeSiteId, setActiveSiteId, activeSite, breadcrumb } = useAppState();
  const [location] = useLocation();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className="hidden md:flex w-[216px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar"
        data-testid="sidebar-nav"
      >
        <div className="flex items-center gap-2.5 px-5 py-5">
          <img src="logo/qalcurate-icon-color.svg" alt="Qalcurate" className="h-8 w-8" />
          <span className="text-base font-bold tracking-tight text-sidebar-foreground">Qalcurate</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {PRIMARY_NAV.filter((item) => item.visible(role)).map((item) => {
            const active = location === item.path || location.startsWith(item.path + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.path}
                data-testid={`nav-link-${item.key}`}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-3 py-3">
          {role === "admin" ? (
            <Link
              href={ADMIN_NAV.path}
              data-testid="nav-link-admin"
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.startsWith("/admin")
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60"
              }`}
            >
              <ADMIN_NAV.icon className="h-4 w-4" />
              Admin
            </Link>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  data-testid="nav-link-admin-locked"
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/35 cursor-not-allowed"
                >
                  <ADMIN_NAV.icon className="h-4 w-4" />
                  Admin
                  <Lock className="ml-auto h-3.5 w-3.5" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">Requires the Admin role</TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <div className="flex items-center gap-3">
            <img src="logo/qalcurate-icon-color.svg" alt="Qalcurate" className="h-6 w-6 md:hidden" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  data-testid="button-site-switcher"
                  className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-medium hover-elevate active-elevate-2"
                >
                  {activeSite.name}
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>Switch project / site</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sites.map((s) => (
                  <DropdownMenuItem
                    key={s.id}
                    data-testid={`option-site-${s.id}`}
                    onClick={() => setActiveSiteId(s.id)}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm">{s.name}</span>
                      <span className="text-xs text-muted-foreground">{s.location}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  data-testid="button-role-switcher"
                  className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover-elevate active-elevate-2"
                >
                  {roleLabel(role)}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>Preview as role (prototype)</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {ROLES.map((r) => (
                  <DropdownMenuItem key={r.id} data-testid={`option-role-${r.id}`} onClick={() => setRole(r.id)}>
                    {r.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              data-testid="button-notifications"
              className="rounded-full p-2 text-muted-foreground hover-elevate active-elevate-2"
            >
              <Bell className="h-4 w-4" />
            </button>

            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                {roleLabel(role)
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Breadcrumb */}
        <div
          data-testid="breadcrumb-line"
          className="flex items-center gap-1.5 border-b border-border bg-background px-4 py-2 text-xs text-muted-foreground md:px-6"
        >
          {breadcrumb.map((part, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              <span className={i === breadcrumb.length - 1 ? "font-medium text-foreground" : ""}>{part}</span>
            </span>
          ))}
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
