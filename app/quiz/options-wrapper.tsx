"use client";

import type { CSSProperties } from "react";
import type { TitleTextOption } from "./steps";
import { Mascot, QuizMessage, TitleTextRow } from "./ui";

/**
 * Figma `39:600` OptionsWrapper — `get_design_context` (Bravel-test-task):
 * `content-stretch flex flex-col gap-40 items-start px-16 py-40 relative rounded-t-32 size-full` + gradient fill.
 */
const optionsWrapperStyle: CSSProperties = {
  backgroundImage:
    "linear-gradient(179.99999954432812deg, rgb(25, 26, 31) 0%, rgb(25, 26, 31) 69.477%, rgb(36, 38, 74) 86.846%, rgb(64, 61, 202) 108.56%)",
};

export type OptionsWrapperProps = {
  question: string;
  options: TitleTextOption[];
  onOptionSelect: () => void;
};

export function OptionsWrapper({
  question,
  options,
  onOptionSelect,
}: OptionsWrapperProps) {
  return (
    <div
      className="relative flex size-full min-h-0 min-w-0 flex-1 basis-0 flex-col items-start gap-10 self-stretch rounded-t-[32px] px-4 pt-10 [padding-bottom:max(3.5rem,env(safe-area-inset-bottom,0px))]"
      style={optionsWrapperStyle}
      data-name="OptionsWrapper"
      data-node-id="39:600"
    >
      <div
        className="relative flex w-full shrink-0 items-start gap-2"
        data-name="Mascot group"
        data-node-id="39:537"
      >
        <Mascot />
        <QuizMessage>
          <p className="w-full text-left text-[18px] font-semibold leading-[22px] tracking-[-0.36px] text-white">
            {question}
          </p>
        </QuizMessage>
      </div>

      <div
        className="relative flex w-full shrink-0 flex-col items-start gap-2"
        data-name="Option group"
        data-node-id="39:542"
      >
        {options.map((opt) => (
          <TitleTextRow key={opt.id} option={opt} onSelect={onOptionSelect} />
        ))}
      </div>
    </div>
  );
}
