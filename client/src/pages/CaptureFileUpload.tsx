import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/context/app-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UploadCloud, FileText, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CaptureFileUpload() {
  const { activeSite, setBreadcrumb } = useAppState();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string | null>(null);
  const [annotation, setAnnotation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setBreadcrumb([activeSite.name, "Capture", "File Upload"]);
  }, [activeSite]);

  const canSubmit = !!fileName && annotation.trim().length > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <button
        data-testid="button-back-capture-hub"
        onClick={() => navigate("/capture")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Capture Hub
      </button>

      <div>
        <h1 className="text-xl font-bold tracking-tight">File Upload</h1>
        <p className="text-sm text-muted-foreground">{activeSite.name}</p>
      </div>

      <button
        data-testid="dropzone-file-upload"
        onClick={() => setFileName("site-survey-2026.pdf")}
        className="flex w-full flex-col items-center gap-2 rounded-md border-2 border-dashed border-border bg-card px-6 py-10 text-center hover-elevate"
      >
        {fileName ? (
          <>
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium">{fileName}</span>
            <span className="text-xs text-muted-foreground">Click to replace</span>
          </>
        ) : (
          <>
            <UploadCloud className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm font-medium">Click to select a file, or drag it here</span>
            <span className="text-xs text-muted-foreground">PDF, XLSX, DOCX up to 25 MB</span>
          </>
        )}
      </button>

      <div className="space-y-2">
        <Label htmlFor="annotation">
          Context annotation <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="annotation"
          data-testid="input-context-annotation"
          value={annotation}
          onChange={(e) => setAnnotation(e.target.value)}
          placeholder="Describe what this file contains and how it should be used in the assessment…"
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          Required before submission — hard validation rule (MVP Concept §4.4).
        </p>
      </div>

      {submitted ? (
        <div className="flex items-center gap-2 rounded-md bg-success-highlight px-4 py-3 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" /> File submitted and queued for sync.
        </div>
      ) : (
        <Button
          data-testid="button-submit-file"
          disabled={!canSubmit}
          onClick={() => {
            setSubmitted(true);
            toast({ title: "File submitted", description: fileName ?? undefined });
          }}
        >
          Submit
        </Button>
      )}
    </div>
  );
}
