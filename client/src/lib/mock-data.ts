export interface Site {
  id: string;
  name: string;
  location: string;
  captureStatus: "not_started" | "in_progress" | "complete";
  assessmentStatus: "not_started" | "in_progress" | "complete";
  reportStatus: "not_started" | "draft" | "published";
}

export const SITES: Site[] = [
  {
    id: "hh-dc",
    name: "Hamburg Distribution Center",
    location: "Hamburg, DE",
    captureStatus: "complete",
    assessmentStatus: "in_progress",
    reportStatus: "draft",
  },
  {
    id: "b-lh",
    name: "Berlin Logistics Hub",
    location: "Berlin, DE",
    captureStatus: "in_progress",
    assessmentStatus: "not_started",
    reportStatus: "not_started",
  },
  {
    id: "m-ap",
    name: "Munich Assembly Plant",
    location: "Munich, DE",
    captureStatus: "complete",
    assessmentStatus: "complete",
    reportStatus: "published",
  },
  {
    id: "l-wh",
    name: "Lyon Warehouse",
    location: "Lyon, FR",
    captureStatus: "not_started",
    assessmentStatus: "not_started",
    reportStatus: "not_started",
  },
];

export const KPIS = {
  activeAssessments: 2,
  sitesCaptured: 3,
  reportsPublished: 1,
};

export const CAPTURE_CHANNELS = [
  {
    id: "interview",
    title: "Interview",
    subtitle: "AI-guided",
    description:
      "Conduct a structured, AI-adapted voice/video interview. Responses are transcribed and structured automatically — no manual tagging.",
    offline: true,
  },
  {
    id: "audit",
    title: "Audit / Walkthrough",
    subtitle: "On-site evidence",
    description:
      "Capture timestamped, geo-tagged photo and note evidence during a physical site walkthrough.",
    offline: true,
  },
  {
    id: "web-research",
    title: "Web Research",
    subtitle: "Source-attributed",
    description:
      "Search external sources for site- and hazard-relevant public data, with every result linked back to its source.",
    offline: false,
  },
  {
    id: "file-upload",
    title: "File Upload",
    subtitle: "Documents & data",
    description:
      "Upload existing documents, spreadsheets, or reports. A context annotation is required before submission.",
    offline: true,
  },
];

export const INTERVIEW_TRANSCRIPT = [
  { speaker: "ai", text: "Let's start with flooding exposure. Has this site experienced flooding in the past 10 years?" },
  { speaker: "user", text: "Yes, minor surface flooding twice — once in 2021 after heavy rainfall, water didn't reach the building." },
  { speaker: "ai", text: "Understood. Is the site located within a designated flood zone, or near a river or coastline?" },
  { speaker: "user", text: "It's about 800 meters from the Elbe. Not in an official flood zone as far as I know." },
  { speaker: "ai", text: "Thank you. Now on heat stress — does the site have cooling systems rated for extended heatwave conditions?" },
];

export const STRUCTURING_PROGRESS = [
  { topic: "Flooding", status: "captured" as const },
  { topic: "Heat Stress", status: "partial" as const },
  { topic: "Water Stress", status: "not_started" as const },
  { topic: "Storm & Wind", status: "not_started" as const },
];

export const WEB_RESEARCH_RESULTS = [
  {
    title: "Copernicus Climate Change Service — Regional Flood Risk Data (Hamburg)",
    url: "climate.copernicus.eu/hamburg-flood-risk",
    snippet: "Annual flood probability layers and projected change under RCP scenarios for the Elbe estuary region.",
  },
  {
    title: "German Environment Agency — Heat Stress Indicators 2024",
    url: "umweltbundesamt.de/heat-stress-indicators-2024",
    snippet: "Number of tropical nights and heatwave-days projected for Northern Germany by warming scenario.",
  },
  {
    title: "Deutscher Wetterdienst — Regional Climate Projections",
    url: "dwd.de/regional-climate-projections",
    snippet: "Downscaled precipitation and temperature projections for the Hamburg metropolitan area.",
  },
];

export const EVIDENCE_LOG = [
  { id: "ev-1", timestamp: "12 Aug 2026, 09:41", type: "Audit / Walkthrough", geo: "53.5453° N, 9.9987° E" },
  { id: "ev-2", timestamp: "12 Aug 2026, 09:52", type: "Audit / Walkthrough", geo: "53.5453° N, 9.9987° E" },
  { id: "ev-3", timestamp: "13 Aug 2026, 14:10", type: "Audit / Walkthrough", geo: "53.5449° N, 9.9991° E" },
];

export interface RiskRow {
  hazard: string;
  exposure: "Low" | "Medium" | "High";
  score: number;
}

export const PHYSICAL_RISK_ROWS: RiskRow[] = [
  { hazard: "Flooding", exposure: "Medium", score: 62 },
  { hazard: "Heat Stress", exposure: "High", score: 78 },
  { hazard: "Water Stress", exposure: "Low", score: 24 },
];

export const TRANSITION_RISK_ROWS: RiskRow[] = [
  { hazard: "Carbon Pricing", exposure: "High", score: 71 },
  { hazard: "Regulatory Change", exposure: "Medium", score: 55 },
  { hazard: "Market Shift (Low-Carbon Demand)", exposure: "Medium", score: 48 },
];

export const MITIGATION_MEASURES = [
  { measure: "Flood barrier retrofit at loading dock", owner: "Facilities", budget: "€180,000", status: "Proposed" },
  { measure: "HVAC capacity upgrade for heat resilience", owner: "Facilities", budget: "€95,000", status: "Proposed" },
  { measure: "Supplier diversification (carbon-exposed inputs)", owner: "Procurement", budget: "€0 (process change)", status: "Draft" },
];

export const HEATMAP_HAZARDS = ["Flooding", "Heat Stress", "Water Stress", "Storm & Wind"];
export const HEATMAP_SCENARIOS = ["1.5°C", "2°C", "3°C"];
// level: 0 = Low, 1 = Medium, 2 = High
export const HEATMAP_DATA: number[][] = [
  [0, 1, 2], // Flooding
  [1, 2, 2], // Heat Stress
  [0, 0, 1], // Water Stress
  [1, 1, 1], // Storm & Wind
];

export const RISK_DISTRIBUTION = [
  { category: "Physical Risk", value: 58 },
  { category: "Transition Risk", value: 42 },
];

export const EVIDENCE_TRAIL = [
  { figure: "Flooding exposure score (62/100)", source: "Audit / Walkthrough, 12 Aug 2026" },
  { figure: "Heat Stress exposure score (78/100)", source: "Interview, 10 Aug 2026" },
  { figure: "Carbon Pricing transition risk (71/100)", source: "Web Research, 11 Aug 2026" },
  { figure: "Site coordinates & flood zone status", source: "File Upload — site-survey.pdf" },
];

export const TCFD_PILLARS: Record<string, { heading: string; points: string[] }> = {
  governance: {
    heading: "Governance",
    points: [
      "Board-level oversight of climate-related risks via the Risk & Sustainability Committee, reviewed quarterly.",
      "Executive/Risk Owner holds sign-off authority on mitigation and adaptation strategies (Step 10.5).",
      "Climate Risk Manager owns day-to-day risk identification and category definition (Steps 10.1–10.2).",
    ],
  },
  strategy: {
    heading: "Strategy",
    points: [
      "Physical risks (flooding, heat stress, water stress) and transition risks (carbon pricing, regulatory change) assessed across 1.5°C, 2°C, and 3°C scenarios.",
      "Hamburg Distribution Center identified as highest-exposure site for heat stress under all scenarios.",
      "Resilience measures under development for the two highest-scoring hazards site-wide.",
    ],
  },
  "risk-management": {
    heading: "Risk Management",
    points: [
      "Risks identified via four Layer 1 capture channels (Interview, Audit/Walkthrough, Web Research, File Upload) and assessed in Module 10.",
      "Every reported figure links back to its originating capture event (evidence & data trail, NFR 7.3).",
      "Risk scoring uses exposure × scenario severity, reviewed by the Climate Risk Manager before advancing to financial quantification.",
    ],
  },
  metrics: {
    heading: "Metrics & Targets",
    points: [
      "Physical risk score: 62/100 (Flooding), 78/100 (Heat Stress), 24/100 (Water Stress) — Hamburg Distribution Center.",
      "Transition risk score: 71/100 (Carbon Pricing) — highest exposure across assessed categories.",
      "Target: reduce combined site risk exposure by 20% by FY2028 through the proposed mitigation measures.",
    ],
  },
};

export const REPORTING_PERIODS = ["FY2026", "FY2025"];

export const ADMIN_USERS = [
  { name: "Anke Vogel", email: "a.vogel@acme-corp.example", role: "Climate Risk Manager" },
  { name: "Tom Brandt", email: "t.brandt@acme-corp.example", role: "Risk / Finance Manager" },
  { name: "Sara Lindqvist", email: "s.lindqvist@acme-corp.example", role: "Executive / Risk Owner" },
  { name: "Priya Nair", email: "p.nair@acme-corp.example", role: "Sustainability Manager" },
  { name: "Jonas Keller", email: "j.keller@acme-corp.example", role: "Field User / Auditor" },
];
