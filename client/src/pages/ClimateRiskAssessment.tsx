import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/context/app-state";
import { canEditStep } from "@/lib/roles";
import { PHYSICAL_RISK_ROWS, TRANSITION_RISK_ROWS, MITIGATION_MEASURES, type RiskRow } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Lock, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STEPS = [
  { n: 1, code: "10.1", label: "Categories & Indicators" },
  { n: 2, code: "10.2", label: "Scenarios & Locations" },
  { n: 3, code: "10.3", label: "Physical Risk" },
  { n: 4, code: "10.4", label: "Transition Risk" },
  { n: 5, code: "10.5", label: "Mitigation & Adaptation" },
  { n: 6, code: "10.6", label: "Reports & Dashboards" },
];

const ASSIGNED: Record<number, string> = {
  1: "Anke Vogel · Climate Risk Manager",
  2: "Anke Vogel · Climate Risk Manager",
  3: "Tom Brandt · Risk/Finance Manager",
  4: "Tom Brandt · Risk/Finance Manager",
  5: "Sara Lindqvist · Executive/Risk Owner",
  6: "Priya Nair · Sustainability Manager",
};

function RiskTable({ rows }: { rows: RiskRow[] }) {
  const exposureClass: Record<string, string> = {
    Low: "bg-success-highlight text-success",
    Medium: "bg-warning-highlight text-warning",
    High: "bg-destructive/10 text-destructive",
  };
  return (
    <table className="w-full text-sm">
      <thead className="border-b border-border text-left text-xs font-medium text-muted-foreground">
        <tr>
          <th className="py-2">Hazard</th>
          <th className="py-2">Exposure</th>
          <th className="py-2">Risk score</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.hazard} className="border-b border-border last:border-none">
            <td className="py-2.5 font-medium">{r.hazard}</td>
            <td className="py-2.5">
              <Badge className={`${exposureClass[r.exposure]} border-none font-normal`}>{r.exposure}</Badge>
            </td>
            <td className="py-2.5 tabular-nums">{r.score}/100</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 1:
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Configure the classification of climate-related risks used throughout this assessment.
          </p>
          <ul className="space-y-2">
            {["Flooding", "Heat Stress", "Water Stress", "Storm & Wind", "Carbon Pricing", "Regulatory Change"].map((c) => (
              <li key={c} className="flex items-center gap-2 rounded-md border border-card-border bg-card px-3 py-2 text-sm">
                <Check className="h-4 w-4 text-success" /> {c}
              </li>
            ))}
          </ul>
        </div>
      );
    case 2:
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Warming scenario</label>
            <Select defaultValue="2c">
              <SelectTrigger data-testid="select-scenario"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1.5c">1.5°C</SelectItem>
                <SelectItem value="2c">2°C</SelectItem>
                <SelectItem value="3c">3°C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Location</label>
            <Select defaultValue="hh">
              <SelectTrigger data-testid="select-location"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hh">Hamburg Distribution Center</SelectItem>
                <SelectItem value="b">Berlin Logistics Hub</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    case 3:
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Warming scenario</label>
              <Select defaultValue="2c">
                <SelectTrigger data-testid="select-scenario-p3"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.5c">1.5°C</SelectItem>
                  <SelectItem value="2c">2°C</SelectItem>
                  <SelectItem value="3c">3°C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Location</label>
              <Select defaultValue="hh">
                <SelectTrigger data-testid="select-location-p3"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hh">Hamburg Distribution Center</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <RiskTable rows={PHYSICAL_RISK_ROWS} />
        </div>
      );
    case 4:
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Financial, operational, and strategic impact of transition risks under the selected scenario.
          </p>
          <RiskTable rows={TRANSITION_RISK_ROWS} />
        </div>
      );
    case 5:
      return (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Proposed mitigation and adaptation measures, pending executive approval.
          </p>
          <div className="overflow-x-auto rounded-md border border-card-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Measure</th>
                  <th className="px-3 py-2">Owner</th>
                  <th className="px-3 py-2">Budget</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {MITIGATION_MEASURES.map((m) => (
                  <tr key={m.measure} className="border-b border-border last:border-none">
                    <td className="px-3 py-2.5">{m.measure}</td>
                    <td className="px-3 py-2.5">{m.owner}</td>
                    <td className="px-3 py-2.5 tabular-nums">{m.budget}</td>
                    <td className="px-3 py-2.5">
                      <Badge className="border-none bg-warning-highlight font-normal text-warning">{m.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    default:
      return null;
  }
}

export default function ClimateRiskAssessment() {
  const { activeSite, setBreadcrumb, stepStates, activeStep, setActiveStep, advanceStep, role } = useAppState();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const current = STEPS.find((s) => s.n === activeStep) ?? STEPS[0];
  const canEdit = canEditStep(role, activeStep);

  useEffect(() => {
    setBreadcrumb([activeSite.name, "Climate Risk Assessment", `${current.code} ${current.label}`]);
  }, [activeSite, current]);

  const handleStepClick = (n: number) => {
    const idx = n - 1;
    if (stepStates[idx] === "locked") return;
    if (n === 6) {
      navigate("/reports");
      return;
    }
    setActiveStep(n);
  };

  const preconditionChips = STEPS.filter((s) => s.n < activeStep).map((s) => ({
    label: `${s.code} ${s.label}`,
    satisfied: stepStates[s.n - 1] === "complete",
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Climate Risk Assessment</h1>
        <p className="text-sm text-muted-foreground">{activeSite.name} — Module 10</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center overflow-x-auto rounded-md border border-card-border bg-card p-3" data-testid="stepper-module10">
        {STEPS.map((s, i) => {
          const state = stepStates[s.n - 1];
          const isActive = s.n === activeStep;
          return (
            <div key={s.n} className="flex items-center">
              <button
                data-testid={`stepper-node-${s.n}`}
                disabled={state === "locked"}
                onClick={() => handleStepClick(s.n)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : state === "locked"
                    ? "cursor-not-allowed text-muted-foreground/50"
                    : "text-foreground hover-elevate"
                }`}
              >
                {state === "complete" ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white">
                    <Check className="h-3 w-3" />
                  </span>
                ) : state === "locked" ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                    <Lock className="h-2.5 w-2.5" />
                  </span>
                ) : (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary">
                    <Circle className="h-2 w-2 fill-primary text-primary" />
                  </span>
                )}
                <span className="whitespace-nowrap">
                  {s.code} {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && <div className="mx-1 h-px w-4 shrink-0 bg-border" />}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_260px]">
        {/* Step detail */}
        <div className="rounded-md border border-card-border bg-card p-5">
          <h2 className="mb-1 text-base font-semibold">
            {current.code} — {current.label}
          </h2>
          {!canEdit && (
            <Badge className="mb-3 border-none bg-muted font-normal text-muted-foreground">View only for your role</Badge>
          )}
          <div className="mt-3">
            <StepContent step={activeStep} />
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-4 rounded-md border border-card-border bg-card p-4">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground">Assigned to</h3>
            <p className="mt-1 text-sm">{ASSIGNED[activeStep]}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground">Preconditions</h3>
            {preconditionChips.length === 0 ? (
              <p className="mt-1 text-xs text-muted-foreground">None</p>
            ) : (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {preconditionChips.map((c) => (
                  <Badge
                    key={c.label}
                    className={`border-none font-normal ${
                      c.satisfied ? "bg-success-highlight text-success" : "bg-warning-highlight text-warning"
                    }`}
                  >
                    {c.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={!canEdit}
              data-testid="button-save-draft"
              onClick={() => toast({ title: "Draft saved", description: `${current.code} preserved without advancing.` })}
            >
              Save Draft
            </Button>
            <Button
              size="sm"
              disabled={!canEdit || activeStep === 6}
              data-testid="button-continue-step"
              onClick={() => {
                advanceStep();
                toast({ title: activeStep === 5 ? "Approved" : "Advanced", description: `Moved past ${current.code}.` });
              }}
            >
              {activeStep === 5 ? "Approve" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
