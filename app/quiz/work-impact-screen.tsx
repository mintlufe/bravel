"use client";

import type { WorkImpactParts } from "./work-impact-copy";
import { PEARSON_NOTE } from "./work-impact-copy";
import {
  ButtonWrapper,
  QuizStickyFooterSlot,
  SheetBlackButton,
  quizStickyScrollGapBottom,
} from "./ui";

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
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
  );
}

type WorkImpactScreenProps = {
  parts: WorkImpactParts;
  onContinue: () => void;
  contentTopClass: string;
};

/** Figma `109:2004` ScreenTeaserWorkSalary — centered copy + Pearson note. */
export function WorkImpactScreen({
  parts,
  onContinue,
  contentTopClass,
}: WorkImpactScreenProps) {
  return (
    <>
      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col items-stretch justify-center gap-6 overflow-y-auto px-4 ${quizStickyScrollGapBottom} ${contentTopClass}`}
      >
        <p className="w-full text-center text-[28px] font-semibold leading-[32px] tracking-[-1.4px]">
          <span className="text-[#FEC443]">{parts.a}</span>
          <span className="text-white">{parts.b}</span>
          <span className="text-[#67E997]">{parts.c}</span>
          {parts.cTailWhite ? (
            <span className="text-white">{parts.cTailWhite}</span>
          ) : null}
          <span className="text-white">{parts.d}</span>
        </p>
        <div className="mx-auto w-full max-w-[361px]">
          <div className="flex w-full items-center gap-[0.48rem] rounded-[0.8rem] bg-white/20 px-[0.4rem] py-[0.8rem]">
            <BookIcon className="size-5 shrink-0 text-white/90" />
            <p className="min-w-0 flex-1 text-left text-[14px] font-normal leading-[18px] tracking-[-0.112px] text-white/80">
              {PEARSON_NOTE}
            </p>
          </div>
        </div>
      </div>
      <QuizStickyFooterSlot />
      <ButtonWrapper>
        <SheetBlackButton onClick={onContinue}>Continue</SheetBlackButton>
      </ButtonWrapper>
    </>
  );
}
