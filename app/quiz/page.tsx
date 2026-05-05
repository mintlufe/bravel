"use client";

import type { ReactNode } from "react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { QuizStep } from "./steps";
import {
  QUIZ_CALCULATING_STEP_INDEX,
  SUMMARY_HEADLINE_GET_STARTED,
  steps,
} from "./steps";
import {
  CheckboxRow,
  Mascot,
  PlainRow,
  ButtonWrapper,
  FunnelContinueButton,
  ProgressBar,
  QuizFrame,
  QuizMessage,
  SubtleRow,
  TitleTextRow,
  QuizStickyFooterSlot,
  VectorBeamsBackground,
  quizStickyBottomScrollMargin,
  quizStickyScrollGapBottom,
} from "./ui";
import {
  CalculatingScreen,
  EmailCaptureScreen,
  EmailPermissionScreen,
  QuizSuccessScreen,
  ReferralScreen,
  SummaryLineScreen,
  TeaserContinueScreen,
  TeaserLoopContent,
  TeaserPeopleContent,
  TeaserRememberContent,
  TeaserTableContent,
} from "./funnel-screens";
import { ScreenStart } from "./screen-start";
import { WorkImpactScreen } from "./work-impact-screen";
import {
  WORK_IMPACT_BY_FIELD,
  WORK_IMPACT_FALLBACK,
} from "./work-impact-copy";
import { getPeopleTeaserCopy } from "./people-teaser-copy";

/** Default text for “Copy invite link” on the referral screen. Override with `NEXT_PUBLIC_REFERRAL_INVITE_URL`. */
const REFERRAL_INVITE_FALLBACK_URL =
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1";

/** Ambient choir from first summary (“Based on…”) through the second-to-last summary; fades on last summary before email — `public/quiz-assets/angel-choir-463220.mp3`. */
const QUIZ_SUMMARY_AMBIENT_SRC = "/quiz-assets/angel-choir-463220.mp3";
const QUIZ_SUMMARY_AMBIENT_VOLUME = 0.42;
const QUIZ_SUMMARY_AMBIENT_FADE_OUT_MS = 1400;

/** Ease-out cubic fade between two volumes; returns cancel (stops animation without calling `onComplete`). */
function fadeAudioVolume(
  audio: HTMLAudioElement,
  fromVol: number,
  toVol: number,
  durationMs: number,
  onComplete: () => void,
): () => void {
  const start = performance.now();
  let cancelled = false;
  const step = (now: number) => {
    if (cancelled) return;
    const t = Math.min(1, (now - start) / durationMs);
    const eased = 1 - (1 - t) ** 3;
    audio.volume = fromVol + (toVol - fromVol) * eased;
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      audio.volume = toVol;
      if (!cancelled) onComplete();
    }
  };
  requestAnimationFrame(step);
  return () => {
    cancelled = true;
  };
}

function isQuestionStepKind(kind: QuizStep["kind"]): boolean {
  return (
    kind === "start" ||
    kind === "plain-single" ||
    kind === "subtle-single" ||
    kind === "multi" ||
    kind === "title-single" ||
    kind === "email"
  );
}

function shouldShowStickyOther(
  step: QuizStep | undefined,
  subtleOtherText: string,
): boolean {
  if (step?.kind !== "subtle-single") return false;
  if (!step.question.toLowerCase().includes("field")) return false;
  const hasAllowCustom = step.options.some((o) => o.allowCustomText);
  return hasAllowCustom && subtleOtherText.trim().length > 0;
}

/** Target px between “Other” row bottom and the top of the blue primary button */
const SUBTLE_CUSTOM_ABOVE_FOOTER_GAP_PX = 20;
/** Small fudge for blur / subpixel so the row doesn’t clip the button */
const SUBTLE_CUSTOM_ABOVE_FOOTER_BUFFER_PX = 4;
/** User must not be able to scroll so far that this gap grows past 40px */
const SUBTLE_INPUT_BUTTON_MAX_GAP_PX = 40;

function measureSubtleInputButtonGapPx(target: HTMLElement): number {
  const tray = document.querySelector(
    '[data-name="ButtonWrapper"]',
  ) as HTMLElement | null;
  const button = tray?.querySelector(
    "button",
  ) as HTMLElement | null;
  const anchorTop = button
    ? button.getBoundingClientRect().top
    : tray
      ? tray.getBoundingClientRect().top
      : window.innerHeight;
  return anchorTop - target.getBoundingClientRect().bottom;
}

/** Pulls `scrollTop` down so the visible gap never exceeds `maxGapPx` (excess padding/spacer). */
function clampSubtleInputButtonGapMax(
  scrollEl: HTMLElement,
  target: HTMLElement,
  maxGapPx: number = SUBTLE_INPUT_BUTTON_MAX_GAP_PX,
) {
  let guard = 0;
  while (
    measureSubtleInputButtonGapPx(target) > maxGapPx + 0.5 &&
    scrollEl.scrollTop > 0 &&
    guard++ < 500
  ) {
    scrollEl.scrollTop -= Math.min(16, scrollEl.scrollTop);
  }
  guard = 0;
  while (
    measureSubtleInputButtonGapPx(target) > maxGapPx + 0.25 &&
    scrollEl.scrollTop > 0 &&
    guard++ < 400
  ) {
    scrollEl.scrollTop -= 1;
  }
}

/**
 * Scrolls an inner `overflow` container so `target` sits above the portaled
 * sticky footer. Uses the **primary button** top (not the blur tray) and
 * repeats until the gap clears or scroll hits max (needs enough scroll slack).
 */
function scrollQuizFieldAboveStickyFooter(
  scrollEl: HTMLElement,
  target: HTMLElement,
  gapPx: number = SUBTLE_CUSTOM_ABOVE_FOOTER_GAP_PX,
  bufferPx: number = SUBTLE_CUSTOM_ABOVE_FOOTER_BUFFER_PX,
) {
  const tray = document.querySelector(
    '[data-name="ButtonWrapper"]',
  ) as HTMLElement | null;
  const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;

  for (let i = 0; i < 12; i++) {
    const button = tray?.querySelector(
      "button",
    ) as HTMLElement | null;
    const anchorTop = button
      ? button.getBoundingClientRect().top
      : tray
        ? tray.getBoundingClientRect().top
        : window.innerHeight;

    const limit = anchorTop - gapPx - bufferPx;
    const overlap = target.getBoundingClientRect().bottom - limit;
    if (overlap <= 0.5) return;

    const nextTop = Math.min(maxScroll, scrollEl.scrollTop + overlap);
    if (nextTop <= scrollEl.scrollTop + 0.5) return;
    scrollEl.scrollTop = nextTop;
  }
}

function QuizScreenShell({
  navDirection,
  motionGeneration,
  children,
}: {
  navDirection: "fwd" | "bwd";
  motionGeneration: number;
  children: ReactNode;
}) {
  const animate =
    motionGeneration > 0
      ? navDirection === "fwd"
        ? "quiz-screen-animate-fwd"
        : "quiz-screen-animate-bwd"
      : undefined;

  return (
    <div
      className={`flex min-h-0 min-w-0 flex-1 flex-col ${animate ?? ""}`}
    >
      {children}
    </div>
  );
}

export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const [multiSelected, setMultiSelected] = useState<Set<string>>(
    () => new Set(),
  );
  const [navDirection, setNavDirection] = useState<"fwd" | "bwd">("fwd");
  const [motionGeneration, setMotionGeneration] = useState(0);
  const [selectedWorkFieldId, setSelectedWorkFieldId] = useState<string | null>(
    null,
  );
  const [subtleOtherText, setSubtleOtherText] = useState("");
  /** Free text when multi-select “None of the above” (custom) is chosen. */
  const [multiNoneCustomText, setMultiNoneCustomText] = useState("");
  const [emailDraft, setEmailDraft] = useState("");
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState<string | null>(
    null,
  );
  const [selectedGenderId, setSelectedGenderId] = useState<string | null>(null);
  const [stayOnCalculating, setStayOnCalculating] = useState(false);
  const [englishFeelTitle, setEnglishFeelTitle] = useState<string | null>(null);
  const [practiceTimeLabel, setPracticeTimeLabel] = useState<string | null>(
    null,
  );

  const step = steps[index];

  const summaryAmbientAudioRef = useRef<HTMLAudioElement | null>(null);
  const summaryAmbientFadeCancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const shouldPlaySummaryAmbient =
      step?.kind === "summary" &&
      step.headline !== SUMMARY_HEADLINE_GET_STARTED;

    if (!shouldPlaySummaryAmbient) {
      const audio = summaryAmbientAudioRef.current;
      if (audio) {
        summaryAmbientFadeCancelRef.current?.();
        const fromVol = audio.volume;
        summaryAmbientFadeCancelRef.current = fadeAudioVolume(
          audio,
          fromVol,
          0,
          QUIZ_SUMMARY_AMBIENT_FADE_OUT_MS,
          () => {
            audio.pause();
            audio.removeAttribute("src");
            audio.load();
            if (summaryAmbientAudioRef.current === audio) {
              summaryAmbientAudioRef.current = null;
            }
            summaryAmbientFadeCancelRef.current = null;
          },
        );
      }
      return () => {
        summaryAmbientFadeCancelRef.current?.();
        summaryAmbientFadeCancelRef.current = null;
      };
    }

    summaryAmbientFadeCancelRef.current?.();
    summaryAmbientFadeCancelRef.current = null;

    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    if (summaryAmbientAudioRef.current !== null) {
      summaryAmbientAudioRef.current.volume = QUIZ_SUMMARY_AMBIENT_VOLUME;
      return;
    }

    const audio = new Audio(QUIZ_SUMMARY_AMBIENT_SRC);
    audio.volume = QUIZ_SUMMARY_AMBIENT_VOLUME;
    audio.loop = true;
    summaryAmbientAudioRef.current = audio;
    void audio.play().catch(() => {});
  }, [
    step?.kind,
    step?.kind === "summary" ? step.headline : undefined,
  ]);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    const stayOnLoading =
      sp.get("calculating") === "stay" ||
      sp.get("loading") === "stay" ||
      sp.get("noredirect") === "1";
    if (!stayOnLoading) return;
    setStayOnCalculating(true);
    if (QUIZ_CALCULATING_STEP_INDEX >= 0) {
      setIndex(QUIZ_CALCULATING_STEP_INDEX);
    }
  }, []);

  const subtleScrollRef = useRef<HTMLDivElement | null>(null);
  const multiScrollRef = useRef<HTMLDivElement | null>(null);

  const ensureSubtleCustomRowVisible = useCallback(() => {
    const scrollEl = subtleScrollRef.current;
    const row = document.getElementById("quiz-subtle-custom-row");
    if (!scrollEl || !row || !(row instanceof HTMLElement)) return;
    const run = () => {
      scrollQuizFieldAboveStickyFooter(scrollEl, row);
      clampSubtleInputButtonGapMax(scrollEl, row);
    };
    run();
    requestAnimationFrame(run);
    requestAnimationFrame(() => requestAnimationFrame(run));
    window.setTimeout(run, 0);
    window.setTimeout(run, 32);
    window.setTimeout(run, 120);
  }, []);

  const clampSubtleScrollMaxGap = useCallback(() => {
    const scrollEl = subtleScrollRef.current;
    const row = document.getElementById("quiz-subtle-custom-row");
    if (!scrollEl || !row || !(row instanceof HTMLElement)) return;
    clampSubtleInputButtonGapMax(scrollEl, row);
  }, []);

  const ensureMultiNoneRowVisible = useCallback(() => {
    const scrollEl = multiScrollRef.current;
    const row = document.getElementById("quiz-multi-none-custom-row");
    if (!scrollEl || !row || !(row instanceof HTMLElement)) return;
    const run = () => {
      scrollQuizFieldAboveStickyFooter(scrollEl, row);
      clampSubtleInputButtonGapMax(scrollEl, row);
    };
    run();
    requestAnimationFrame(run);
    requestAnimationFrame(() => requestAnimationFrame(run));
    window.setTimeout(run, 0);
    window.setTimeout(run, 32);
    window.setTimeout(run, 120);
  }, []);

  const clampMultiScrollMaxGap = useCallback(() => {
    const scrollEl = multiScrollRef.current;
    const row = document.getElementById("quiz-multi-none-custom-row");
    if (!scrollEl || !row || !(row instanceof HTMLElement)) return;
    clampSubtleInputButtonGapMax(scrollEl, row);
  }, []);

  useLayoutEffect(() => {
    if (step?.kind !== "subtle-single") return;
    if (!shouldShowStickyOther(step, subtleOtherText)) return;
    ensureSubtleCustomRowVisible();
  }, [step, subtleOtherText, ensureSubtleCustomRowVisible]);

  useEffect(() => {
    if (step?.kind !== "subtle-single") return;
    if (!shouldShowStickyOther(step, subtleOtherText)) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const onViewportChange = () => ensureSubtleCustomRowVisible();
    vv.addEventListener("resize", onViewportChange);
    vv.addEventListener("scroll", onViewportChange);
    return () => {
      vv.removeEventListener("resize", onViewportChange);
      vv.removeEventListener("scroll", onViewportChange);
    };
  }, [step, subtleOtherText, ensureSubtleCustomRowVisible]);

  useEffect(() => {
    if (step?.kind !== "subtle-single") return;
    if (!shouldShowStickyOther(step, subtleOtherText)) return;
    const el = subtleScrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", clampSubtleScrollMaxGap, { passive: true });
    clampSubtleScrollMaxGap();
    return () => el.removeEventListener("scroll", clampSubtleScrollMaxGap);
  }, [step, subtleOtherText, clampSubtleScrollMaxGap]);

  useLayoutEffect(() => {
    if (step?.kind !== "multi") return;
    if (!multiSelected.has("none")) return;
    const hasNoneCustom = step.options.some(
      (o) => o.id === "none" && o.allowCustomText,
    );
    if (!hasNoneCustom) return;
    ensureMultiNoneRowVisible();
  }, [
    step,
    multiSelected,
    multiNoneCustomText,
    ensureMultiNoneRowVisible,
  ]);

  useEffect(() => {
    if (step?.kind !== "multi") return;
    if (!multiSelected.has("none")) return;
    const hasNoneCustom = step.options.some(
      (o) => o.id === "none" && o.allowCustomText,
    );
    if (!hasNoneCustom) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const onViewportChange = () => ensureMultiNoneRowVisible();
    vv.addEventListener("resize", onViewportChange);
    vv.addEventListener("scroll", onViewportChange);
    return () => {
      vv.removeEventListener("resize", onViewportChange);
      vv.removeEventListener("scroll", onViewportChange);
    };
  }, [step, multiSelected, ensureMultiNoneRowVisible]);

  useEffect(() => {
    if (step?.kind !== "multi") return;
    if (!multiSelected.has("none")) return;
    const hasNoneCustom = step.options.some(
      (o) => o.id === "none" && o.allowCustomText,
    );
    if (!hasNoneCustom) return;
    const el = multiScrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", clampMultiScrollMaxGap, { passive: true });
    clampMultiScrollMaxGap();
    return () => el.removeEventListener("scroll", clampMultiScrollMaxGap);
  }, [step, multiSelected, clampMultiScrollMaxGap]);

  useEffect(() => {
    setSubtleOtherText("");
    setMultiNoneCustomText("");
  }, [index]);

  useEffect(() => {
    if (!multiSelected.has("none")) {
      setMultiNoneCustomText("");
    }
  }, [multiSelected]);

  useEffect(() => {
    if (index === 0) {
      setSelectedAgeGroupId(null);
      setSelectedGenderId(null);
      setEnglishFeelTitle(null);
      setPracticeTimeLabel(null);
    }
  }, [index]);

  const bumpMotion = useCallback(() => {
    setMotionGeneration((g) => g + 1);
  }, []);

  const goNext = useCallback(() => {
    setNavDirection("fwd");
    bumpMotion();
    if (index < steps.length - 1) {
      setIndex((i) => i + 1);
      setMultiSelected(new Set());
    }
  }, [bumpMotion, index]);

  const goBack = useCallback(() => {
    if (index <= 0) return;
    setNavDirection("bwd");
    bumpMotion();
    setIndex((i) => i - 1);
    setMultiSelected(new Set());
  }, [bumpMotion, index]);

  const toggleMulti = useCallback((id: string) => {
    setMultiSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return next;
      }
      if (id === "none") {
        return new Set<string>(["none"]);
      }
      next.delete("none");
      next.add(id);
      return next;
    });
  }, []);

  const screenKey = `step-${index}`;

  const shell = useMemo(() => {
    if (!step) {
      return {
        shell: "quiz-shell-gradient",
        frame: "text-white",
        beams: false,
      } as const;
    }
    if (step.kind === "start") {
      return {
        shell: "bg-gradient-to-b from-[#05a8ff] to-[#057ccc]",
        frame: "text-white",
        beams: false,
      } as const;
    }
    if (step.kind === "quiz-success") {
      return {
        shell: "bg-gradient-to-b from-[#05a8ff] to-[#057ccc]",
        frame: "text-white",
        beams: true,
      } as const;
    }
    if (
      step.kind === "calculating" ||
      step.kind === "email" ||
      step.kind === "email-permission"
    ) {
      return {
        shell: "bg-white",
        frame: "text-[#22262f]",
        beams: false,
      } as const;
    }
    if (step.kind === "teaser") {
      return {
        shell: "bg-gradient-to-b from-[#05a8ff] to-[#057ccc]",
        frame: "text-white",
        beams: step.variant === "people" || step.variant === "table",
      } as const;
    }
    if (
      step.kind === "summary" ||
      step.kind === "referral" ||
      step.kind === "work-impact-teaser"
    ) {
      return {
        shell: "bg-gradient-to-b from-[#05a8ff] to-[#057ccc]",
        frame: "text-white",
        beams: true,
      } as const;
    }
    if (
      step.kind === "plain-single" ||
      step.kind === "subtle-single" ||
      step.kind === "multi" ||
      step.kind === "title-single"
    ) {
      return {
        shell: "quiz-shell-funnel-general",
        frame: "text-[#22262f]",
        beams: false,
      } as const;
    }
    return { shell: "quiz-shell-gradient", frame: "text-white", beams: false } as const;
  }, [step]);

  const showGlobalProgress =
    step &&
    step.kind !== "start" &&
    step.kind !== "teaser" &&
    step.kind !== "calculating" &&
    step.kind !== "email" &&
    step.kind !== "referral";

  /** Renders above the keyed screen so the progress track stays mounted and width can animate. */
  const progressMeta =
    showGlobalProgress && step && "progress" in step
      ? { current: step.progress, total: step.total }
      : null;

  const questionTotal = useMemo(
    () => steps.filter((s) => isQuestionStepKind(s.kind)).length,
    [],
  );
  const currentQuestionNumber = useMemo(() => {
    if (!step) return 0;
    return steps
      .slice(0, index + 1)
      .filter((s) => isQuestionStepKind(s.kind)).length;
  }, [index, step]);
  const isCurrentStepQuestion = !!step && isQuestionStepKind(step.kind);

  const isBlueScreen =
    !!step &&
    (step.kind === "teaser" ||
      step.kind === "summary" ||
      step.kind === "referral" ||
      step.kind === "work-impact-teaser" ||
      step.kind === "quiz-success");

  const progressSurfaceForEmbedded = useMemo(() => {
    if (!step) return "onBlue" as const;
    if (
      step.kind === "calculating" ||
      step.kind === "email" ||
      step.kind === "email-permission"
    ) {
      return "onWhite";
    }
    if (
      step.kind === "plain-single" ||
      step.kind === "subtle-single" ||
      step.kind === "multi" ||
      step.kind === "title-single"
    ) {
      return "funnel";
    }
    return "onBlue";
  }, [step]);

  /** Spacing below progress bar; non-blue column uses `pt-4`, blue uses `pt-0` + `pt-4` on {@link ProgressBar}. */
  const contentPadTop = progressMeta ? "pt-10" : "";

  const progressBar = (
    surface: "onBlue" | "onWhite" | "funnel" = "onBlue",
    showDetails = true,
    padTop = false,
  ) =>
    step && "progress" in step ? (
      <ProgressBar
        surface={surface}
        showDetails={showDetails}
        padTop={padTop}
        current={currentQuestionNumber}
        total={questionTotal}
        onBack={goBack}
      />
    ) : null;

  let inner: ReactNode;

  if (step?.kind === "start") {
    inner = (
      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col ${contentPadTop}`}
      >
        <ScreenStart
          headline={step.headline}
          socialUsers={step.socialUsers}
          socialLine1={step.socialLine1}
          socialLine2={step.socialLine2}
          question={step.question}
          questionSub={step.questionSub}
          options={step.options}
          onOptionSelect={(optionId) => {
            setSelectedGenderId(optionId);
            goNext();
          }}
        />
      </div>
    );
  } else if (step?.kind === "teaser") {
    const titleInBlueHero =
      step.variant === "people" || step.variant === "table";
    inner = (
      <TeaserContinueScreen
        ctaLabel={step.ctaLabel}
        onContinue={goNext}
        sheetTopSpacing={titleInBlueHero ? "loose" : "compact"}
        hero={
          <>
            <div className="shrink-0 px-4">{progressBar("onBlue", false)}</div>
            {titleInBlueHero ? (
              <h2 className="whitespace-pre-line px-4 text-center text-[28px] font-semibold leading-8 tracking-[-1.4px] text-white">
                {step.title}
              </h2>
            ) : null}
          </>
        }
      >
        {step.variant === "people" ? (
          <TeaserPeopleContent
            {...getPeopleTeaserCopy(selectedAgeGroupId)}
            gender={selectedGenderId === "male" ? "male" : "female"}
          />
        ) : null}
        {step.variant === "table" ? (
          <TeaserTableContent body={step.body} />
        ) : null}
        {step.variant === "loop" ? <TeaserLoopContent /> : null}
        {step.variant === "remember" ? (
          <TeaserRememberContent title={step.title} body={step.body} />
        ) : null}
      </TeaserContinueScreen>
    );
  } else if (step?.kind === "calculating") {
    inner = (
      <CalculatingScreen
        onComplete={goNext}
        progressBar={progressBar("onWhite", false)}
        stayOnScreen={stayOnCalculating}
      />
    );
  } else if (step?.kind === "summary") {
    inner = (
      <SummaryLineScreen
        headline={step.headline}
        englishFeelTitle={englishFeelTitle}
        practiceTimeLabel={practiceTimeLabel}
        onContinue={goNext}
      />
    );
  } else if (step?.kind === "email") {
    inner = (
      <EmailCaptureScreen
        value={emailDraft}
        onChange={setEmailDraft}
        onContinue={goNext}
        progressBar={progressBar("onWhite", true)}
      />
    );
  } else if (step?.kind === "email-permission") {
    inner = (
      <EmailPermissionScreen onOptIn={goNext} onOptOut={goNext} />
    );
  } else if (step?.kind === "quiz-success") {
    inner = <QuizSuccessScreen onComplete={goNext} />;
  } else if (step?.kind === "referral") {
    inner = (
      <ReferralScreen
        onCopyInvite={async () => {
          const url =
            process.env.NEXT_PUBLIC_REFERRAL_INVITE_URL?.trim() ||
            REFERRAL_INVITE_FALLBACK_URL;
          await navigator.clipboard.writeText(url);
        }}
        hero={
          <div className="shrink-0 px-4">{progressBar("onBlue", false)}</div>
        }
      />
    );
  } else if (step?.kind === "title-single") {
    inner = (
      <div className={`flex flex-col gap-10 px-4 ${contentPadTop}`}>
        <div className="flex flex-col gap-10">
          <div className="flex gap-2">
            <Mascot />
            <QuizMessage tone="light">
              <p className="w-full text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-[#22262f]">
                {step.question}
              </p>
              {step.subtitle ? (
                <p className="w-full text-[16px] font-normal leading-5 tracking-[-0.128px] text-[#464e62]">
                  {step.subtitle}
                </p>
              ) : null}
            </QuizMessage>
          </div>
          <div className="flex flex-col gap-2">
            {step.options.map((opt) => (
              <TitleTextRow
                key={opt.id}
                option={opt}
                onSelect={() => {
                  if (
                    step.question ===
                    "What would you like your English to feel like?"
                  ) {
                    setEnglishFeelTitle(opt.title);
                  }
                  goNext();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  } else if (step?.kind === "multi") {
    const noneCustomOpt = step.options.find(
      (o) => o.allowCustomText && o.id === "none",
    );
    const showMultiNoneInput =
      !!noneCustomOpt && multiSelected.has("none");
    const canContinue =
      multiSelected.size > 0 &&
      (!showMultiNoneInput || multiNoneCustomText.trim().length > 0);
    inner = (
      <>
        <div
          ref={multiScrollRef}
          className={`flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto px-4 ${quizStickyScrollGapBottom} ${contentPadTop}`}
        >
          <div className="flex flex-col gap-10">
            <div className="flex gap-2">
              <Mascot />
              <QuizMessage tone="light">
                <p className="w-full text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-[#22262f]">
                  {step.question}
                </p>
                {step.subtitle ? (
                  <p className="w-full text-[16px] font-normal leading-5 tracking-[-0.128px] text-[#464e62]">
                    {step.subtitle}
                  </p>
                ) : null}
              </QuizMessage>
            </div>
            <div className="flex flex-col gap-2">
              {step.options.map((opt) => (
                <CheckboxRow
                  key={opt.id}
                  option={opt}
                  selected={multiSelected.has(opt.id)}
                  onToggle={() => toggleMulti(opt.id)}
                />
              ))}
              {showMultiNoneInput ? (
                <div
                  id="quiz-multi-none-custom-row"
                  className={`quiz-transition-interactive flex min-h-14 w-full items-center gap-3 rounded-2xl border border-[#ebeef5] bg-[#f5f6fa] p-4 focus-within:ring-1 focus-within:ring-[#05a8ff] ${quizStickyBottomScrollMargin}`}
                >
                  <span
                    className="shrink-0 text-[24px] leading-6 tracking-[-0.192px]"
                    aria-hidden
                  >
                    ✍️
                  </span>
                  <input
                    type="text"
                    value={multiNoneCustomText}
                    onChange={(e) => setMultiNoneCustomText(e.target.value)}
                    placeholder="Tell us in your own words"
                    autoComplete="off"
                    aria-label="Describe what gets in your way"
                    className="min-h-0 min-w-0 flex-1 border-0 bg-transparent p-0 text-[16px] font-medium leading-4 tracking-[-0.32px] text-[#22262f] outline-none placeholder:text-[#7a8399] focus:outline-none focus-visible:ring-0"
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        multiNoneCustomText.trim().length > 0
                      ) {
                        goNext();
                      }
                    }}
                    onFocus={() => ensureMultiNoneRowVisible()}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <QuizStickyFooterSlot />
        <ButtonWrapper>
          <FunnelContinueButton disabled={!canContinue} onClick={goNext}>
            Continue
          </FunnelContinueButton>
        </ButtonWrapper>
      </>
    );
  } else if (step?.kind === "work-impact-teaser") {
    const parts =
      selectedWorkFieldId &&
      WORK_IMPACT_BY_FIELD[selectedWorkFieldId]
        ? WORK_IMPACT_BY_FIELD[selectedWorkFieldId]
        : WORK_IMPACT_FALLBACK;
    inner = (
      <WorkImpactScreen
        parts={parts}
        onContinue={goNext}
        contentTopClass={contentPadTop}
      />
    );
  } else if (step?.kind === "subtle-single") {
    const isWorkField = step.question.toLowerCase().includes("field");
    const showStickyOther = shouldShowStickyOther(step, subtleOtherText);
    /** Tighter than multi/done: large `pb` + scroll slack read as “too much” gap above Continue */
    const scrollPadBottom = showStickyOther ? "pb-4" : "";

    const submitCustomOther = () => {
      const otherOpt = step.options.find((o) => o.allowCustomText);
      if (!otherOpt || !subtleOtherText.trim()) return;
      if (isWorkField) setSelectedWorkFieldId(otherOpt.id);
      setSubtleOtherText("");
      goNext();
    };

    inner = (
      <>
        <div
          ref={subtleScrollRef}
          className={`flex min-h-0 min-w-0 max-h-[100dvh] flex-1 flex-col gap-10 overflow-y-auto px-4 ${scrollPadBottom} ${contentPadTop}`}
        >
          <div className="flex flex-col gap-10">
            <div className="flex gap-2">
              <Mascot />
              <QuizMessage tone="light">
                <p className="w-full text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-[#22262f]">
                  {step.question}
                </p>
                {step.subtitle ? (
                  <p className="w-full text-[16px] font-normal leading-5 tracking-[-0.128px] text-[#464e62]">
                    {step.subtitle}
                  </p>
                ) : null}
              </QuizMessage>
            </div>
            <div className="flex flex-col gap-2">
              {step.options.map((opt) => (
                <SubtleRow
                  key={opt.id}
                  option={opt}
                  customText={
                    opt.allowCustomText ? subtleOtherText : undefined
                  }
                  onCustomTextChange={
                    opt.allowCustomText ? setSubtleOtherText : undefined
                  }
                  ensureCustomRowVisible={
                    opt.allowCustomText
                      ? ensureSubtleCustomRowVisible
                      : undefined
                  }
                  onSelect={() => {
                    if (opt.allowCustomText) {
                      submitCustomOther();
                      return;
                    }
                    if (isWorkField) setSelectedWorkFieldId(opt.id);
                    goNext();
                  }}
                />
              ))}
            </div>
          </div>
          {showStickyOther ? (
            <div
              aria-hidden
              className="pointer-events-none shrink-0 min-h-[40px]"
            />
          ) : null}
        </div>
        {showStickyOther ? (
          <>
            <QuizStickyFooterSlot />
            <ButtonWrapper>
              <FunnelContinueButton
                disabled={!subtleOtherText.trim()}
                onClick={submitCustomOther}
              >
                Continue
              </FunnelContinueButton>
            </ButtonWrapper>
          </>
        ) : null}
      </>
    );
  } else if (step?.kind === "plain-single") {
    inner = (
      <div className={`flex flex-col gap-10 px-4 ${contentPadTop}`}>
        <div className="flex flex-col gap-10">
          <div className="flex gap-2">
            <Mascot />
            <QuizMessage tone="light">
              <p className="w-full text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-[#22262f]">
                {step.question}
              </p>
              {step.subtitle ? (
                <p className="w-full text-[16px] font-normal leading-5 tracking-[-0.128px] text-[#464e62]">
                  {step.subtitle}
                </p>
              ) : null}
            </QuizMessage>
          </div>
          <div className="flex flex-col gap-2">
            {step.options.map((opt) => (
              <PlainRow
                key={opt.id}
                option={opt}
                onSelect={() => {
                  if (step.question === "What is your age group?") {
                    setSelectedAgeGroupId(opt.id);
                  }
                  if (step.question === "How much time can you practice a day?") {
                    setPracticeTimeLabel(opt.label);
                  }
                  goNext();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    inner = null;
  }

  return (
    <div
      className={`flex min-h-0 w-full max-w-[100vw] flex-1 touch-pan-y flex-col overflow-x-hidden overflow-y-hidden overscroll-x-none ${shell.shell}${
        step?.kind === "email-permission" ? " pt-4" : ""
      }`}
    >
      <QuizFrame className={shell.frame}>
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          {shell.beams ? (
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <VectorBeamsBackground
                variant={
                  step?.kind === "work-impact-teaser"
                    ? "workImpact"
                    : step?.kind === "summary" ||
                        step?.kind === "referral" ||
                        step?.kind === "quiz-success"
                      ? "center"
                      : "default"
                }
              />
            </div>
          ) : null}
          <div
            className={`relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col ${
              step?.kind === "teaser" ||
              step?.kind === "start" ||
              step?.kind === "referral" ||
              step?.kind === "calculating" ||
              step?.kind === "quiz-success"
                ? "pb-0"
                : "pb-4"
            } ${
              isBlueScreen ||
              step?.kind === "start" ||
              step?.kind === "email" ||
              step?.kind === "email-permission" ||
              step?.kind === "calculating"
                ? "pt-0"
                : "pt-4"
            }`}
          >
            {progressMeta ? (
              <div
                className={`shrink-0 px-4${step?.kind === "email" ? " pt-4" : ""}`}
              >
                <ProgressBar
                  surface={progressSurfaceForEmbedded}
                  showDetails={isCurrentStepQuestion}
                  current={currentQuestionNumber}
                  total={questionTotal}
                  onBack={goBack}
                />
              </div>
            ) : null}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <QuizScreenShell
                key={screenKey}
                navDirection={navDirection}
                motionGeneration={motionGeneration}
              >
                {inner}
              </QuizScreenShell>
            </div>
          </div>
        </div>
      </QuizFrame>
    </div>
  );
}
