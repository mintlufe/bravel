"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { steps } from "./steps";
import {
  CheckboxRow,
  Mascot,
  PlainRow,
  ButtonWrapper,
  PrimaryButton,
  ProgressBar,
  QuizFrame,
  QuizMessage,
  SubtleRow,
  TitleTextRow,
} from "./ui";
import { ScreenStart } from "./screen-start";
import { WorkImpactScreen } from "./work-impact-screen";
import {
  WORK_IMPACT_BY_FIELD,
  WORK_IMPACT_FALLBACK,
} from "./work-impact-copy";

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
  const [done, setDone] = useState(false);
  const [navDirection, setNavDirection] = useState<"fwd" | "bwd">("fwd");
  const [motionGeneration, setMotionGeneration] = useState(0);
  const [selectedWorkFieldId, setSelectedWorkFieldId] = useState<string | null>(
    null,
  );
  const [subtleOtherText, setSubtleOtherText] = useState("");

  useEffect(() => {
    setSubtleOtherText("");
  }, [index]);

  const bumpMotion = useCallback(() => {
    setMotionGeneration((g) => g + 1);
  }, []);

  const step = steps[index];

  const goNext = useCallback(() => {
    setNavDirection("fwd");
    bumpMotion();
    if (index < steps.length - 1) {
      setIndex((i) => i + 1);
      setMultiSelected(new Set());
    } else {
      setDone(true);
    }
  }, [bumpMotion, index]);

  const goBack = useCallback(() => {
    if (done) {
      setNavDirection("bwd");
      bumpMotion();
      setDone(false);
      return;
    }
    if (index <= 0) return;
    setNavDirection("bwd");
    bumpMotion();
    setIndex((i) => i - 1);
    setMultiSelected(new Set());
  }, [bumpMotion, done, index]);

  const toggleMulti = useCallback((id: string) => {
    setMultiSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const restart = useCallback(() => {
    setNavDirection("fwd");
    bumpMotion();
    setDone(false);
    setIndex(0);
    setMultiSelected(new Set());
    setSelectedWorkFieldId(null);
    setSubtleOtherText("");
  }, [bumpMotion]);

  const screenKey = done ? "done" : `step-${index}`;

  /** Renders above the keyed screen so the progress track stays mounted and width can animate. */
  const progressMeta =
    !done && step && step.kind !== "start"
      ? { current: step.progress, total: step.total }
      : null;

  const contentPadTop = progressMeta ? "pt-10" : "pt-14";

  let inner: ReactNode;

  if (done) {
    inner = (
      <>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-14">
          <div className="flex flex-col gap-10 pb-4">
            <p className="text-center text-[32px] font-semibold leading-8 tracking-[-1.6px] text-white">
              You&apos;re all set
            </p>
            <p className="text-center text-[16px] font-normal leading-5 tracking-[-0.128px] text-[#d5d5d8]">
              Thanks for answering — your personalized speaking plan is ready
              whenever you are.
            </p>
          </div>
        </div>
        <ButtonWrapper>
          <PrimaryButton onClick={restart}>Start over</PrimaryButton>
        </ButtonWrapper>
      </>
    );
  } else if (step?.kind === "start") {
    inner = (
      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col ${contentPadTop}`}
      >
        <ScreenStart
          headline={step.headline}
          question={step.question}
          options={step.options}
          onOptionSelect={goNext}
        />
      </div>
    );
  } else if (step?.kind === "title-single") {
    inner = (
      <div className={`flex flex-col gap-10 px-4 pb-14 ${contentPadTop}`}>
        <div className="flex flex-col gap-10">
          <div className="flex gap-2">
            <Mascot />
            <QuizMessage>
              <p className="w-full text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-white">
                {step.question}
              </p>
              {step.subtitle ? (
                <p className="w-full text-[16px] font-normal leading-5 tracking-[-0.128px] text-[#d5d5d8]">
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
          className={`flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto px-4 pb-36 ${contentPadTop}`}
        >
          <div className="flex flex-col gap-10">
            <div className="flex gap-2">
              <Mascot />
              <QuizMessage>
                <p className="w-full text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-white">
                  {step.question}
                </p>
                {step.subtitle ? (
                  <p className="w-full text-[16px] font-normal leading-5 tracking-[-0.128px] text-[#d5d5d8]">
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
        <ButtonWrapper>
          <PrimaryButton disabled={!canContinue} onClick={goNext}>
            Continue
          </PrimaryButton>
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
    const isLanguage = step.progress === 7;
    const isWorkField = step.question === "What field do you work in?";
    const hasAllowCustom = step.options.some((o) => o.allowCustomText);
    const showStickyOther =
      hasAllowCustom &&
      (isWorkField || isLanguage) &&
      subtleOtherText.trim().length > 0;
    const scrollPadBottom = showStickyOther ? "pb-36" : "pb-14";

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
          className={`flex flex-col gap-10 px-4 ${scrollPadBottom} ${contentPadTop} ${
            isLanguage ? "max-h-[100dvh] min-h-0 flex-1 overflow-y-auto" : ""
          }`}
        >
          <div className="flex flex-col gap-10">
            <div className="flex gap-2">
              <Mascot />
              <QuizMessage>
                <p className="w-full text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-white">
                  {step.question}
                </p>
                {step.subtitle ? (
                  <p className="w-full text-[16px] font-normal leading-5 tracking-[-0.128px] text-[#d5d5d8]">
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
        </div>
        {showStickyOther ? (
          <ButtonWrapper>
            <PrimaryButton
              disabled={!subtleOtherText.trim()}
              onClick={submitCustomOther}
            >
              Continue
            </PrimaryButton>
          </ButtonWrapper>
        ) : null}
      </>
    );
  } else if (step?.kind === "plain-single") {
    inner = (
      <div className={`flex flex-col gap-10 px-4 pb-14 ${contentPadTop}`}>
        <div className="flex flex-col gap-10">
          <div className="flex gap-2">
            <Mascot />
            <QuizMessage>
              <p className="w-full text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-white">
                {step.question}
              </p>
              {step.subtitle ? (
                <p className="w-full text-[16px] font-normal leading-5 tracking-[-0.128px] text-[#d5d5d8]">
                  {step.subtitle}
                </p>
              ) : null}
            </QuizMessage>
          </div>
          <div className="flex flex-col gap-2">
            {step.options.map((opt) => (
              <PlainRow key={opt.id} option={opt} onSelect={goNext} />
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    inner = null;
  }

  /** ScreenStart: full-bleed base black; OptionsWrapper alone carries the sheet gradient. */
  const fullBleedShell =
    !done && step?.kind === "start"
      ? "bg-black"
      : "quiz-shell-gradient";

  return (
    <div
      className={`flex min-h-0 w-full flex-1 flex-col ${fullBleedShell}`}
    >
    <QuizFrame>
      <div className="flex min-h-0 flex-1 flex-col">
        {progressMeta ? (
          <div className="shrink-0 px-4 pt-14">
            <ProgressBar
              current={progressMeta.current}
              total={progressMeta.total}
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
    </QuizFrame>
    </div>
  );
}
