/**
 * ScreenTeaserWorkSalary `71:772` — headline segments (Caption L + accents) keyed by
 * ScreenGeneralWork (`subtle-single` work field) answer.
 */
export type WorkImpactParts = {
  /** Leading span — blue `#05a8ff` */
  a: string;
  /** Middle — white */
  b: string;
  /** Highlight — green `#18c362` (ends before `cTailWhite` when set) */
  c: string;
  /** White text between green highlight and `d` — e.g. “potential” */
  cTailWhite?: string;
  /** Trailing — white */
  d: string;
};

export const WORK_IMPACT_BY_FIELD: Record<string, WorkImpactParts> = {
  tech: {
    a: "Tech & Engineering ",
    b: "professionals with fluent English can unlock ",
    c: "up to 80% higher earning ",
    cTailWhite: "potential",
    d: "!",
  },
  business: {
    a: "Business & Finance ",
    b: "professionals with fluent English can unlock ",
    c: "up to 80% higher earning ",
    cTailWhite: "potential",
    d: "!",
  },
  education: {
    a: "Students ",
    b: "with strong English skills can access ",
    c: "more global study and career opportunities",
    d: "!",
  },
  creative: {
    a: "Creative & Media ",
    b: "professionals with fluent English can unlock ",
    c: "up to 80% higher earning ",
    cTailWhite: "potential",
    d: "!",
  },
  services: {
    a: "Services & Skilled Jobs ",
    b: "workers with fluent English can unlock ",
    c: "up to 80% higher earning ",
    cTailWhite: "potential",
    d: "!",
  },
  marketing: {
    a: "Marketing & Sales ",
    b: "professionals with fluent English can unlock ",
    c: "up to 80% higher earning ",
    cTailWhite: "potential",
    d: "!",
  },
  healthcare: {
    a: "Healthcare & Science ",
    b: "professionals with fluent English can unlock ",
    c: "up to 80% higher earning ",
    cTailWhite: "potential",
    d: "!",
  },
  "not-working": {
    a: "Job seekers ",
    b: "with fluent English can access ",
    c: "wider career opportunities and higher earning ",
    cTailWhite: "potential",
    d: "!",
  },
  "other-work": {
    a: "Professionals ",
    b: "with fluent English can unlock ",
    c: "up to 80% higher earning ",
    cTailWhite: "potential",
    d: "!",
  },
};

export const WORK_IMPACT_FALLBACK: WorkImpactParts =
  WORK_IMPACT_BY_FIELD["other-work"]!;

export const PEARSON_NOTE =
  "Based on Pearson English Impact research, 2024.";
