"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { quizAssets } from "./assets";
import {
  ButtonWrapper,
  Mascot,
  PrimaryButton,
  QuizStickyFooterSlot,
  SheetBlackButton,
  quizStickyScrollGapBottom,
} from "./ui";

/** Teaser / compare / referral — blue hero (beams on page) + title row + white sheet + black CTA. */
export function TeaserContinueScreen({
  hero,
  children,
  ctaLabel = "Continue",
  onContinue,
  sheetTopSpacing = "loose",
}: {
  hero: React.ReactNode;
  children: React.ReactNode;
  ctaLabel?: string;
  onContinue: () => void;
  /** Referral: tight gap after progress only (`153:4461`). */
  sheetTopSpacing?: "compact" | "loose";
}) {
  const sheetTop = sheetTopSpacing === "compact" ? "mt-2" : "mt-10";
  return (
    <>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-hidden">
        <div className="relative z-[1] flex shrink-0 flex-col gap-2">{hero}</div>
        <div
          className={`relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col ${sheetTop}`}
        >
          <div className="flex w-full shrink-0 justify-center px-10">
            <div className="h-4 w-full rounded-t-2xl bg-[#70cfff]" />
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-t-[32px] bg-white p-4">
            {children}
          </div>
        </div>
      </div>
      <QuizStickyFooterSlot />
      <ButtonWrapper>
        <SheetBlackButton onClick={onContinue}>{ctaLabel}</SheetBlackButton>
      </ButtonWrapper>
    </>
  );
}

export function SummaryLineScreen({
  headline,
  onContinue,
}: {
  headline: string;
  onContinue: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(onContinue, 2400);
    return () => window.clearTimeout(t);
  }, [onContinue]);

  return (
    <button
      type="button"
      className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-10"
      onClick={onContinue}
    >
      <p className="whitespace-pre-line text-center text-[28px] font-semibold leading-8 tracking-[-1.4px] text-white">
        {headline}
      </p>
    </button>
  );
}

const CALC_STEPS = [
  "Analyzing your blockers",
  "Adapting practice to your needs",
  "Building your daily speaking routine",
  "Matching your AI tutor style",
] as const;

export function CalculatingScreen({
  onComplete,
  progressBar,
}: {
  onComplete: () => void;
  progressBar: React.ReactNode;
}) {
  const [pct, setPct] = useState(12);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setPct((p) => (p >= 99 ? 99 : p + 3));
      setPhase((ph) => (ph < CALC_STEPS.length - 1 ? ph + 1 : ph));
    }, 420);
    const done = window.setTimeout(onComplete, 3200);
    return () => {
      window.clearInterval(t);
      window.clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto bg-white px-4 pb-8 pt-4">
      <div className="shrink-0">{progressBar}</div>
      <div className="flex flex-col items-center gap-6">
        <div className="relative size-[200px] shrink-0">
          <div className="absolute inset-0 rounded-full bg-[#ebeef5]" />
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#045495] to-[#05a8ff]"
            style={{
              maskImage: `conic-gradient(from -90deg, black ${pct}%, transparent 0)`,
              WebkitMaskImage: `conic-gradient(from -90deg, black ${pct}%, transparent 0)`,
            }}
          />
          <div className="absolute inset-0 flex items-end justify-center gap-0.5 pb-[52px] text-[#22262f]">
            <span className="text-[56px] font-semibold leading-none tracking-[-2.8px]">
              {Math.min(99, pct)}
            </span>
            <span className="mb-2 text-[28px] font-semibold leading-8 tracking-[-1.4px]">
              %
            </span>
          </div>
        </div>
        <p className="text-center text-[28px] font-semibold leading-8 tracking-[-1.4px] text-black">
          Preparing your plan
        </p>
        <ul className="flex w-full max-w-[293px] flex-col gap-3">
          {CALC_STEPS.map((label, i) => {
            const done = i < phase;
            const active = i === phase;
            return (
              <li
                key={label}
                className="flex items-center gap-2 text-left text-[16px] font-medium leading-4 tracking-[-0.32px] text-[#22262f]"
              >
                {done ? (
                  <span className="relative size-6 shrink-0 overflow-hidden">
                    <Image
                      src={quizAssets.figmaIconCheckGreen}
                      alt=""
                      width={24}
                      height={24}
                      className="size-full object-contain"
                    />
                  </span>
                ) : active ? (
                  <span className="relative size-6 shrink-0 rounded-full border-2 border-[#18c362] border-t-transparent animate-spin" />
                ) : (
                  <span className="size-6 shrink-0 rounded-full border-2 border-[#ebeef5]" />
                )}
                {label}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-auto flex flex-col items-center gap-4">
        <div className="w-full rounded-[20px] bg-[#f5f6fa] p-4">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="relative size-5 shrink-0 overflow-hidden">
                  <Image
                    src={quizAssets.star}
                    alt=""
                    fill
                    className="object-contain p-[8.33%]"
                    sizes="20px"
                  />
                </div>
              ))}
            </div>
            <span className="text-[16px] font-medium leading-4 tracking-[-0.32px] text-[#7a8399]">
              Marta S.
            </span>
          </div>
          <p className="text-[0px] leading-[22px] text-[#22262f]">
            <span className="text-[16px] font-normal tracking-[-0.128px]">
              I used to understand English but{" "}
            </span>
            <span className="text-[16px] font-semibold leading-[18px] tracking-[-0.32px]">
              freeze when I had to speak
            </span>
            <span className="text-[16px] font-normal tracking-[-0.128px]">
              . Short daily conversations helped me{" "}
            </span>
            <span className="text-[16px] font-semibold leading-[18px] tracking-[-0.32px]">
              answer faster and feel less awkward
            </span>
            <span className="text-[16px] font-normal tracking-[-0.128px]">
              , even when I made mistakes.
            </span>
          </p>
        </div>
        <div className="relative h-2 w-9 shrink-0">
          <Image
            src={quizAssets.figmaCalcPaginationDots}
            alt=""
            width={36}
            height={8}
            className="size-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export function EmailCaptureScreen({
  value,
  onChange,
  onContinue,
  progressBar,
}: {
  value: string;
  onChange: (v: string) => void;
  onContinue: () => void;
  progressBar: React.ReactNode;
}) {
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  return (
    <>
      <div
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto bg-white px-4 ${quizStickyScrollGapBottom} pt-4`}
      >
        <div className="shrink-0">{progressBar}</div>
        <div className="flex flex-col items-center gap-8 pt-10">
          <Mascot />
          <div className="flex w-full max-w-[361px] flex-col gap-6">
            <div className="flex flex-col gap-4 text-center">
              <p className="whitespace-pre-line text-[28px] font-semibold leading-8 tracking-[-1.4px] text-[#22262f]">
                What&apos;s your email to{"\n"}send the plan?
              </p>
              <p className="text-[16px] font-normal leading-[22px] tracking-[-0.128px] text-[#464e62]">
                Enter your email to save your results and get early access to
                your AI speaking plan.
              </p>
            </div>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="mx-auto h-14 w-full max-w-[280px] rounded-2xl border border-[#ebeef5] bg-white px-4 text-[16px] text-[#22262f] outline-none ring-0 placeholder:text-[#7a8399] focus:border-[#05a8ff]"
            />
            <p className="mx-auto max-w-[280px] text-center text-[12px] font-normal leading-[18px] tracking-[-0.096px] text-[#7a8399]">
              By continuing, you agree to our Terms of Use and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
      <QuizStickyFooterSlot />
      <ButtonWrapper>
        <PrimaryButton disabled={!valid} onClick={onContinue}>
          Continue
        </PrimaryButton>
      </ButtonWrapper>
    </>
  );
}

function PeopleTeaserBody({ body }: { body?: string }) {
  if (!body) return null;
  const lead = "Aged 35-44";
  if (body.startsWith(lead)) {
    return (
      <p className="text-[16px] font-normal leading-[22px] tracking-[-0.128px] text-[#22262f]">
        <span className="font-semibold">{lead}</span>
        {body.slice(lead.length)}
      </p>
    );
  }
  return (
    <p className="text-[16px] font-normal leading-[22px] tracking-[-0.128px] text-[#22262f]">
      {body}
    </p>
  );
}

/** Figma `121:2996` — map raster + stats row + avatars. */
export function TeaserPeopleContent({ body }: { body?: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative h-[240px] w-full overflow-hidden rounded-2xl border border-[#ebeef5] bg-[#f5f6fa]">
        <Image
          src={quizAssets.figmaTeaserPeopleMap}
          alt=""
          fill
          className="object-cover object-center"
          sizes="361px"
          priority
        />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-end gap-2">
            <span className="text-[56px] font-semibold leading-none tracking-[-2.8px] text-[#22262f]">
              45k
            </span>
            <span className="pb-1 text-[32px] font-semibold leading-8 tracking-[-1.6px] text-[#22262f]">
              learners
            </span>
          </div>
          <div className="flex shrink-0 -space-x-2">
            <div className="relative z-[3] size-10 overflow-hidden rounded-full border-2 border-white bg-[#ebeef5]">
              <Image
                src={quizAssets.figmaAvatar1}
                alt=""
                width={40}
                height={40}
                className="size-full object-cover"
              />
            </div>
            <div className="relative z-[2] size-10 overflow-hidden rounded-full border-2 border-white bg-[#ebeef5]">
              <Image
                src={quizAssets.figmaAvatar2}
                alt=""
                width={40}
                height={40}
                className="size-full object-cover"
              />
            </div>
            <div className="relative z-[1] size-10 overflow-hidden rounded-full border-2 border-white bg-[#ebeef5]">
              <Image
                src={quizAssets.figmaAvatar3}
                alt=""
                width={40}
                height={40}
                className="size-full object-cover"
              />
            </div>
          </div>
        </div>
        <PeopleTeaserBody body={body} />
      </div>
    </div>
  );
}

function BookNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full gap-1.5">
      <svg
        className="mt-px size-5 shrink-0 text-[#7a8399]"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.23 1.76C4.55 1.85 4.19 2.01 3.94 2.26C3.68 2.51 3.52 2.86 3.43 3.52C3.33 4.2 3.33 5.1 3.33 6.4V13.54C3.66 13.31 4.03 13.15 4.42 13.04C4.86 12.93 5.37 12.93 6.12 12.93H16.67V6.4C16.67 5.1 16.66 4.2 16.56 3.52C16.47 2.86 16.31 2.51 16.06 2.26C15.8 2.01 15.45 1.85 14.77 1.76C14.08 1.66 13.16 1.66 11.84 1.66H8.16C6.84 1.66 5.92 1.66 5.23 1.76ZM5.63 5.5C5.63 5.12 5.94 4.82 6.32 4.82H13.68C13.86 4.82 14.03 4.89 14.16 5.02C14.28 5.14 14.35 5.31 14.35 5.49C14.35 5.68 14.28 5.85 14.15 5.98C14.03 6.1 13.86 6.17 13.68 6.17H6.32C6.14 6.17 5.97 6.1 5.85 5.98C5.72 5.85 5.63 5.68 5.63 5.5ZM6.32 7.97C6.14 7.97 5.97 8.04 5.85 8.16C5.72 8.29 5.63 8.46 5.63 8.64C5.63 9.02 5.94 9.32 6.32 9.32H10.92C11.1 9.32 11.27 9.25 11.4 9.13C11.53 9 11.61 8.83 11.61 8.65C11.61 8.46 11.53 8.29 11.4 8.16C11.27 8.04 11.1 7.97 10.92 7.97H6.32Z"
          fill="currentColor"
        />
        <path
          d="M6.23 14.28H16.67C16.66 15.22 16.65 15.92 16.56 16.46C16.47 17.12 16.31 17.47 16.06 17.72C15.8 17.97 15.45 18.13 14.77 18.22C14.08 18.32 13.16 18.32 11.84 18.32H8.16C6.84 18.32 5.92 18.32 5.23 18.22C4.55 18.13 4.19 17.97 3.94 17.72C3.68 17.47 3.52 17.12 3.43 16.46C3.4 16.2 3.37 15.95 3.35 15.63C3.47 15.32 3.66 15.04 3.91 14.81C4.16 14.58 4.45 14.41 4.77 14.33C5.01 14.27 5.28 14.28 6.23 14.28Z"
          fill="currentColor"
        />
      </svg>
      <p className="min-w-0 flex-1 text-[14px] font-normal leading-[18px] tracking-[-0.112px] text-[#7a8399]">
        {children}
      </p>
    </div>
  );
}

/** Figma `99:1895` — green “Why Bravel works” + loop art + {@link Mascot} (animated eyes). */
export function TeaserLoopContent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-[#18c362] pt-2">
        <p className="pb-2 text-center text-[16px] font-semibold leading-[18px] tracking-[-0.32px] text-white">
          Why Bravel works
        </p>
        <div className="relative h-[278px] w-full overflow-hidden rounded-2xl border border-[#ebeef5] bg-[#f3fef6]">
          <Image
            src={quizAssets.figmaTeaserLoopIllustration}
            alt=""
            fill
            className="object-cover object-center"
            sizes="361px"
            priority
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2">
            <Mascot />
          </div>
        </div>
      </div>
      <BookNote>Based on Pearson English Impact research, 2024</BookNote>
      <div className="flex flex-col gap-3">
        <p className="text-[28px] font-semibold leading-8 tracking-[-1.4px] text-[#22262f]">
          It&apos;s more common than you think!
        </p>
        <p className="text-[0px] leading-[22px] text-[#464e62]">
          <span className="text-[16px] font-normal tracking-[-0.128px]">
            Many learners{" "}
          </span>
          <span className="text-[16px] font-semibold leading-[18px] tracking-[-0.32px] text-[#464e62]">
            understand English better than they can speak
          </span>
          <span className="text-[16px] font-normal tracking-[-0.128px]">
            {" "}
            it. The good news? This gap can be fixed with the right kind of
            practice.
          </span>
        </p>
      </div>
    </div>
  );
}

/** Figma `121:2632` — chart illustration + note + copy. */
export function TeaserRememberContent({
  title,
  body,
}: {
  title: string;
  body?: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="relative h-[278px] w-full overflow-hidden rounded-2xl border border-[#ebeef5] bg-white">
        <Image
          src={quizAssets.figmaTeaserRememberIllustration}
          alt=""
          fill
          className="object-contain object-center"
          sizes="361px"
        />
      </div>
      <BookNote>
        Bravel conversations train active recall in real time.
      </BookNote>
      <div className="flex flex-col gap-3">
        <p className="text-[28px] font-semibold leading-8 tracking-[-1.4px] text-[#22262f]">
          {title}
        </p>
        {body ? (
          <p className="text-[16px] font-normal leading-[22px] tracking-[-0.128px] text-[#464e62]">
            {body}
          </p>
        ) : null}
      </div>
    </div>
  );
}

type TableRow = {
  label: string;
  human: string;
  ai: string;
  humanBars: [boolean, boolean, boolean, boolean];
  aiBars: [boolean, boolean, boolean, boolean];
};

const TABLE_ROWS: TableRow[] = [
  {
    label: "Availability",
    human: "Office hours",
    ai: "24/7 access",
    humanBars: [true, false, false, false],
    aiBars: [true, true, true, true],
  },
  {
    label: "Personalization",
    human: "Generic lessons",
    ai: "Real-life topics",
    humanBars: [true, false, false, false],
    aiBars: [true, true, true, false],
  },
  {
    label: "Cost",
    human: "Expensive 💵 💵 💵",
    ai: "Affordable 💵",
    humanBars: [false, false, false, false],
    aiBars: [false, false, false, false],
  },
  {
    label: "Feedback",
    human: "After class",
    ai: "Instant",
    humanBars: [false, false, false, false],
    aiBars: [false, false, false, false],
  },
  {
    label: "Comfort",
    human: "Human warmth",
    ai: "Judgment-free",
    humanBars: [false, false, false, false],
    aiBars: [false, false, false, false],
  },
];

function BarRow({
  filled,
  color,
}: {
  filled: [boolean, boolean, boolean, boolean];
  color: "red" | "green";
}) {
  const on = color === "red" ? "bg-[#ee5542]" : "bg-[#18c362]";
  const off = "bg-[#d0d5e1]";
  return (
    <div className="flex h-2 gap-1">
      {filled.map((f, i) => (
        <div
          key={i}
          className={`h-full min-w-0 flex-1 rounded-full ${f ? on : off}`}
        />
      ))}
    </div>
  );
}

/** Figma `150:3931` — comparison table + black CTA label. */
export function TeaserTableContent({ body }: { body?: string }) {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-3">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-hidden rounded-2xl bg-[#ebeef5] px-2 pb-5 pt-2">
          <div className="rounded-xl bg-white p-3">
            <p className="text-center text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-black">
              Human tutor
            </p>
          </div>
          <div className="flex flex-col gap-5 px-2">
            {TABLE_ROWS.map((row) => (
              <div key={row.label} className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] font-medium leading-[14px] tracking-[-0.28px] text-[#7a8399]">
                    {row.label}
                  </p>
                  <p className="text-[16px] font-semibold leading-[18px] tracking-[-0.32px] text-[#22262f]">
                    {row.human}
                  </p>
                </div>
                {row.humanBars.some(Boolean) ? (
                  <BarRow filled={row.humanBars} color="red" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 overflow-hidden rounded-2xl bg-[#c8f9d6] px-2 pb-5 pt-2">
          <div className="rounded-xl bg-white p-3">
            <p className="text-center text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-black">
              AI tutor 🔥
            </p>
          </div>
          <div className="flex flex-col gap-5 px-2">
            {TABLE_ROWS.map((row) => (
              <div key={`ai-${row.label}`} className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] font-medium leading-[14px] tracking-[-0.28px] text-[#7a8399]">
                    {row.label}
                  </p>
                  <p className="text-[16px] font-semibold leading-[18px] tracking-[-0.32px] text-black">
                    {row.ai}
                  </p>
                </div>
                {row.aiBars.some(Boolean) ? (
                  <BarRow filled={row.aiBars} color="green" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
      {body ? (
        <p className="text-[16px] font-normal leading-[22px] tracking-[-0.128px] text-[#464e62]">
          {body}
        </p>
      ) : null}
    </div>
  );
}

/** Figma `153:4461` ScreenReferral — sheet copy + cards + “Copy invite link”. */
export function ReferralScreen({
  onCopyInvite,
  hero,
}: {
  onCopyInvite: () => void;
  hero: React.ReactNode;
}) {
  return (
    <TeaserContinueScreen
      hero={hero}
      ctaLabel="Copy invite link"
      onContinue={onCopyInvite}
      sheetTopSpacing="compact"
    >
      <div className="flex flex-col gap-6 pb-2 pt-2">
        <div className="flex flex-col gap-3 text-left">
          <p className="text-[28px] font-semibold leading-8 tracking-[-1.4px] text-[#22262f]">
            You&apos;re on the waitlist 🫶
          </p>
          <p className="text-[0px] leading-[22px] tracking-[-0.128px] text-[#464e62]">
            <span className="text-[16px] font-normal">
              We&apos;ll email you when your AI speaking plan is ready. As a
              thank you, you&apos;ll get{" "}
            </span>
            <span className="text-[16px] font-semibold leading-[18px] tracking-[-0.32px]">
              a free English assessment
            </span>
            <span className="text-[16px] font-normal"> when beta opens.</span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-b from-[#ffe09c] to-[#fecf67] px-4 pb-5 pt-4">
            <div className="flex items-start justify-between gap-2">
              <div className="rounded-xl bg-white/50 p-3">
                <span className="text-[24px] leading-none">💝</span>
              </div>
              <span className="rounded-lg border border-[#ebeef5] bg-white px-2 py-2 text-[14px] font-medium leading-[14px] tracking-[-0.28px] text-[#464e62]">
                Included
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-[#22262f]">
                Free English assessment
              </p>
              <ul className="flex flex-col gap-2 text-[16px] font-normal leading-[22px] tracking-[-0.128px] text-[#464e62]">
                <li className="flex items-center gap-2">
                  <Image
                    src={quizAssets.figmaIconCheckGreen}
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0"
                  />
                  Grammar
                </li>
                <li className="flex items-center gap-2">
                  <Image
                    src={quizAssets.figmaIconCheckGreen}
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0"
                  />
                  Vocabulary
                </li>
                <li className="flex items-center gap-2">
                  <Image
                    src={quizAssets.figmaIconCheckGreen}
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0"
                  />
                  Accent
                </li>
              </ul>
            </div>
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-dashed border-[#d0d5e1] bg-[#ebeef5] px-4 pb-5 pt-4">
            <div className="flex items-start justify-between gap-2">
              <div className="rounded-xl bg-white/50 p-3">
                <span className="text-[24px] leading-none">🔥</span>
              </div>
              <span className="rounded-lg border border-[#d0d5e1] bg-white px-2 py-2 text-[14px] font-medium leading-[14px] tracking-[-0.28px] text-[#464e62]">
                Offer
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-[#22262f]">
                Invite a friend to get Free 1-month Premium subscription
              </p>
              <p className="text-[16px] font-normal leading-[22px] tracking-[-0.128px] text-[#464e62]">
                For you and your friend 😉
              </p>
            </div>
          </div>
        </div>
      </div>
    </TeaserContinueScreen>
  );
}
