export type Choice = { label: string; next: string; };
export type Scene = { id: string; speaker?: string; text: string; };
export type Chapter = { id: string; title: string; tag?: string; scenes: Scene[]; choices?: Choice[]; };

export const chapters: Record<string, Chapter> = {
  intro: {
    id: "intro",
    title: "Prologue: Awakening",
    scenes: [
      { id: "s1", text: "A flicker of neon cuts through the dark. >_" },
      { id: "s2", text: "You step into a world of numbers, stories, and code." },
      { id: "s3", text: "Meet Aditya Singh — final year B.Tech (CSSE), crafting fintech and data stories." }
    ],
    choices: [{ label: "Begin the journey →", next: "profile" }]
  },
  profile: {
    id: "profile",
    title: "Character Card",
    scenes: [
      { id: "s1", text: "Name: Aditya Singh | Role: Tech × Finance | Goal: IB/FinTech excellence" },
      { id: "s2", text: "Signature Builds: DealLens (AI M&A Screener), NUS GiP Airbnb Analytics" },
      { id: "s3", text: "Education: Modern School Barakhamba Road, B.Tech CSSE (KIIT)" }
    ],
    choices: [
      { label: "See DealLens (AI M&A Screener)", next: "deallens" },
      { label: "NUS GiP — Airbnb Analytics", next: "nus" },
      { label: "Certificates", next: "certificates" },
      { label: "View skills/stats", next: "stats" }
    ]
  },
  deallens: {
    id: "deallens",
    title: "Chapter: The Analyst's Awakening",
    scenes: [
      { id: "s1", text: "DealLens: an AI-driven M&A screener." },
      { id: "s2", text: "Stack: Next.js, vector search, LLM prompt engineering." },
      { id: "s3", text: "Outcome: Faster scouting, defensible deal narratives." }
    ],
    choices: [
      { label: "Open Live Demo", next: "link_deallens" },
      { label: "Back to Profile", next: "profile" },
      { label: "Next: NUS", next: "nus" }
    ]
  },
  nus: {
    id: "nus",
    title: "Chapter: Global Quest",
    scenes: [
      { id: "s1", text: "NUS Global Immersion: Airbnb dataset → insights via Power BI, Orange, Excel." },
      { id: "s2", text: "Outcome: Pricing levers, occupancy drivers, actionable dashboards." }
    ],
    choices: [
      { label: "Back to Profile", next: "profile" },
      { label: "View Stats", next: "stats" }
    ]
  },
  stats: {
    id: "stats",
    title: "Skills & Attributes",
    scenes: [
      { id: "s1", text: "Web Dev (Next.js/TS): 85%" },
      { id: "s2", text: "Data/ML (EDA/Viz): 75%" },
      { id: "s3", text: "Finance (CFA L1 path): 60%" },
      { id: "s4", text: "Product & UX: 70%" }
    ],
    choices: [{ label: "Back to Profile", next: "profile" }]
  },
  certificates: {
    id: "certificates",
    title: "Achievements & Certifications",
    tag: "Certificates",
    scenes: [
      { id: "s1", text: "Key credentials earned along the journey:" },
      { id: "s2", text: "🏅 NUS Global Immersion Programme Certificate — verified" },
      { id: "s3", text: "📜 Coursera: Financial Markets (Yale) — verified" },
      { id: "s4", text: "📜 Coursera: AI for Everyone — verified" }
    ],
    choices: [
      { label: "View NUS Credential", next: "link_nus_cert" },
      { label: "View Coursera: Financial Markets", next: "link_coursera_fin" },
      { label: "View Coursera: AI for Everyone", next: "link_coursera_ai" },
      { label: "Back to Profile", next: "profile" }
    ]
  },
  link_deallens: {
    id: "link_deallens",
    title: "Opening DealLens...",
    scenes: [{ id: "s1", text: "Redirecting..." }],
    choices: [{ label: "Return", next: "deallens" }]
  },
  link_nus_cert: {
    id: "link_nus_cert",
    title: "Opening NUS Certificate...",
    scenes: [{ id: "s1", text: "Redirecting to NUS credentials page..." }],
    choices: [{ label: "Return", next: "certificates" }]
  },
  link_coursera_fin: {
    id: "link_coursera_fin",
    title: "Opening Coursera (Financial Markets)...",
    scenes: [{ id: "s1", text: "Redirecting..." }],
    choices: [{ label: "Return", next: "certificates" }]
  },
  link_coursera_ai: {
    id: "link_coursera_ai",
    title: "Opening Coursera (AI for Everyone)...",
    scenes: [{ id: "s1", text: "Redirecting..." }],
    choices: [{ label: "Return", next: "certificates" }]
  }
};
export const START_CHAPTER = "intro";

export const stats = [
  { label: "Web Dev (Next.js / TS)", value: 85 },
  { label: "Data / ML (EDA, Viz)", value: 75 },
  { label: "Fin / IB Concepts (CFA L1 path)", value: 60 },
  { label: "Product & UX", value: 70 },
];
