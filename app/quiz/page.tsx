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
import { steps } from "./steps";
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
  quizStickyScrollGapBottom,
} from "./ui";
import {
  CalculatingScreen,
  EmailCaptureScreen,
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
  const [emailDraft, setEmailDraft] = useState("");
  const [selectedAgeGroupId, setSelectedAgeGroupId] = useState<string | null>(
    null,
  );
  const [selectedGenderId, setSelectedGenderId] = useState<string | null>(null);

  const step = steps[index];

  const subtleScrollRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    setSubtleOtherText("");
  }, [index]);

  useEffect(() => {
    if (index === 0) {
      setSelectedAgeGroupId(null);
      setSelectedGenderId(null);
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
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
    if (step.kind === "calculating" || step.kind === "email") {
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

  /** Start embeds beams inside {@link ScreenStart}; still needs overflow visible on the frame. */
  const allowBeamHorizontalOverflow =
    !!step && (shell.beams || step.kind === "start");

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
      step.kind === "work-impact-teaser");

  const progressSurfaceForEmbedded = useMemo(() => {
    if (!step) return "onBlue" as const;
    if (step.kind === "calculating" || step.kind === "email") return "onWhite";
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
  ) =>
    step && "progress" in step ? (
      <ProgressBar
        surface={surface}
        showDetails={showDetails}
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
      />
    );
  } else if (step?.kind === "summary") {
    inner = (
      <SummaryLineScreen headline={step.headline} onContinue={goNext} />
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
  } else if (step?.kind === "referral") {
    inner = (
      <ReferralScreen
        onCopyInvite={() => {
          void navigator.clipboard.writeText(window.location.href);
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
              <TitleTextRow key={opt.id} option={opt} onSelect={goNext} />
            ))}
          </div>
        </div>
      </div>
    );
  } else if (step?.kind === "multi") {
    const canContinue = multiSelected.size > 0;
    inner = (
      <>
        <div
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
    <div className={`flex min-h-0 w-full flex-1 flex-col ${shell.shell}`}>
      <QuizFrame
        allowHorizontalOverflow={allowBeamHorizontalOverflow}
        className={shell.frame}
      >
        <div
          className={`relative flex min-h-0 min-w-0 flex-1 flex-col ${
            allowBeamHorizontalOverflow ? "overflow-x-visible" : "overflow-x-hidden"
          }`}
        >
          {shell.beams ? (
            <VectorBeamsBackground
              variant={
                step?.kind === "work-impact-teaser"
                  ? "workImpact"
                  : "default"
              }
            />
          ) : null}
          <div
            className={`relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col ${
              step?.kind === "teaser" || step?.kind === "start"
                ? "pb-0"
                : "pb-4"
            } ${
              isBlueScreen || step?.kind === "start" ? "pt-0" : "pt-4"
            }`}
          >
            {progressMeta ? (
              <div className="shrink-0 px-4">
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
