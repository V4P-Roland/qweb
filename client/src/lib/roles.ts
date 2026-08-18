export type Role =
  | "field_user"
  | "crm"
  | "rfm"
  | "executive"
  | "sustainability"
  | "admin";

export interface RoleDef {
  id: Role;
  label: string;
  shortLabel: string;
}

export const ROLES: RoleDef[] = [
  { id: "field_user", label: "Field User / Auditor", shortLabel: "Field User" },
  { id: "crm", label: "Climate Risk Manager", shortLabel: "Climate Risk Mgr" },
  { id: "rfm", label: "Risk / Finance Manager", shortLabel: "Risk/Finance Mgr" },
  { id: "executive", label: "Executive / Risk Owner", shortLabel: "Executive" },
  { id: "sustainability", label: "Sustainability Manager", shortLabel: "Sustainability Mgr" },
  { id: "admin", label: "Admin", shortLabel: "Admin" },
];

export function roleLabel(role: Role): string {
  return ROLES.find((r) => r.id === role)?.label ?? role;
}

/** Section-level visibility, per UI Concept — Web Version §4.2. */
export interface SectionAccess {
  dashboard: boolean;
  projectsSites: boolean;
  capture: "full" | "view" | "hidden";
  assessment: "hidden" | "view" | "steps";
  reports: "hidden" | "view" | "full";
}

export const ROLE_ACCESS: Record<Role, SectionAccess> = {
  field_user: {
    dashboard: true,
    projectsSites: true,
    capture: "full",
    assessment: "hidden",
    reports: "hidden",
  },
  crm: {
    dashboard: true,
    projectsSites: true,
    capture: "view",
    assessment: "steps",
    reports: "view",
  },
  rfm: {
    dashboard: true,
    projectsSites: false,
    capture: "hidden",
    assessment: "steps",
    reports: "view",
  },
  executive: {
    dashboard: true,
    projectsSites: false,
    capture: "hidden",
    assessment: "steps",
    reports: "view",
  },
  sustainability: {
    dashboard: true,
    projectsSites: false,
    capture: "hidden",
    assessment: "view",
    reports: "full",
  },
  admin: {
    dashboard: true,
    projectsSites: false,
    capture: "hidden",
    assessment: "hidden",
    reports: "hidden",
  },
};

/** Which role may edit (Save Draft / Continue / Approve) a given Module 10 step. */
export function canEditStep(role: Role, step: number): boolean {
  if (step === 1 || step === 2) return role === "crm";
  if (step === 3 || step === 4) return role === "rfm";
  if (step === 5) return role === "executive";
  return false; // Step 10.6 lives in Reports & Dashboards, not the stepper
}

export function canReviewStep(role: Role): boolean {
  return role === "crm";
}
