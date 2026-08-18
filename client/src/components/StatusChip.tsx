import { cn } from "@/lib/utils";
import { Cloud, CloudOff, AlertTriangle, CircleDot } from "lucide-react";

export type ChipKind = "synced" | "pending" | "error" | "gaps" | "recording" | "paused";

const CONFIG: Record<ChipKind, { label: string; icon: typeof Cloud; className: string }> = {
  synced: { label: "Synced", icon: Cloud, className: "bg-success-highlight text-success" },
  pending: { label: "Pending sync", icon: CloudOff, className: "bg-warning-highlight text-warning" },
  error: { label: "Sync error", icon: AlertTriangle, className: "bg-destructive/10 text-destructive" },
  gaps: { label: "Data gaps", icon: AlertTriangle, className: "bg-warning-highlight text-warning" },
  recording: { label: "Recording", icon: CircleDot, className: "bg-destructive/10 text-destructive" },
  paused: { label: "Paused", icon: CircleDot, className: "bg-muted text-muted-foreground" },
};

export function StatusChip({ kind, label, className }: { kind: ChipKind; label?: string; className?: string }) {
  const cfg = CONFIG[kind];
  const Icon = cfg.icon;
  return (
    <span
      data-testid={`status-chip-${kind}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        cfg.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {label ?? cfg.label}
    </span>
  );
}
