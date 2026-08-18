import { useEffect } from "react";
import { useAppState } from "@/context/app-state";
import { ADMIN_USERS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function Admin() {
  const { role, setBreadcrumb } = useAppState();

  useEffect(() => {
    setBreadcrumb(["Admin"]);
  }, []);

  if (role !== "admin") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-md border border-card-border bg-card p-10 text-center">
        <ShieldAlert className="h-8 w-8 text-muted-foreground" />
        <h1 className="text-lg font-semibold">Admin access required</h1>
        <p className="text-sm text-muted-foreground">
          Switch to the Admin role from the top bar to view users, roles, and tenant settings.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground">Manage users, roles, and tenant configuration.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Users &amp; Roles</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm" data-testid="table-admin-users">
            <thead className="border-y border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
              <tr>
                <th className="px-5 py-2.5">Name</th>
                <th className="px-5 py-2.5">Email</th>
                <th className="px-5 py-2.5">Role</th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_USERS.map((u) => (
                <tr key={u.email} data-testid={`row-user-${u.email}`} className="border-b border-border last:border-none">
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3">{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tenant Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="tenant-name">Tenant name</Label>
              <Input id="tenant-name" data-testid="input-tenant-name" defaultValue="Acme Corp" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tenant-domain">Domain</Label>
              <Input id="tenant-domain" data-testid="input-tenant-domain" defaultValue="acme-corp.qalcurate.io" disabled />
            </div>
          </div>
          <Button data-testid="button-save-tenant-settings" variant="secondary">
            Save settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
