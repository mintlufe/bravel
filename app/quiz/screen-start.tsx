"use client";

import type { StartChoiceOption } from "./steps";
import { Mascot, QuizMessage, SocialProof, VectorBeamsBackground } from "./ui";

type ScreenStartProps = {
  headline: string;
  socialUsers: string;
  socialLine1: string;
  socialLine2: string;
  question: string;
  questionSub?: string;
  options: StartChoiceOption[];
  onOptionSelect: () => void;
};

/**
 * Figma `87:1151` ScreenStart — blue hero + social proof + light Options sheet.
 * Uses {@link Mascot} with existing CSS eye motion (`globals.css`).
 */
export function ScreenStart({
  headline,
  socialUsers,
  socialLine1,
  socialLine2,
  question,
  questionSub,
  options,
  onOptionSelect,
}: ScreenStartProps) {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-x-hidden overflow-y-auto bg-gradient-to-b from-[#05a8ff] to-[#057ccc] pt-10">
      <VectorBeamsBackground />
      <div className="relative z-[1] flex w-full shrink-0 flex-col gap-10 px-4 pb-6">
        <p className="w-full min-w-0 text-center text-[32px] font-semibold leading-8 tracking-[-1.6px] text-white">
          {headline}
        </p>
        <SocialProof
          usersTitle={socialUsers}
          line1={socialLine1}
          line2={socialLine2}
        />
      </div>

      <div className="relative z-[1] mt-auto flex w-full flex-col items-stretch">
        <div className="flex w-full justify-center px-10">
          <div className="h-4 w-full rounded-t-2xl bg-[#70cfff]" />
        </div>
        <div
          className="flex min-h-[448px] w-full flex-col gap-10 rounded-t-[32px] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-10"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, #f2fbff 55%, #cdf0fe 100%)",
          }}
        >
          <div className="flex w-full shrink-0 items-start gap-2">
            <Mascot />
            <QuizMessage tone="light">
              <p className="w-full text-left text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-[#22262f]">
                {question}
              </p>
              {questionSub ? (
                <p className="w-full text-left text-[16px] font-normal leading-[22px] tracking-[-0.128px] text-[#464e62] opacity-90">
                  {questionSub}
                </p>
              ) : null}
            </QuizMessage>
          </div>

          <div className="flex w-full flex-col gap-2">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={onOptionSelect}
                className="quiz-transition-interactive flex min-h-[80px] w-full items-center gap-3 rounded-2xl border border-[#ebeef5] bg-[#f5f6fa] p-4 text-left hover:bg-[#eef0f5] active:scale-[0.99]"
              >
                <span className="shrink-0 text-[24px] leading-6">{opt.emoji}</span>
                <span className="min-w-0 flex-1 text-[16px] font-medium leading-4 tracking-[-0.32px] text-[#22262f]">
                  {opt.label}
                </span>
              </button>
            ))}
            <div
              aria-hidden
              className="shrink-0"
              style={{
                minHeight:
                  "max(3.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))",
                width: "100%",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
