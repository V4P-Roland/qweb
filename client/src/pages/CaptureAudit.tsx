import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/context/app-state";
import { EVIDENCE_LOG } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/StatusChip";
import { ArrowLeft, Camera, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CaptureAudit() {
  const { activeSite, setBreadcrumb } = useAppState();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    setBreadcrumb([activeSite.name, "Capture", "Audit / Walkthrough"]);
  }, [activeSite]);

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <button
        data-testid="button-back-capture-hub"
        onClick={() => navigate("/capture")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Capture Hub
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Audit / Walkthrough</h1>
          <p className="text-sm text-muted-foreground">{activeSite.name}</p>
        </div>
        <Button
          data-testid="button-capture-evidence"
          onClick={() => toast({ title: "Evidence captured", description: "Timestamp and geo-tag attached automatically." })}
        >
          <Camera className="mr-1.5 h-4 w-4" /> Capture evidence
        </Button>
      </div>

      <div className="rounded-md border border-card-border bg-card">
        <div className="border-b border-card-border px-4 py-3 text-sm font-semibold">Evidence log</div>
        <ul>
          {EVIDENCE_LOG.map((e, i) => (
            <li
              key={e.id}
              data-testid={`row-evidence-${e.id}`}
              className={`flex items-center justify-between px-4 py-3 text-sm ${
                i < EVIDENCE_LOG.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div>
                <p className="font-medium">{e.type}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {e.geo} · {e.timestamp}
                </p>
              </div>
              <StatusChip kind={i === EVIDENCE_LOG.length - 1 ? "pending" : "synced"} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
