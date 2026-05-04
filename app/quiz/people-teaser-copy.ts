/** Learner stats + copy for the “people” teaser (after age group). */
const PEOPLE_TEASER_BY_AGE = {
  u18: {
    count: 18_450,
    lead: "Under 18",
    rest: " are already building English speaking confidence with us — and your plan will be adapted to your pace.",
  },
  "18-24": {
    count: 51_750,
    lead: "Aged 18–24",
    rest: " are already practicing English for studies, work, travel, and life abroad.",
  },
  "25-34": {
    count: 74_250,
    lead: "Aged 25–34",
    rest: " are already improving their English speaking confidence for career and real-life conversations.",
  },
  "35-44": {
    count: 45_000,
    lead: "Aged 35–44",
    rest: " are already practicing English to speak more confidently at work, abroad, and in everyday life.",
  },
  "45-54": {
    count: 22_500,
    lead: "Aged 45–54",
    rest: " are already building practical English speaking skills at their own pace.",
  },
  "55+": {
    count: 13_050,
    lead: "Aged 55+",
    rest: " are already improving their English with short, supportive daily practice.",
  },
} as const;

export type PeopleTeaserAgeId = keyof typeof PEOPLE_TEASER_BY_AGE;

function isPeopleTeaserAgeId(id: string): id is PeopleTeaserAgeId {
  return id in PEOPLE_TEASER_BY_AGE;
}

/** Whole thousands only (18_450 → `18k`, not `18.5k`). */
export function formatLearnerCountK(count: number): string {
  return `${Math.floor(count / 1000)}k`;
}

export function getPeopleTeaserCopy(ageId: string | null) {
  const id: PeopleTeaserAgeId =
    ageId && isPeopleTeaserAgeId(ageId) ? ageId : "35-44";
  const row = PEOPLE_TEASER_BY_AGE[id];
  return {
    learnerCountLabel: formatLearnerCountK(row.count),
    lead: row.lead,
    rest: row.rest,
  };
}
