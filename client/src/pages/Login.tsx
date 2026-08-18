import { useState } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/context/app-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";

type ViewState = "default" | "error" | "redirecting";

export default function Login() {
  const { login } = useAppState();
  const [, navigate] = useLocation();
  const [tenant, setTenant] = useState("acme-corp.qalcurate.io");
  const [state, setState] = useState<ViewState>("default");

  const handleContinue = () => {
    if (tenant.trim().toLowerCase() === "unknown-tenant.qalcurate.io") {
      setState("error");
      return;
    }
    setState("redirecting");
    setTimeout(() => {
      login();
      navigate("/dashboard");
    }, 900);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-lg border border-card-border bg-card p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img src="logo/qalcurate-icon-color.svg" alt="Qalcurate" className="h-12 w-12" />
          <div>
            <h1 className="text-lg font-bold tracking-tight">Qalcurate</h1>
            <p className="text-sm text-muted-foreground">Sign in to your workspace</p>
          </div>
        </div>

        {state === "error" && (
          <div
            data-testid="alert-tenant-not-found"
            className="mb-4 flex items-start gap-2 rounded-md bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Tenant "{tenant}" was not found. Check the address or contact your administrator.
            </span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="tenant">Tenant</Label>
          <Input
            id="tenant"
            data-testid="input-tenant"
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
            placeholder="your-company.qalcurate.io"
          />
        </div>

        <Button
          data-testid="button-continue-sso"
          className="mt-5 w-full"
          disabled={state === "redirecting"}
          onClick={handleContinue}
        >
          {state === "redirecting" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Redirecting to sign-in…
            </>
          ) : (
            "Continue to Single Sign-On"
          )}
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Credential entry happens inside your organization's Keycloak-hosted sign-in flow.
        </p>

        <button
          data-testid="button-simulate-unknown-tenant"
          onClick={() => setTenant("unknown-tenant.qalcurate.io")}
          className="mt-6 block w-full text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
        >
          Prototype: simulate an unknown tenant
        </button>
      </div>
    </div>
  );
}
