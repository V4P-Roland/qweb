import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/context/app-state";
import { INTERVIEW_TRANSCRIPT, STRUCTURING_PROGRESS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/StatusChip";
import { ArrowLeft, Play, Pause, Square, Check, Minus, Circle } from "lucide-react";

type RecState = "idle" | "recording" | "paused" | "pending" | "synced";

const PROGRESS_ICON: Record<string, { icon: typeof Check; className: string }> = {
  captured: { icon: Check, className: "text-success" },
  partial: { icon: Minus, className: "text-warning" },
  not_started: { icon: Circle, className: "text-muted-foreground" },
};

export default function CaptureInterview() {
  const { activeSite, setBreadcrumb } = useAppState();
  const [, navigate] = useLocation();
  const [rec, setRec] = useState<RecState>("idle");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    setBreadcrumb([activeSite.name, "Capture", "Interview"]);
  }, [activeSite]);

  useEffect(() => {
    if (rec !== "recording") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [rec]);

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <button
        data-testid="button-back-capture-hub"
        onClick={() => navigate("/capture")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Capture Hub
      </button>

      <div>
        <h1 className="text-xl font-bold tracking-tight">Interview — AI-Guided</h1>
        <p className="text-sm text-muted-foreground">{activeSite.name}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          {/* Recorder bar */}
          <div className="flex items-center justify-between rounded-md border border-card-border bg-card px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg tabular-nums">{mm}:{ss}</span>
              {rec === "idle" && (
                <Button size="sm" data-testid="button-record-start" onClick={() => setRec("recording")}>
                  <Play className="mr-1.5 h-3.5 w-3.5" /> Start
                </Button>
              )}
              {rec === "recording" && (
                <>
                  <Button size="sm" variant="secondary" data-testid="button-record-pause" onClick={() => setRec("paused")}>
                    <Pause className="mr-1.5 h-3.5 w-3.5" /> Pause
                  </Button>
                  <Button size="sm" variant="secondary" data-testid="button-record-stop" onClick={() => setRec("pending")}>
                    <Square className="mr-1.5 h-3.5 w-3.5" /> Stop
                  </Button>
                </>
              )}
              {rec === "paused" && (
                <>
                  <Button size="sm" data-testid="button-record-resume" onClick={() => setRec("recording")}>
                    <Play className="mr-1.5 h-3.5 w-3.5" /> Resume
                  </Button>
                  <Button size="sm" variant="secondary" data-testid="button-record-stop-2" onClick={() => setRec("pending")}>
                    <Square className="mr-1.5 h-3.5 w-3.5" /> Stop
                  </Button>
                </>
              )}
              {(rec === "pending" || rec === "synced") && (
                <Button
                  size="sm"
                  variant="secondary"
                  data-testid="button-record-sync"
                  disabled={rec === "synced"}
                  onClick={() => setRec("synced")}
                >
                  Sync now
                </Button>
              )}
            </div>
            {rec === "recording" && <StatusChip kind="recording" />}
            {rec === "paused" && <StatusChip kind="paused" />}
            {rec === "pending" && <StatusChip kind="pending" />}
            {rec === "synced" && <StatusChip kind="synced" />}
          </div>

          {/* Transcript */}
          <div className="space-y-3 rounded-md border border-card-border bg-card p-4">
            {INTERVIEW_TRANSCRIPT.map((line, i) => (
              <div key={i} className={`flex ${line.speaker === "ai" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3.5 py-2 text-sm ${
                    line.speaker === "ai" ? "bg-accent text-accent-foreground" : "bg-primary/10 text-foreground"
                  }`}
                >
                  {line.text}
                </div>
              </div>
            ))}
            {rec === "recording" && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-lg bg-accent px-3.5 py-2.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-foreground/60" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-foreground/60 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-foreground/60 [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Structuring progress */}
        <div className="space-y-3 rounded-md border border-card-border bg-card p-4">
          <h3 className="text-sm font-semibold">Structuring Progress</h3>
          <p className="text-xs text-muted-foreground">By hazard topic</p>
          <ul className="mt-2 space-y-2.5">
            {STRUCTURING_PROGRESS.map((p) => {
              const cfg = PROGRESS_ICON[p.status];
              const Icon = cfg.icon;
              return (
                <li key={p.topic} className="flex items-center justify-between text-sm">
                  <span>{p.topic}</span>
                  <Icon className={`h-4 w-4 ${cfg.className}`} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
