import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/context/app-state";
import { KPIS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ClipboardList, MapPin, FileCheck2 } from "lucide-react";
import { ROLE_ACCESS } from "@/lib/roles";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  not_started: { label: "Not started", className: "bg-muted text-muted-foreground" },
  in_progress: { label: "In progress", className: "bg-warning-highlight text-warning" },
  complete: { label: "Complete", className: "bg-success-highlight text-success" },
  draft: { label: "Draft", className: "bg-warning-highlight text-warning" },
  published: { label: "Published", className: "bg-success-highlight text-success" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_LABEL[status] ?? STATUS_LABEL.not_started;
  return <Badge className={`${cfg.className} border-none font-normal`}>{cfg.label}</Badge>;
}

export default function Dashboard() {
  const { sites, setActiveSiteId, setBreadcrumb, role } = useAppState();
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const access = ROLE_ACCESS[role];

  useEffect(() => {
    setBreadcrumb(["Dashboard"]);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const kpiCards = [
    { label: "Active Assessments", value: KPIS.activeAssessments, icon: ClipboardList },
    { label: "Sites Captured", value: KPIS.sitesCaptured, icon: MapPin },
    { label: "Reports Published", value: KPIS.reportsPublished, icon: FileCheck2 },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          At-a-glance overview of active assessments, captured sites, and published reports.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {kpiCards.map((k) => (
          <Card key={k.label} data-testid={`card-kpi-${k.label.toLowerCase().replace(/\s/g, "-")}`}>
            <CardContent className="flex items-center justify-between p-5">
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-7 w-10" />
                </div>
              ) : (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums">{k.value}</p>
                </div>
              )}
              <k.icon className="h-8 w-8 text-primary/40" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Projects &amp; Sites</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-testid="table-projects-sites">
              <thead className="border-y border-border bg-muted/40 text-left text-xs font-medium text-muted-foreground">
                <tr>
                  <th className="px-5 py-2.5">Site</th>
                  <th className="px-5 py-2.5">Capture</th>
                  <th className="px-5 py-2.5">Assessment</th>
                  <th className="px-5 py-2.5">Report</th>
                  <th className="px-5 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="border-b border-border last:border-none">
                        <td className="px-5 py-3" colSpan={5}>
                          <Skeleton className="h-4 w-full" />
                        </td>
                      </tr>
                    ))
                  : sites.map((s) => (
                      <tr
                        key={s.id}
                        data-testid={`row-site-${s.id}`}
                        className="border-b border-border last:border-none hover-elevate"
                      >
                        <td className="px-5 py-3">
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.location}</div>
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={s.captureStatus} />
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={s.assessmentStatus} />
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge status={s.reportStatus} />
                        </td>
                        <td className="px-5 py-3 text-right">
                          {access.capture !== "hidden" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              data-testid={`button-open-capture-${s.id}`}
                              onClick={() => {
                                setActiveSiteId(s.id);
                                navigate("/capture");
                              }}
                            >
                              Capture
                            </Button>
                          )}
                          {access.assessment !== "hidden" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              data-testid={`button-open-assessment-${s.id}`}
                              onClick={() => {
                                setActiveSiteId(s.id);
                                navigate("/assessment");
                              }}
                            >
                              Assessment
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
