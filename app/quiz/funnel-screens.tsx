"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { quizAssets } from "./assets";
import {
  SUMMARY_HEADLINE_FLUENT,
  SUMMARY_HEADLINE_MINUTES,
  SUMMARY_HEADLINE_PERSONALIZED,
} from "./steps";
import {
  ButtonWrapper,
  Mascot,
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
  ctaSuccessActive = false,
  ctaSuccessLabel = "Link copied",
  showTopCap = false,
}: {
  hero: React.ReactNode;
  children: React.ReactNode;
  ctaLabel?: string;
  onContinue: () => void;
  /** Referral: show success CTA after copy. */
  ctaSuccessActive?: boolean;
  ctaSuccessLabel?: string;
  /** Referral: tight gap after progress only (`153:4461`). */
  sheetTopSpacing?: "compact" | "loose";
  /** Small cyan cap above the white sheet. */
  showTopCap?: boolean;
}) {
  /** Space between blue hero and white sheet — loose 24px (`gap-6`), compact 16px (`gap-4`). */
  const heroSheetGap =
    sheetTopSpacing === "compact" ? "gap-4" : "gap-6";
  return (
    <div
      className={`flex min-h-0 min-w-0 flex-1 flex-col ${heroSheetGap} overflow-x-hidden overflow-y-hidden`}
    >
      <div className="relative z-[1] flex shrink-0 flex-col gap-2">{hero}</div>
      <div className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col">
        {showTopCap ? (
          <div className="flex w-full shrink-0 justify-center px-10">
            <div className="h-4 w-full rounded-t-2xl bg-[#70cfff]" />
          </div>
        ) : null}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-t-[32px] bg-white">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
            <div className="flex min-h-full min-w-0 flex-col">
              <div className="flex w-full flex-1 flex-col p-4">{children}</div>
              <div
                className="sticky bottom-0 z-10 shrink-0 px-4 pt-3"
                style={{
                  paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))",
                }}
              >
                <SheetBlackButton
                  onClick={onContinue}
                  tone={ctaSuccessActive ? "success" : "default"}
                >
                  {ctaSuccessActive ? ctaSuccessLabel : ctaLabel}
                </SheetBlackButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SUMMARY_ACCENT_GREEN = "text-[#67E997]";

/** Option labels use “More natural”, etc.; summary line uses sentence-style “more”. */
function formatEnglishFeelForSummary(title: string): string {
  return title.replace(/^More\b/, "more");
}

export function SummaryLineScreen({
  headline,
  englishFeelTitle,
  practiceTimeLabel,
  onContinue,
}: {
  headline: string;
  /** From “What would you like your English to feel like?” — shown on fluent summary line. */
  englishFeelTitle?: string | null;
  /** From “How much time can you practice a day?” — shown on minutes summary line. */
  practiceTimeLabel?: string | null;
  onContinue: () => void;
}) {
  useEffect(() => {
    const t = window.setTimeout(onContinue, 2400);
    return () => window.clearTimeout(t);
  }, [onContinue]);

  let body: ReactNode = headline;
  if (headline === SUMMARY_HEADLINE_PERSONALIZED) {
    body = (
      <>
        we’ve created a{" "}
        <span className={SUMMARY_ACCENT_GREEN}>personalized plan</span>
      </>
    );
  } else if (headline === SUMMARY_HEADLINE_FLUENT) {
    body = (
      <>
        designed to help your English become{" "}
        <span className={SUMMARY_ACCENT_GREEN}>
          {englishFeelTitle
            ? formatEnglishFeelForSummary(englishFeelTitle)
            : "more fluent"}
        </span>
      </>
    );
  } else if (headline === SUMMARY_HEADLINE_MINUTES) {
    body = (
      <>
        in just{"\n"}
        <span className={SUMMARY_ACCENT_GREEN}>
          {practiceTimeLabel ?? "5 minutes"}
        </span>{" "}
        a day
      </>
    );
  }

  return (
    <button
      type="button"
      className="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-10"
      onClick={onContinue}
    >
      <p className="whitespace-pre-line text-center text-[40px] font-semibold leading-[40px] tracking-[-2px] text-white">
        {body}
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

const CALC_RING_R = 90;
const CALC_RING_C = 2 * Math.PI * CALC_RING_R;

/** Full run length; each checklist row advances every {@link CALC_STEP_MS}. */
const CALC_DURATION_MS = 16_000;
const CALC_STEP_MS = 4_000;
/** Testimonial carousel — three reviews, advance every 5s (independent of ring progress). */
const CALC_REVIEW_ROTATE_MS = 5_000;
const CALC_REVIEW_SWIPE_PX = 48;

/** Brand-adjacent + festive mix for calculating completion burst */
const CONFETTI_PALETTE = [
  "#05A8FF",
  "#057CCC",
  "#18c362",
  "#67E997",
  "#FECF67",
  "#FFE09C",
  "#EE5542",
  "#70cFFF",
  "#403dCA",
  "#FFFFFF",
] as const;

const CONFETTI_BURST_MS = 1_050;
/** After 100%, wait for confetti to play before `onComplete` navigates away (otherwise the screen unmounts instantly). */
const CONFETTI_NAV_BUFFER_MS = 50;
const CONFETTI_COUNT = 46;

function createConfettiPieces() {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => {
    const hueSlot = CONFETTI_PALETTE[
      Math.floor(Math.random() * CONFETTI_PALETTE.length)
    ];
    /** Radial-ish fan from upper-mid viewport (percentage origin) */
    const angle = (Math.random() - 0.4) * Math.PI * 0.95;
    const speed = 120 + Math.random() * 240;
    const dx = `${Math.round(Math.cos(angle) * speed)}px`;
    const dy = `${Math.round(-Math.abs(Math.sin(angle)) * speed * 1.15 - Math.random() * 80)}px`;
    const left = `${18 + Math.random() * 64}%`;
    const top = `${28 + Math.random() * 22}%`;
    const w = 5 + Math.random() * 7;
    const h = w * (0.55 + Math.random() * 0.9);
    const rot = `${Math.round((Math.random() - 0.5) * 1080)}deg`;
    const delay = `${(Math.random() * 120).toFixed(0)}ms`;
    const dur = `${850 + Math.random() * 280}ms`;
    const scaleY = `${0.5 + Math.random() * 0.8}`;
    const isRound = Math.random() > 0.72;
    return {
      key: i,
      style: {
        "--qz-cf-dx": dx,
        "--qz-cf-dy": dy,
        "--qz-cf-rot": rot,
        "--qz-cf-delay": delay,
        "--qz-cf-dur": dur,
        "--qz-cf-left": left,
        "--qz-cf-top": top,
        "--qz-cf-w": `${w}px`,
        "--qz-cf-h": `${h}px`,
        "--qz-cf-ml": `${-w / 2}px`,
        "--qz-cf-mt": `${-h / 2}px`,
        "--qz-cf-color": hueSlot,
        "--qz-cf-scale": isRound ? `${0.9 + Math.random() * 0.4}` : `1`,
        "--qz-cf-scale-y": scaleY,
        borderRadius: isRound ? "50%" : "2px",
      } as React.CSSProperties,
    };
  });
}

function CalculatingConfettiBurst({ onConsumed }: { onConsumed: () => void }) {
  const pieces = useMemo(() => createConfettiPieces(), []);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  useLayoutEffect(() => {
    setPortalEl(document.body);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(onConsumed, CONFETTI_BURST_MS);
    return () => window.clearTimeout(t);
  }, [onConsumed]);

  const overlay = (
    <div
      className="quiz-calculating-confetti-overlay pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
      aria-hidden
    >
      {pieces.map(({ key, style }) => (
        <div key={key} className="quiz-confetti-piece" style={style} />
      ))}
    </div>
  );

  if (!portalEl) return null;
  return createPortal(overlay, portalEl);
}

export function CalculatingScreen({
  onComplete,
  progressBar,
  stayOnScreen = false,
}: {
  onComplete: () => void;
  progressBar: React.ReactNode;
  /** When true, progress runs but the screen never calls `onComplete` (e.g. `?loading=stay` on `/quiz`). */
  stayOnScreen?: boolean;
}) {
  const ringGradId = useId().replace(/:/g, "");
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState(0);
  const [confettiBurst, setConfettiBurst] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  /** 1 = next (enter from right), -1 = previous (enter from left). */
  const [reviewSlideSign, setReviewSlideSign] = useState(1);
  const reviewRotateTimerRef = useRef<number | null>(null);
  const reviewSwipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const completionCelebrationPlayedRef = useRef(false);

  const dismissCalculatingConfetti = useCallback(() => {
    setConfettiBurst(false);
  }, []);

  const restartReviewRotation = useCallback(() => {
    if (reviewRotateTimerRef.current !== null) {
      clearInterval(reviewRotateTimerRef.current);
    }
    reviewRotateTimerRef.current = window.setInterval(() => {
      setReviewSlideSign(1);
      setReviewIdx((i) => (i + 1) % 3);
    }, CALC_REVIEW_ROTATE_MS) as number;
  }, []);

  useEffect(() => {
    restartReviewRotation();
    return () => {
      if (reviewRotateTimerRef.current !== null) {
        clearInterval(reviewRotateTimerRef.current);
      }
    };
  }, [restartReviewRotation]);

  const calcRafRef = useRef(0);

  useEffect(() => {
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed >= CALC_DURATION_MS) {
        setPct(100);
        setPhase(CALC_STEPS.length);
        return;
      }
      setPct((elapsed / CALC_DURATION_MS) * 100);
      setPhase(Math.min(CALC_STEPS.length, Math.floor(elapsed / CALC_STEP_MS)));
      calcRafRef.current = requestAnimationFrame(tick);
    };

    calcRafRef.current = requestAnimationFrame(tick);

    const done = stayOnScreen
      ? undefined
      : window.setTimeout(
          onComplete,
          CALC_DURATION_MS + CONFETTI_BURST_MS + CONFETTI_NAV_BUFFER_MS,
        );

    return () => {
      cancelAnimationFrame(calcRafRef.current);
      if (done !== undefined) window.clearTimeout(done);
    };
  }, [onComplete, stayOnScreen]);

  /*
   * `stayOnScreen` (?loading=stay): still run the burst at 100% — milestone matches prod UX;
   * the screen intentionally does not navigate, but testers get the same celebration cue.
   * Reduced motion hides the overlay in globals.css.
   */
  useEffect(() => {
    if (pct < 100 || completionCelebrationPlayedRef.current) return;
    completionCelebrationPlayedRef.current = true;
    setConfettiBurst(true);
  }, [pct]);

  const handleReviewPointerDown = (e: React.PointerEvent) => {
    reviewSwipeStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleReviewPointerUp = (e: React.PointerEvent) => {
    const start = reviewSwipeStartRef.current;
    reviewSwipeStartRef.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (
      Math.abs(dx) < CALC_REVIEW_SWIPE_PX ||
      Math.abs(dx) < Math.abs(dy)
    ) {
      return;
    }
    if (dx < 0) {
      setReviewSlideSign(1);
      setReviewIdx((i) => (i + 1) % 3);
    } else {
      setReviewSlideSign(-1);
      setReviewIdx((i) => (i + 2) % 3);
    }
    restartReviewRotation();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white px-4 pb-4 pt-4">
      <div className="flex shrink-0 flex-col">
        <div className="shrink-0">{progressBar}</div>
        <div className="flex flex-col items-center gap-6">
          <div className="relative size-[184px] shrink-0">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 block size-full"
            aria-hidden
          >
            <path
              d="M200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0C155.228 0 200 44.7715 200 100ZM20 100C20 144.183 55.8172 180 100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100Z"
              fill="#F5F6FA"
            />
          </svg>
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 block size-full"
            aria-hidden
          >
            <defs>
              <linearGradient
                id={ringGradId}
                x1="100"
                y1="20"
                x2="100"
                y2="180"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#05A8FF" />
                <stop offset="1" stopColor="#057CCC" />
              </linearGradient>
            </defs>
            <g transform="rotate(-90 100 100)">
              <circle
                cx="100"
                cy="100"
                r={CALC_RING_R}
                fill="none"
                stroke={`url(#${ringGradId})`}
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={CALC_RING_C}
                strokeDashoffset={CALC_RING_C * (1 - Math.min(100, pct) / 100)}
              />
            </g>
          </svg>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-0.5 text-[#22262f]">
            <span className="text-[50px] font-semibold leading-none tracking-[-2.52px] tabular-nums">
              {Math.round(Math.min(100, pct))}
            </span>
            <span className="pt-1 text-[25px] font-semibold leading-none tracking-[-1.26px]">
              %
            </span>
          </div>
        </div>
        <p className="text-center text-[28px] font-semibold leading-8 tracking-[-1.4px] text-black">
          Preparing your plan
        </p>
        <ul className="flex w-full max-w-[329px] flex-col gap-3">
          {CALC_STEPS.map((label, i) => {
            const done = i < phase;
            const active = i === phase && phase < CALC_STEPS.length;
            const pending = !done && !active;
            return (
              <li
                key={label}
                className="flex flex-nowrap items-center gap-2 overflow-hidden text-left text-[16px] font-medium leading-5 tracking-[-0.32px] text-[#22262f]"
              >
                <div className="relative size-6 shrink-0">
                  <span
                    aria-hidden
                    className={`absolute inset-0 rounded-full border-[3px] border-[#ebeef5] transition-opacity duration-300 ease-out ${
                      pending ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span
                    aria-hidden
                    className={`quiz-calc-step-spinner absolute inset-0 rounded-full border-[3px] border-[#18c362] border-t-transparent transition-opacity duration-300 ease-out ${
                      active ? "animate-spin opacity-100" : "opacity-0"
                    }`}
                  />
                  <span
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-out ${
                      done
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                    }`}
                  >
                    <Image
                      src={quizAssets.figmaIconCheckGreen}
                      alt=""
                      width={24}
                      height={24}
                      className={`size-full object-contain ${
                        done ? "quiz-calc-check-reveal" : ""
                      }`}
                    />
                  </span>
                </div>
                <span className="min-w-0 truncate whitespace-nowrap">
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
        </div>
      </div>
      <div className="mt-auto flex flex-col items-center gap-4 pt-6">
        <div
          className="flex h-[180px] w-full touch-pan-y select-none flex-col overflow-hidden rounded-[20px] bg-[#f5f6fa] p-4"
          role="region"
          aria-label="Reviews. Swipe left or right to change."
          onPointerDown={handleReviewPointerDown}
          onPointerUp={handleReviewPointerUp}
          onPointerCancel={() => {
            reviewSwipeStartRef.current = null;
          }}
        >
          <div
            key={reviewIdx}
            className="quiz-calc-review-enter flex min-h-0 flex-1 flex-col items-stretch"
            style={
              {
                "--quiz-review-slide": `${reviewSlideSign * 20}px`,
              } as React.CSSProperties
            }
          >
            <div className="mb-4 flex shrink-0 items-center justify-between gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative size-5 shrink-0 overflow-hidden"
                  >
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
                {reviewIdx === 0
                  ? "Marta S."
                  : reviewIdx === 1
                    ? "Alex P."
                    : "Daniel K."}
              </span>
            </div>
            {reviewIdx === 0 ? (
              <p className="text-left text-[16px] leading-[22px] text-[#22262f]">
                <span className="font-normal tracking-[-0.128px]">
                  I used to understand English but{" "}
                </span>
                <span className="font-semibold leading-[18px] tracking-[-0.32px]">
                  freeze when I had to speak
                </span>
                <span className="font-normal tracking-[-0.128px]">
                  . Short daily conversations helped me{" "}
                </span>
                <span className="font-semibold leading-[18px] tracking-[-0.32px]">
                  answer faster and feel less awkward
                </span>
                <span className="font-normal tracking-[-0.128px]">
                  , even when I made mistakes.
                </span>
              </p>
            ) : reviewIdx === 1 ? (
              <p className="text-left text-[16px] leading-[22px] text-[#22262f]">
                <span className="font-normal tracking-[-0.128px]">
                  It feels like practicing with someone who never judges you.{" "}
                </span>
                <span className="font-semibold leading-[18px] tracking-[-0.32px]">
                  I can repeat the same conversation, get feedback, and finally
                  use words I already knew.
                </span>
              </p>
            ) : (
              <p className="text-left text-[16px] leading-[22px] text-[#22262f]">
                <span className="font-normal tracking-[-0.128px]">
                  I didn&apos;t need more grammar rules,{" "}
                </span>
                <span className="font-semibold leading-[18px] tracking-[-0.32px]">
                  I needed a safe place to actually speak.
                </span>
                <span className="font-normal tracking-[-0.128px]">
                  {" "}
                  The short AI conversations made it easier to stop overthinking
                  and answer out loud.
                </span>
              </p>
            )}
          </div>
        </div>
        <div
          className="flex shrink-0 gap-1.5"
          role="tablist"
          aria-label="Reviews"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              role="presentation"
              className={`h-2 w-2 rounded-full transition-colors ${
                reviewIdx === i ? "bg-[#22262f]" : "bg-[#ebeef5]"
              }`}
            />
          ))}
        </div>
      </div>
      {confettiBurst ? (
        <CalculatingConfettiBurst onConsumed={dismissCalculatingConfetti} />
      ) : null}
    </div>
  );
}

const EMAIL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "icloud.com",
  "hotmail.com",
] as const;

function emailDomainSuggestions(raw: string): string[] {
  const v = raw.trim();
  if (!v) return [];
  const at = v.indexOf("@");
  if (at === -1) {
    return EMAIL_DOMAINS.map((d) => `${v}@${d}`);
  }
  const local = v.slice(0, at);
  const rest = v.slice(at + 1).toLowerCase();
  if (!local) return [];
  return EMAIL_DOMAINS.filter((d) => d.startsWith(rest)).map(
    (d) => `${local}@${d}`,
  );
}

const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getEmailErrorMessage(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  if (EMAIL_OK.test(v)) return null;
  if (!v.includes("@")) {
    return "Add an @ symbol (e.g. you@email.com).";
  }
  const at = v.indexOf("@");
  const local = v.slice(0, at);
  const domain = v.slice(at + 1).trim();
  if (!local) return "Enter the part before @.";
  if (!domain) return "Enter a domain after @.";
  if (/\s/.test(v)) return "Remove spaces from your email.";
  if (!domain.includes(".")) {
    return "Use a domain with an ending like .com or .net.";
  }
  return "Enter a valid email address.";
}

function EmailFieldValidIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12ZM16.03 8.97C16.1705 9.11063 16.2493 9.30125 16.2493 9.5C16.2493 9.69875 16.1705 9.88937 16.03 10.03L11.03 15.03C10.8894 15.1705 10.6988 15.2493 10.5 15.2493C10.3012 15.2493 10.1106 15.1705 9.97 15.03L7.97 13.03C7.89631 12.9613 7.83721 12.8785 7.79622 12.7865C7.75523 12.6945 7.73319 12.5952 7.73141 12.4945C7.72963 12.3938 7.74816 12.2938 7.78588 12.2004C7.8236 12.107 7.87974 12.0222 7.95096 11.951C8.02218 11.8797 8.10701 11.8236 8.2004 11.7859C8.29379 11.7482 8.39382 11.7296 8.49452 11.7314C8.59522 11.7332 8.69454 11.7552 8.78654 11.7962C8.87854 11.8372 8.96134 11.8963 9.03 11.97L10.5 13.44L12.735 11.205L14.97 8.97C15.1106 8.82955 15.3012 8.75066 15.5 8.75066C15.6988 8.75066 15.8894 8.82955 16.03 8.97Z"
        fill="#18C362"
      />
    </svg>
  );
}

function EmailFieldInvalidIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12ZM8.97 8.97C9.11063 8.82955 9.30125 8.75066 9.5 8.75066C9.69875 8.75066 9.88937 8.82955 10.03 8.97L12 10.94L13.97 8.97C14.1122 8.83752 14.3002 8.7654 14.4945 8.76882C14.6888 8.77225 14.8742 8.85097 15.0116 8.98838C15.149 9.12579 15.2277 9.31118 15.2312 9.50548C15.2346 9.69978 15.1625 9.88783 15.03 10.03L13.06 12L15.03 13.97C15.1625 14.1122 15.2346 14.3002 15.2312 14.4945C15.2277 14.6888 15.149 14.8742 15.0116 15.0116C14.8742 15.149 14.6888 15.2277 14.4945 15.2312C14.3002 15.2346 14.1122 15.1625 13.97 15.03L12 13.06L10.03 15.03C9.88783 15.1625 9.69978 15.2346 9.50548 15.2312C9.31118 15.2277 9.12579 15.149 8.98838 15.0116C8.85097 14.8742 8.77225 14.6888 8.76882 14.4945C8.7654 14.3002 8.83752 14.1122 8.97 13.97L10.94 12L8.97 10.03C8.82955 9.88937 8.75066 9.69875 8.75066 9.5C8.75066 9.30125 8.82955 9.11063 8.97 8.97Z"
        fill="#EE5542"
      />
    </svg>
  );
}

export function EmailCaptureScreen({
  value,
  onChange,
  onContinue,
  answers,
  progressBar,
}: {
  value: string;
  onChange: (v: string) => void;
  onContinue: () => void;
  answers?: unknown;
  progressBar: React.ReactNode;
}) {
  const trimmed = value.trim();
  const valid = EMAIL_OK.test(trimmed);
  const listboxId = useId();
  const errorId = useId();
  const [focused, setFocused] = useState(false);
  /** Invalid styling / message only after blur or Enter — cleared on focus so typing isn’t nagged. */
  const [revealInvalidEmail, setRevealInvalidEmail] = useState(false);

  const suggestions = useMemo(() => emailDomainSuggestions(value), [value]);
  const showSuggestions =
    focused &&
    suggestions.length > 0 &&
    !(suggestions.length === 1 && suggestions[0] === trimmed);

  const errorMessage = getEmailErrorMessage(value);
  const showValidIcon = valid && trimmed.length > 0;
  const showInvalidIcon =
    revealInvalidEmail && !valid && trimmed.length > 0;
  const showStatusIcon = showValidIcon || showInvalidIcon;
  const displayErrorMessage =
    revealInvalidEmail && errorMessage ? errorMessage : null;

  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const scrollEmailFieldIntoView = useCallback(() => {
    const el = emailInputRef.current;
    if (!el) return;
    const run = () =>
      el.scrollIntoView({ block: "nearest", inline: "nearest" });
    requestAnimationFrame(run);
    window.setTimeout(run, 120);
    window.setTimeout(run, 360);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!valid) return;
    onContinue();
  }, [onContinue, valid]);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white px-4 pb-6 pt-4">
      <div className="shrink-0">{progressBar}</div>
      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <div className="flex w-full shrink-0 flex-col items-center gap-3 py-6">
          <div className="flex shrink-0 justify-center">
            <Mascot eyes="happy" />
          </div>
          <div className="mx-auto flex w-full max-w-[361px] shrink-0 flex-col items-center gap-6">
            <div className="flex w-full flex-col gap-4 text-center">
              <p className="whitespace-pre-line text-[28px] font-semibold leading-8 tracking-[-1.4px] text-[#22262f]">
                What&apos;s your email to{"\n"}send the plan?
              </p>
              <p className="text-[16px] font-normal leading-[22px] tracking-[-0.128px] text-[#464e62]">
                Enter your email to save your results and get early access to
                your AI speaking plan.
              </p>
            </div>
            <div className="mx-auto flex w-full max-w-[280px] flex-col gap-4">
              <div className="relative w-full">
                <input
                  ref={emailInputRef}
                  type="email"
                  autoComplete="email"
                  placeholder="you@email.com"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onFocus={() => {
                    setFocused(true);
                    setRevealInvalidEmail(false);
                    scrollEmailFieldIntoView();
                  }}
                  onBlur={() => {
                    setFocused(false);
                    setRevealInvalidEmail(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setRevealInvalidEmail(true);
                      if (valid) {
                        e.preventDefault();
                        handleSubmit();
                      }
                    }
                  }}
                  aria-invalid={showInvalidIcon}
                  aria-describedby={displayErrorMessage ? errorId : undefined}
                  aria-expanded={showSuggestions}
                  aria-controls={showSuggestions ? listboxId : undefined}
                  aria-autocomplete="list"
                  className={`h-14 w-full min-w-0 rounded-[16px] border bg-[#F5F6FA] text-[16px] text-[#22262f] outline-none ring-0 placeholder:text-[#7a8399] ${
                    showStatusIcon ? "pl-4 pr-12" : "px-4"
                  } ${
                    showInvalidIcon
                      ? "border-[#EE5542] focus:border-[#EE5542]"
                      : "border-[#ebeef5] focus:border-[#05a8ff]"
                  }`}
                />
                {showValidIcon ? (
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <EmailFieldValidIcon />
                  </span>
                ) : null}
                {showInvalidIcon ? (
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <EmailFieldInvalidIcon />
                  </span>
                ) : null}
                {showSuggestions ? (
                  <ul
                    id={listboxId}
                    role="listbox"
                    className="absolute left-0 right-0 top-full z-10 mt-1 max-h-52 overflow-y-auto rounded-[16px] border border-[#ebeef5] bg-white py-1"
                  >
                    {suggestions.map((s) => (
                      <li key={s} role="presentation">
                        <button
                          type="button"
                          role="option"
                          className="quiz-transition-interactive w-full px-4 py-2.5 text-left text-[16px] text-[#22262f] hover:bg-[#f5f6fa] active:bg-[#f5f6fa]"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            onChange(s);
                            setFocused(false);
                          }}
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              {displayErrorMessage ? (
                <p
                  id={errorId}
                  role="alert"
                  className="text-left text-[14px] font-normal leading-[18px] tracking-[-0.084px] text-[#EE5542]"
                >
                  {displayErrorMessage}
                </p>
              ) : null}
              <SheetBlackButton
                disabled={!valid}
                onClick={handleSubmit}
              >
                Continue
              </SheetBlackButton>
              <p className="text-center text-[14px] font-normal leading-[20px] tracking-[-0.112px] text-[#7a8399]">
                By continuing, you agree to our{" "}
                <span className="font-semibold">Terms of Use</span> and{" "}
                <span className="font-semibold">Privacy Policy</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Shown after email capture — marketing opt-in (both choices advance). */
export function EmailPermissionScreen({
  onOptIn,
  onOptOut,
}: {
  onOptIn: () => void;
  onOptOut: () => void;
}) {
  return (
    <>
      <div
        className={`flex min-h-0 flex-1 flex-col scroll-pb-32 overflow-y-auto bg-white px-4 ${quizStickyScrollGapBottom} pt-0`}
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <div className="flex w-full shrink-0 flex-col items-center gap-6 py-6">
            <div className="flex shrink-0 justify-center">
              <Mascot eyes="happy" />
            </div>
            <div className="mx-auto flex w-full max-w-[361px] shrink-0 flex-col items-center gap-6">
              <p className="text-center text-[28px] font-semibold leading-8 tracking-[-1.4px] text-[#22262f]">
                Do you want to receive emails with tips and plan updates?
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none shrink-0"
        style={{
          height:
            "calc(3.5rem + 0.75rem + 2.75rem + max(1rem, env(safe-area-inset-bottom, 0px)))",
        }}
      />
      <ButtonWrapper>
        <div className="font-[family-name:var(--font-inter),sans-serif] flex w-full flex-col gap-3">
          <SheetBlackButton onClick={onOptIn}>Sure, I&apos;m in!</SheetBlackButton>
          <button
            type="button"
            onClick={onOptOut}
            className="quiz-transition-interactive w-full border-0 bg-transparent px-0 py-1 text-center text-[16px] !font-semibold leading-[22px] tracking-[-0.32px] text-[#7a8399] [font-synthesis-weight:none] antialiased hover:text-[#464e62] active:text-[#464e62]"
          >
            I don&apos;t want to receive tips or updates
          </button>
        </div>
      </ButtonWrapper>
    </>
  );
}

const QUIZ_SUCCESS_SFX_SRC = "/quiz-assets/quiz-success-magic.mp3";
/** After confetti burst, brief beat before referral. */
const QUIZ_SUCCESS_NAV_AFTER_CONFETTI_MS = 720;

/** Final celebration — SFX + confetti, then `onComplete` (e.g. referral). */
export function QuizSuccessScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [confetti, setConfetti] = useState(true);

  const dismissConfetti = useCallback(() => {
    setConfetti(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const audio = new Audio(QUIZ_SUCCESS_SFX_SRC);
    audio.volume = 0.88;
    void audio.play().catch(() => {});
  }, []);

  useEffect(() => {
    const t = window.setTimeout(
      onComplete,
      CONFETTI_BURST_MS + QUIZ_SUCCESS_NAV_AFTER_CONFETTI_MS,
    );
    return () => window.clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-10">
      <p className="relative z-[1] text-center text-[32px] font-semibold leading-9 tracking-[-1.6px] text-white">
        You&apos;re all set!
      </p>
      {confetti ? (
        <CalculatingConfettiBurst onConsumed={dismissConfetti} />
      ) : null}
    </div>
  );
}

function PeopleTeaserBody({ lead, rest }: { lead: string; rest: string }) {
  return (
    <p className="text-[16px] font-normal leading-[22px] tracking-[-0.128px] text-[var(--text-secondary)]">
      <span className="font-semibold">{lead}</span>
      {rest}
    </p>
  );
}

/** Figma `121:2996` — map raster + stats row + avatars. */
export function TeaserPeopleContent({
  learnerCountLabel,
  lead,
  rest,
  gender = "female",
}: {
  learnerCountLabel: string;
  lead: string;
  rest: string;
  /** From start screen gender; controls composite avatar strip. */
  gender?: "female" | "male";
}) {
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
      <div className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-end gap-2">
            <span className="text-[56px] font-semibold leading-none tracking-[-2.8px] text-[#22262f]">
              {learnerCountLabel}
            </span>
            <span className="pb-1 text-[32px] font-semibold leading-8 tracking-[-1.6px] text-[#22262f]">
              learners
            </span>
          </div>
          <div className="relative h-10 w-[104px] shrink-0">
            <Image
              src={
                gender === "male"
                  ? quizAssets.figmaTeaserPeopleAvatarsMale
                  : quizAssets.figmaTeaserPeopleAvatarsFemale
              }
              alt=""
              fill
              className="object-contain object-right"
              sizes="104px"
              unoptimized
            />
          </div>
        </div>
        <PeopleTeaserBody lead={lead} rest={rest} />
      </div>
    </div>
  );
}

function BookNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-w-0 items-center gap-1.5">
      <svg
        className="size-5 shrink-0 text-[#7a8399]"
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
    <div className="flex flex-col">
      <div className="mb-4 flex w-full flex-col overflow-hidden rounded-2xl bg-[#18c362] pt-2">
        <p className="pb-2 text-center text-[16px] font-semibold leading-[18px] tracking-[-0.32px] text-white">
          Why Bravel works
        </p>
        <div className="relative h-[256px] w-full overflow-hidden rounded-2xl border border-[#ebeef5] bg-[#f3fef6]">
          <Image
            src={quizAssets.figmaTeaserLoopIllustration}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 480px) min(100vw - 80px, 361px), 361px"
            priority
            unoptimized
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2">
            <Mascot eyes="happy" />
          </div>
        </div>
      </div>
      <BookNote>Based on Pearson English Impact research, 2024</BookNote>
      <div className="mt-6 flex flex-col gap-3">
        <p className="text-[28px] font-semibold leading-8 tracking-[-1.4px] text-[#22262f]">
          It&apos;s more common than you think!
        </p>
        <p className="text-[16px] font-normal leading-[22px] tracking-[-0.128px] text-[var(--text-secondary)]">
          Many learners{" "}
          <span className="font-semibold text-[#22262f]">
            understand English better than they can speak
          </span>{" "}
          it. The good news? This gap can be fixed with the right kind of
          practice.
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
    <div className="flex flex-col">
      <div className="relative h-[278px] w-full overflow-hidden rounded-2xl border border-[#ebeef5] bg-white">
        <Image
          src={quizAssets.figmaTeaserRememberIllustration}
          alt=""
          fill
          className="object-contain object-center"
          sizes="361px"
        />
      </div>
      <div className="mt-4" />
      <BookNote>
        Bravel conversations train active recall in real time.
      </BookNote>
      <div className="mt-6 flex flex-col gap-3">
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
    human: "Expensive 💵",
    ai: "Affordable 🤝",
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
            <p className="text-left text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-black">
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
            <p className="text-left text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-black">
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
  onCopyInvite: () => void | Promise<void>;
  hero: React.ReactNode;
}) {
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (!linkCopied) return;
    const t = window.setTimeout(() => setLinkCopied(false), 2800);
    return () => window.clearTimeout(t);
  }, [linkCopied]);

  const handleCopy = useCallback(async () => {
    try {
      await Promise.resolve(onCopyInvite());
      setLinkCopied(true);
    } catch {
      // clipboard denied — stay on default label
    }
  }, [onCopyInvite]);

  return (
    <TeaserContinueScreen
      hero={hero}
      ctaLabel="Copy invite link"
      ctaSuccessActive={linkCopied}
      ctaSuccessLabel="Link copied"
      onContinue={handleCopy}
      sheetTopSpacing="compact"
    >
      <div className="flex flex-col gap-6 pb-2 pt-2">
        <div className="flex flex-col gap-3 text-left">
          <p className="text-[28px] font-semibold leading-8 tracking-[-1.4px] text-[#22262f]">
            You&apos;re on the waitlist 🫶
          </p>
          <p className="text-[16px] font-normal leading-[22px] tracking-[-0.128px] text-[#464e62]">
            We&apos;ll email you when your AI speaking plan is ready. As a thank
            you, you&apos;ll get{" "}
            <span className="font-semibold leading-[18px] tracking-[-0.32px]">
              a free English assessment
            </span>{" "}
            when beta opens.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-4 overflow-hidden rounded-2xl bg-gradient-to-b from-[#ffe09c] to-[#fecf67] px-4 pb-5 pt-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/50">
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
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/50">
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
