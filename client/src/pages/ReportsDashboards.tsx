import { useEffect, useState } from "react";
import { useAppState } from "@/context/app-state";
import {
  HEATMAP_HAZARDS,
  HEATMAP_SCENARIOS,
  HEATMAP_DATA,
  RISK_DISTRIBUTION,
  EVIDENCE_TRAIL,
  TCFD_PILLARS,
  REPORTING_PERIODS,
} from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusChip } from "@/components/StatusChip";
import { Download, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "governance", label: "Governance" },
  { key: "strategy", label: "Strategy" },
  { key: "risk-management", label: "Risk Management" },
  { key: "metrics", label: "Metrics & Targets" },
];

const HEAT_COLORS = ["bg-success-highlight text-success", "bg-warning-highlight text-warning", "bg-destructive/10 text-destructive"];
const HEAT_LABELS = ["Low", "Medium", "High"];

export default function ReportsDashboards() {
  const { activeSite, setBreadcrumb } = useAppState();
  const { toast } = useToast();
  const [tab, setTab] = useState("overview");
  const [period, setPeriod] = useState(REPORTING_PERIODS[0]);

  useEffect(() => {
    setBreadcrumb([activeSite.name, "Reports & Dashboards"]);
  }, [activeSite]);

  const maxDist = Math.max(...RISK_DISTRIBUTION.map((d) => d.value));

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Reports &amp; Dashboards</h1>
          <p className="text-sm text-muted-foreground">{activeSite.name} — TCFD-aligned climate risk report</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-28" data-testid="select-reporting-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REPORTING_PERIODS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            data-testid="button-export-pdf"
            onClick={() => toast({ title: "Export started", description: "PDF export is a prototype action." })}
          >
            <Download className="mr-1.5 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            data-testid={`tab-${t.key}`}
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Heatmap */}
            <div className="rounded-md border border-card-border bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">Physical Risk Heatmap</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left font-medium text-muted-foreground"></th>
                    {HEATMAP_SCENARIOS.map((s) => (
                      <th key={s} className="px-1 py-1 text-center font-medium text-muted-foreground">
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {HEATMAP_HAZARDS.map((h, ri) => (
                    <tr key={h}>
                      <td className="py-1 pr-2 text-right font-medium">{h}</td>
                      {HEATMAP_DATA[ri].map((level, ci) => (
                        <td key={ci} className="p-1">
                          <div
                            data-testid={`heatmap-cell-${ri}-${ci}`}
                            className={`flex h-9 items-center justify-center rounded text-xs font-medium ${HEAT_COLORS[level]}`}
                          >
                            {HEAT_LABELS[level]}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Risk distribution */}
            <div className="rounded-md border border-card-border bg-card p-4">
              <h3 className="mb-3 text-sm font-semibold">Risk Distribution</h3>
              <div className="space-y-3">
                {RISK_DISTRIBUTION.map((d, i) => (
                  <div key={d.category}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-medium">{d.category}</span>
                      <span className="tabular-nums text-muted-foreground">{d.value}</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${i === 0 ? "bg-primary" : "bg-primary/40"}`}
                        style={{ width: `${(d.value / maxDist) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Evidence trail */}
          <div className="rounded-md border border-card-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Evidence &amp; Data Trail</h3>
              <div className="flex items-center gap-1.5 text-xs text-warning">
                <AlertTriangle className="h-3.5 w-3.5" /> 1 data gap flagged
              </div>
            </div>
            <ul className="space-y-2.5">
              {EVIDENCE_TRAIL.map((e) => (
                <li key={e.figure} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p>{e.figure}</p>
                    <p className="text-xs text-muted-foreground">{e.source}</p>
                  </div>
                  <StatusChip kind="synced" />
                </li>
              ))}
              <li className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p>Water Stress mitigation coverage</p>
                  <p className="text-xs text-muted-foreground">No capture event linked yet</p>
                </div>
                <StatusChip kind="gaps" />
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-card-border bg-card p-5">
          <h2 className="mb-3 text-base font-semibold">{TCFD_PILLARS[tab].heading}</h2>
          <ul className="space-y-2.5">
            {TCFD_PILLARS[tab].points.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
