import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/context/app-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATUS_LABEL: Record<string, { label: string; className: string }> = {
  not_started: { label: "Not started", className: "bg-muted text-muted-foreground" },
  in_progress: { label: "In progress", className: "bg-warning-highlight text-warning" },
  complete: { label: "Complete", className: "bg-success-highlight text-success" },
};

export default function ProjectsSites() {
  const { sites, setActiveSiteId, setBreadcrumb } = useAppState();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    setBreadcrumb(["Projects & Sites"]);
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Projects &amp; Sites</h1>
          <p className="text-sm text-muted-foreground">
            Manage the projects and physical locations that capture and analysis are scoped to.
          </p>
        </div>
        <Button
          data-testid="button-add-site"
          onClick={() => toast({ title: "Add site", description: "Prototype only — no new site is created." })}
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add site
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {sites.map((s) => (
          <Card key={s.id} data-testid={`card-site-${s.id}`} className="hover-elevate">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{s.name}</h3>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {s.location}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className={`${STATUS_LABEL[s.captureStatus].className} border-none font-normal`}>
                  Capture: {STATUS_LABEL[s.captureStatus].label}
                </Badge>
                <Badge className={`${STATUS_LABEL[s.assessmentStatus].className} border-none font-normal`}>
                  Assessment: {STATUS_LABEL[s.assessmentStatus].label}
                </Badge>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  data-testid={`button-view-capture-${s.id}`}
                  onClick={() => {
                    setActiveSiteId(s.id);
                    navigate("/capture");
                  }}
                >
                  Capture
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  data-testid={`button-view-assessment-${s.id}`}
                  onClick={() => {
                    setActiveSiteId(s.id);
                    navigate("/assessment");
                  }}
                >
                  Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
