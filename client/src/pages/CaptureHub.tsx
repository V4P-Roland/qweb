import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/context/app-state";
import { CAPTURE_CHANNELS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, ClipboardCheck, Globe, Upload, WifiOff, Wifi } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const ICONS: Record<string, typeof Mic> = {
  interview: Mic,
  audit: ClipboardCheck,
  "web-research": Globe,
  "file-upload": Upload,
};

export default function CaptureHub() {
  const { activeSite, setBreadcrumb } = useAppState();
  const [, navigate] = useLocation();
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setBreadcrumb([activeSite.name, "Capture"]);
  }, [activeSite]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Capture</h1>
        <p className="text-sm text-muted-foreground">
          Choose a Layer 1 capture channel for {activeSite.name}.
        </p>
      </div>

      <div
        data-testid="banner-offline-status"
        className={`flex items-center justify-between rounded-md border px-4 py-2.5 text-sm ${
          offline
            ? "border-warning/30 bg-warning-highlight text-warning"
            : "border-success/30 bg-success-highlight text-success"
        }`}
      >
        <div className="flex items-center gap-2">
          {offline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
          {offline
            ? "Offline — Web Research unavailable. Interview, Audit/Walkthrough, and File Upload remain available offline."
            : "Online — all four capture channels are available."}
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="offline-toggle" className="text-xs font-normal">
            Prototype: simulate offline
          </Label>
          <Switch id="offline-toggle" checked={offline} onCheckedChange={setOffline} data-testid="switch-simulate-offline" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CAPTURE_CHANNELS.map((c) => {
          const Icon = ICONS[c.id];
          const disabled = offline && !c.offline;
          return (
            <Card
              key={c.id}
              data-testid={`card-channel-${c.id}`}
              className={`transition-opacity ${disabled ? "opacity-50" : "hover-elevate cursor-pointer"}`}
              onClick={() => {
                if (!disabled) navigate(`/capture/${c.id}`);
              }}
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2.5 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight">{c.title}</h3>
                    <p className="text-xs text-muted-foreground">{c.subtitle}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{c.description}</p>
                {disabled && (
                  <p className="mt-2 text-xs font-medium text-warning">Reconnect to use this channel</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
