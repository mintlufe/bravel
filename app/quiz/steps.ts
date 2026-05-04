export type TitleTextOption = {
  id: string;
  emoji: string;
  title: string;
  description?: string;
  showChevron?: boolean;
};

export type CheckboxOption = { id: string; label: string; emoji?: string };

export type SubtleOption = {
  id: string;
  emoji: string;
  label: string;
  native?: string;
  muted?: boolean;
  allowCustomText?: boolean;
  /** Figma `QuizOptionWithSubtleText` — h 80 (Often/Sometimes rows). */
  density?: "default" | "spacious";
};

export type StartChoiceOption = {
  id: string;
  emoji: string;
  label: string;
};

export type QuizStep =
  | {
      kind: "start";
      headline: string;
      socialUsers: string;
      socialLine1: string;
      socialLine2: string;
      question: string;
      questionSub?: string;
      options: StartChoiceOption[];
    }
  | {
      kind: "teaser";
      variant: "people" | "loop" | "remember" | "table";
      progress: number;
      total: number;
      title: string;
      body?: string;
      ctaLabel?: string;
    }
  | {
      kind: "calculating";
      progress: number;
      total: number;
    }
  | {
      kind: "summary";
      progress: number;
      total: number;
      headline: string;
    }
  | {
      kind: "email";
      progress: number;
      total: number;
    }
  | {
      kind: "referral";
      progress: number;
      total: number;
    }
  | {
      kind: "title-single";
      progress: number;
      total: number;
      question: string;
      subtitle?: string;
      options: TitleTextOption[];
    }
  | {
      kind: "title-multi";
      progress: number;
      total: number;
      question: string;
      subtitle?: string;
      options: TitleTextOption[];
    }
  | {
      kind: "multi";
      progress: number;
      total: number;
      question: string;
      subtitle?: string;
      options: CheckboxOption[];
    }
  | {
      kind: "subtle-single";
      progress: number;
      total: number;
      question: string;
      subtitle?: string;
      options: SubtleOption[];
    }
  | {
      kind: "plain-single";
      progress: number;
      total: number;
      question: string;
      subtitle?: string;
      options: CheckboxOption[];
    }
  | {
      kind: "work-impact-teaser";
      progress: number;
      total: number;
    };

/** Post-start steps only (matches progress bar length). */
export const QUIZ_TOTAL = 21;

export const steps: QuizStep[] = [
  {
    kind: "start",
    headline: "Stop freezing when you speak English",
    socialUsers: "225k users",
    socialLine1: "around the world",
    socialLine2: "trusted Bravel",
    question: "What is your gender?",
    questionSub: "Hi, I’m Blink! 👋",
    options: [
      { id: "female", emoji: "👩", label: "Female" },
      { id: "male", emoji: "🧔‍♂️", label: "Male" },
    ],
  },
  {
    kind: "plain-single",
    progress: 1,
    total: QUIZ_TOTAL,
    question: "What is your age group?",
    subtitle:
      "This helps us adjust the pace and examples to your life stage",
    options: [
      { id: "u18", label: "Under 18" },
      { id: "18-24", label: "18-24" },
      { id: "25-34", label: "25-34" },
      { id: "35-44", label: "35-44" },
      { id: "45-54", label: "45-54" },
      { id: "55+", label: "55+" },
    ],
  },
  {
    kind: "teaser",
    variant: "people",
    progress: 2,
    total: QUIZ_TOTAL,
    title: "You’ve come\nto the right place!",
    body: "Aged 35-44 are already practicing English to speak more confidently at work, abroad, and in everyday life.",
  },
  {
    kind: "subtle-single",
    progress: 3,
    total: QUIZ_TOTAL,
    question: "How often do you struggle to express your thoughts in English?",
    options: [
      { id: "often", emoji: "🫣", label: "Often", density: "spacious" },
      { id: "sometimes", emoji: "😔", label: "Sometimes", density: "spacious" },
      { id: "rarely", emoji: "🤩", label: "Rarely", density: "spacious" },
    ],
  },
  {
    kind: "subtle-single",
    progress: 4,
    total: QUIZ_TOTAL,
    question: "How often do you feel left out because of English?",
    options: [
      { id: "often", emoji: "🫣", label: "Often", density: "spacious" },
      { id: "sometimes", emoji: "😔", label: "Sometimes", density: "spacious" },
      { id: "rarely", emoji: "🤩", label: "Rarely", density: "spacious" },
    ],
  },
  {
    kind: "multi",
    progress: 5,
    total: QUIZ_TOTAL,
    question: "What gets in your way when you speak English?",
    subtitle: "Choose all that applies",
    options: [
      { id: "freeze", emoji: "🥶", label: "I freeze mid-sentence" },
      { id: "express", emoji: "🗣️", label: "I can’t express myself clearly" },
      { id: "accent", emoji: "👂", label: "My accent feels unclear" },
      { id: "grammar", emoji: "✍️", label: "I make grammar mistakes" },
      { id: "speed", emoji: "🐢", label: "I can’t reply fast enough" },
      { id: "none", emoji: "🚫", label: "None of the above" },
    ],
  },
  {
    kind: "teaser",
    variant: "loop",
    progress: 6,
    total: QUIZ_TOTAL,
    title: "It’s more common than you think!",
    body: "Many learners understand English better than they can speak it. The good news? This gap can be fixed with the right kind of practice.",
  },
  {
    kind: "subtle-single",
    progress: 7,
    total: QUIZ_TOTAL,
    question: "What field do you work in?",
    options: [
      { id: "tech", emoji: "👷", label: "Tech & Engineering" },
      { id: "business", emoji: "💼", label: "Business & Finance" },
      { id: "education", emoji: "🧑‍🎓", label: "Students & Education" },
      { id: "creative", emoji: "🦄", label: "Creative & Media" },
      { id: "services", emoji: "🛠️", label: "Services & Skilled Jobs" },
      { id: "marketing", emoji: "📈", label: "Marketing & Sales" },
      { id: "not-working", emoji: "✨", label: "Not working right now" },
      { id: "other-work", emoji: "✍️", label: "Other", muted: true },
    ],
  },
  { kind: "work-impact-teaser", progress: 8, total: QUIZ_TOTAL },
  {
    kind: "plain-single",
    progress: 9,
    total: QUIZ_TOTAL,
    question: "How much time can you practice a day?",
    subtitle: "Even small daily practice works!",
    options: [
      { id: "5m", label: "5 minutes" },
      { id: "10m", label: "10 minutes" },
      { id: "15m", label: "15 minutes" },
      { id: "20m", label: "20+ minutes" },
    ],
  },
  {
    kind: "teaser",
    variant: "remember",
    progress: 10,
    total: QUIZ_TOTAL,
    title: "Small practice. Real progress",
    body: "You don’t need perfect discipline or long lessons. Short daily speaking sessions help you build confidence step by step.",
  },
  {
    kind: "title-multi",
    progress: 11,
    total: QUIZ_TOTAL,
    question: "What would you like your English to feel like?",
    subtitle: "Choose all that applies",
    options: [
      {
        id: "natural",
        emoji: "✨",
        title: "More natural",
        description: "Use phrases that sound like real speech",
      },
      {
        id: "confident",
        emoji: "😎",
        title: "More confident",
        description: "Speak faster without overthinking",
      },
      {
        id: "expressive",
        emoji: "🦄",
        title: "More expressive",
        description:
          "Say what you actually mean, not a simplified version",
      },
      {
        id: "fluent",
        emoji: "🚗",
        title: "More fluent",
        description: "Speak smoothly without long pauses",
      },
    ],
  },
  {
    kind: "subtle-single",
    progress: 12,
    total: QUIZ_TOTAL,
    question: "What kind of AI tutor would help you most?",
    options: [
      { id: "gentle", emoji: "🤝", label: "Gentle & supportive" },
      { id: "direct", emoji: "😎", label: "Direct & challenging" },
      { id: "native", emoji: "🤠", label: "Native-like partner" },
      { id: "fun", emoji: "🥳", label: "Fun & casual buddy" },
      { id: "choose", emoji: "🪄", label: "Choose one for me" },
    ],
  },
  {
    kind: "teaser",
    variant: "table",
    progress: 13,
    total: QUIZ_TOTAL,
    title: "Why AI practice fits real life better",
    ctaLabel: "Let’s go!",
  },
  { kind: "calculating", progress: 14, total: QUIZ_TOTAL },
  {
    kind: "summary",
    progress: 15,
    total: QUIZ_TOTAL,
    headline: "Based on\nyour answers",
  },
  {
    kind: "summary",
    progress: 16,
    total: QUIZ_TOTAL,
    headline: "we’ve created a personalized plan",
  },
  {
    kind: "summary",
    progress: 17,
    total: QUIZ_TOTAL,
    headline: "designed to help your English become more fluent",
  },
  {
    kind: "summary",
    progress: 18,
    total: QUIZ_TOTAL,
    headline: "in just\n5 minutes a day",
  },
  {
    kind: "summary",
    progress: 19,
    total: QUIZ_TOTAL,
    headline: "Let’s get started!",
  },
  { kind: "email", progress: 20, total: QUIZ_TOTAL },
  { kind: "referral", progress: 21, total: QUIZ_TOTAL },
];
