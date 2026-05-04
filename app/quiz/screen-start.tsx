"use client";

import type { TitleTextOption } from "./steps";
import { OptionsWrapper } from "./options-wrapper";
import { SocialProof } from "./ui";

type ScreenStartProps = {
  headline: string;
  question: string;
  options: TitleTextOption[];
  onOptionSelect: () => void;
};

/**
 * ScreenStart — Figma `39:536`: hero `39:753` (gap 24, px 16) + OptionsWrapper `39:600`.
 */
export function ScreenStart({
  headline,
  question,
  options,
  onOptionSelect,
}: ScreenStartProps) {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col gap-10">
      <div className="flex w-full shrink-0 flex-col gap-6 px-4">
        <SocialProof />
        <p className="w-full min-w-0 text-center text-[32px] font-semibold leading-[32px] tracking-[-1.6px] text-white">
          {headline}
        </p>
      </div>

      <OptionsWrapper
        question={question}
        options={options}
        onOptionSelect={onOptionSelect}
      />
    </div>
  );
}
