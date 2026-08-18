import { createContext, useContext, useState, type ReactNode } from "react";
import { Role } from "@/lib/roles";
import { SITES, type Site } from "@/lib/mock-data";

export type StepState = "locked" | "active" | "complete";

interface AppStateShape {
  loggedIn: boolean;
  login: () => void;
  logout: () => void;

  role: Role;
  setRole: (r: Role) => void;

  sites: Site[];
  activeSiteId: string;
  setActiveSiteId: (id: string) => void;
  activeSite: Site;

  stepStates: StepState[]; // index 0..5 => step 10.1..10.6
  activeStep: number; // 1-6
  setActiveStep: (n: number) => void;
  advanceStep: () => void;

  breadcrumb: string[];
  setBreadcrumb: (parts: string[]) => void;
}

const AppStateContext = createContext<AppStateShape | null>(null);

const INITIAL_STEP_STATES: StepState[] = [
  "complete",
  "complete",
  "active",
  "locked",
  "locked",
  "locked",
];

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>("crm");
  const [activeSiteId, setActiveSiteId] = useState(SITES[0].id);
  const [stepStates, setStepStates] = useState<StepState[]>(INITIAL_STEP_STATES);
  const [activeStep, setActiveStep] = useState(3);
  const [breadcrumb, setBreadcrumb] = useState<string[]>(["Dashboard"]);

  const advanceStep = () => {
    setStepStates((prev) => {
      const next = [...prev];
      const idx = activeStep - 1;
      next[idx] = "complete";
      if (idx + 1 < next.length && next[idx + 1] === "locked") {
        next[idx + 1] = "active";
      }
      return next;
    });
    if (activeStep < 6) setActiveStep(activeStep + 1);
  };

  const activeSite = SITES.find((s) => s.id === activeSiteId) ?? SITES[0];

  return (
    <AppStateContext.Provider
      value={{
        loggedIn,
        login: () => setLoggedIn(true),
        logout: () => setLoggedIn(false),
        role,
        setRole,
        sites: SITES,
        activeSiteId,
        setActiveSiteId,
        activeSite,
        stepStates,
        activeStep,
        setActiveStep,
        advanceStep,
        breadcrumb,
        setBreadcrumb,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
