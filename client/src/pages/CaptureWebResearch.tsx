import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAppState } from "@/context/app-state";
import { WEB_RESEARCH_RESULTS } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, ExternalLink, Loader2 } from "lucide-react";

export default function CaptureWebResearch() {
  const { activeSite, setBreadcrumb } = useAppState();
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("flood risk Hamburg 2050");
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(true);

  useEffect(() => {
    setBreadcrumb([activeSite.name, "Capture", "Web Research"]);
  }, [activeSite]);

  const runSearch = () => {
    setSearching(true);
    setShowResults(false);
    setTimeout(() => {
      setSearching(false);
      setShowResults(true);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <button
        data-testid="button-back-capture-hub"
        onClick={() => navigate("/capture")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Capture Hub
      </button>

      <div>
        <h1 className="text-xl font-bold tracking-tight">Web Research</h1>
        <p className="text-sm text-muted-foreground">{activeSite.name} — requires connectivity at request time</p>
      </div>

      <div className="flex gap-2">
        <Input
          data-testid="input-web-research-query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
          placeholder="Search public sources…"
        />
        <Button data-testid="button-web-research-search" onClick={runSearch} disabled={searching}>
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {showResults && (
        <div className="space-y-3" data-testid="list-web-research-results">
          {WEB_RESEARCH_RESULTS.map((r) => (
            <div key={r.url} className="rounded-md border border-card-border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-primary">{r.title}</h3>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{r.url}</p>
              <p className="mt-2 text-sm">{r.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
