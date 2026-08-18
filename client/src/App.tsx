import { useEffect } from "react";
import { Switch, Route, Router, useLocation } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AppStateProvider, useAppState } from "@/context/app-state";
import { AppShell } from "@/components/layout/AppShell";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ProjectsSites from "@/pages/ProjectsSites";
import CaptureHub from "@/pages/CaptureHub";
import CaptureInterview from "@/pages/CaptureInterview";
import CaptureAudit from "@/pages/CaptureAudit";
import CaptureWebResearch from "@/pages/CaptureWebResearch";
import CaptureFileUpload from "@/pages/CaptureFileUpload";
import ClimateRiskAssessment from "@/pages/ClimateRiskAssessment";
import ReportsDashboards from "@/pages/ReportsDashboards";
import Admin from "@/pages/Admin";

function Redirect({ to }: { to: string }) {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate(to, { replace: true });
  }, []);
  return null;
}

function AuthenticatedApp() {
  return (
    <AppShell>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/projects" component={ProjectsSites} />
        <Route path="/capture" component={CaptureHub} />
        <Route path="/capture/interview" component={CaptureInterview} />
        <Route path="/capture/audit" component={CaptureAudit} />
        <Route path="/capture/web-research" component={CaptureWebResearch} />
        <Route path="/capture/file-upload" component={CaptureFileUpload} />
        <Route path="/assessment" component={ClimateRiskAssessment} />
        <Route path="/reports" component={ReportsDashboards} />
        <Route path="/admin" component={Admin} />
        <Route path="/" component={() => <Redirect to="/dashboard" />} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function AppRouter() {
  const { loggedIn } = useAppState();

  if (!loggedIn) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route component={Login} />
      </Switch>
    );
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppStateProvider>
          <Router hook={useHashLocation}>
            <AppRouter />
          </Router>
        </AppStateProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
