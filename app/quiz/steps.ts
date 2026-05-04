export type TitleTextOption = {
  id: string;
  emoji: string;
  title: string;
  description?: string;
  showChevron?: boolean;
};

export type CheckboxOption = { id: string; label: string };

export type SubtleOption = {
  id: string;
  emoji: string;
  label: string;
  native?: string;
  muted?: boolean;
  /** Require typed answer before Continue (e.g. Other) */
  allowCustomText?: boolean;
};

export type QuizStep =
  | {
      kind: "start";
      headline: string;
      question: string;
      options: TitleTextOption[];
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
      /** ScreenTeaserWorkSalary `71:772` — after ScreenGeneralWork */
      kind: "work-impact-teaser";
      progress: number;
      total: number;
    }
  | {
      kind: "plain-single";
      progress: number;
      total: number;
      question: string;
      subtitle?: string;
      options: CheckboxOption[];
    };

export const QUIZ_TOTAL = 11;

export const steps: QuizStep[] = [
  {
    kind: "start",
    headline: "Stop freezing when you speak English",
    question: "What happens when you need to speak out loud?",
    options: [
      {
        id: "blank",
        emoji: "🤯",
        title: "My mind goes blank",
        description: "I forget everything I know",
        showChevron: true,
      },
      {
        id: "translate",
        emoji: "🗯️",
        title: "I translate first",
        description: "I build every sentence in my head",
        showChevron: true,
      },
      {
        id: "less",
        emoji: "🤏",
        title: "I say less than I mean",
        description: "My English sounds simpler",
        showChevron: true,
      },
      {
        id: "quiet",
        emoji: "😶‍🌫️",
        title: "I stay quiet",
        description: "Mistakes feel risky",
        showChevron: true,
      },
    ],
  },
  {
    kind: "title-single",
    progress: 2,
    total: QUIZ_TOTAL,
    question: "What would you like your English to feel like?",
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
        description: "Say what you actually mean, not a simplified version",
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
    kind: "multi",
    progress: 3,
    total: QUIZ_TOTAL,
    question: "Why do you want to improve your English?",
    subtitle: "Choose all that applies.",
    options: [
      { id: "work", label: "Speak confidently at work" },
      { id: "job", label: "Find a new job" },
      { id: "abroad", label: "Live comfortably abroad" },
      { id: "travel", label: "Travel with ease" },
      { id: "skills", label: "Expand my skills" },
      { id: "family", label: "Connect with family & friends" },
      { id: "natives", label: "Understand natives better" },
    ],
  },
  {
    kind: "subtle-single",
    progress: 4,
    total: QUIZ_TOTAL,
    question: "What field do you work in?",
    options: [
      { id: "tech", emoji: "👷", label: "Tech & Engineering" },
      { id: "business", emoji: "💵", label: "Business & Finance" },
      { id: "education", emoji: "🧑‍🎓", label: "Students & Education" },
      { id: "creative", emoji: "🤩", label: "Creative & Media" },
      { id: "services", emoji: "⚒️", label: "Services & Skilled Jobs" },
      { id: "marketing", emoji: "📈", label: "Marketing & Sales" },
      { id: "healthcare", emoji: "🧬", label: "Healthcare & Science" },
      { id: "not-working", emoji: "🏡", label: "Not working right now" },
      {
        id: "other-work",
        emoji: "✍️",
        label: "Other",
        muted: true,
        allowCustomText: true,
      },
    ],
  },
  {
    kind: "work-impact-teaser",
    progress: 4,
    total: QUIZ_TOTAL,
  },
  {
    kind: "subtle-single",
    progress: 5,
    total: QUIZ_TOTAL,
    question: "What is your gender?",
    options: [
      { id: "female", emoji: "👸", label: "Female" },
      { id: "male", emoji: "🧔‍♂️", label: "Male" },
    ],
  },
  {
    kind: "plain-single",
    progress: 6,
    total: QUIZ_TOTAL,
    question: "What is your age group?",
    subtitle:
      "This helps us adjust the pace and examples to your life stage.",
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
    kind: "subtle-single",
    progress: 7,
    total: QUIZ_TOTAL,
    question: "What is your native language?",
    options: [
      { id: "uk", emoji: "🇺🇦", label: "Ukrainian", native: "Українська" },
      { id: "es", emoji: "🇪🇸", label: "Spanish", native: "Español" },
      { id: "fr", emoji: "🇫🇷", label: "French", native: "Français" },
      { id: "de", emoji: "🇩🇪", label: "German", native: "Deutsch" },
      { id: "pl", emoji: "🇵🇱", label: "Polish", native: "Polski" },
      { id: "it", emoji: "🇮🇹", label: "Italian", native: "Italiano" },
      { id: "pt", emoji: "🇵🇹", label: "Portuguese", native: "Português" },
      { id: "hi", emoji: "🇮🇳", label: "Hindi", native: "हिन्दी" },
      { id: "ar", emoji: "🇸🇦", label: "Arabic", native: "العربية" },
      { id: "zh", emoji: "🇨🇳", label: "Chinese", native: "中文" },
      { id: "ja", emoji: "🇯🇵", label: "Japanese", native: "日本語" },
      { id: "ko", emoji: "🇰🇷", label: "Korean", native: "한국어" },
      { id: "tr", emoji: "🇹🇷", label: "Turkish", native: "Türkçe" },
      { id: "vi", emoji: "🇻🇳", label: "Vietnamese", native: "Tiếng Việt" },
      { id: "ru", emoji: "🇷🇺", label: "Russian", native: "Русский" },
      {
        id: "other-lang",
        emoji: "✍️",
        label: "Other",
        muted: true,
        allowCustomText: true,
      },
    ],
  },
  {
    kind: "plain-single",
    progress: 9,
    total: QUIZ_TOTAL,
    question: "How much time can you practice a day?",
    subtitle: "Even small daily practice works! ",
    options: [
      { id: "5", label: "5 minutes" },
      { id: "10", label: "10 minutes" },
      { id: "15", label: "15 minutes" },
      { id: "20", label: "20+ minutes" },
    ],
  },
  {
    kind: "title-single",
    progress: 10,
    total: QUIZ_TOTAL,
    question: "What kind of AI tutor would help you most?",
    options: [
      {
        id: "gentle",
        emoji: "🤝",
        title: "Gentle & supportive",
        description: "I need encouragement and patience",
      },
      {
        id: "direct",
        emoji: "😎",
        title: "Direct & challenging",
        description: "I want honest feedback and faster progress",
      },
      {
        id: "native",
        emoji: "🤠",
        title: "Native-like partner",
        description: "I want realistic conversations",
      },
      {
        id: "fun",
        emoji: "🥳",
        title: "Fun & casual buddy",
        description: "I want speaking to feel less serious",
      },
      {
        id: "explainer",
        emoji: "🤓",
        title: "Patient explainer",
        description: "I want slow, clear explanations when I get stuck",
      },
    ],
  },
];
